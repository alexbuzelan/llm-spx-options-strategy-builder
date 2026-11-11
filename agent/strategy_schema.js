/* Strategy schema: the JSON format the assistant writes and the engine runs.
   The validator builds its checks from this object, and it is sent to the Claude API with the chat rules.
   Loaded by index.html as a script so the page also works when opened from disk. */
window.STRATEGY_SCHEMA = {
  "schema_version": "1.1",
  "status": "The validator reads this schema and checks strategies against it, including fields required under a rule and the cross rules. Format 1.1 adds crossing conditions; files written as 1.0 stay valid.",
  "general": [
    {
      "title": "Strict",
      "text": "Unknown keys, missing keys, wrong types and bad values are errors. Nothing is silently ignored. Fields that belong to another rule are errors too (for example lots when the size rule is target_vega)."
    },
    {
      "title": "All errors at once",
      "text": "The validator returns every error, not only the first, each with a path, a code and a message, for example path /structure/1/strike/call_delta, code out_of_range, message call_delta must be between 1 and 99, got 125."
    },
    {
      "title": "No hidden defaults",
      "text": "A field is either required, or optional with one documented meaning when absent."
    },
    {
      "title": "Units in the names",
      "text": "_days and _minutes are calendar time, _pct is percent (50 means 50%), _pts is vol points (18 means 18% implied vol), _usd is dollars, _contracts is contracts of the hedge instrument, _et is New York time written HH:MM."
    },
    {
      "title": "Plain language",
      "text": "Fields use the words an average person would use to describe a trade, so an LLM can fill them without guessing."
    },
    {
      "title": "Saved with every result",
      "text": "The strategy is saved inside every result, exactly as it ran, next to the backtest settings."
    },
    {
      "title": "Not in the strategy",
      "text": "The underlying (the data file defines it) and the platform rules: front expiry only, the roll, the end of the sample, one trade at a time, no reopening on the same day, realized vol sampling. See Settings, Backtest."
    }
  ],
  "sections": [
    {
      "key": "top",
      "title": "Top level",
      "intro": "A strategy is one JSON object with these keys, and no others.",
      "fields": [
        {
          "name": "schema_version",
          "type": "version",
          "required": true,
          "desc": "Format version, written major.minor, for example 1.0. The engine accepts files with its own major version and rejects the rest."
        },
        {
          "name": "name",
          "type": "text",
          "min": 1,
          "max": 80,
          "required": true,
          "desc": "Short label shown in results."
        },
        {
          "name": "description",
          "type": "text",
          "max": 2000,
          "required": false,
          "absent": "no description",
          "desc": "The strategy in plain words, as the user described it."
        },
        {
          "name": "structure",
          "type": "list",
          "of": "leg",
          "min_items": 1,
          "max_items": 2,
          "required": true,
          "desc": "The options traded together: one leg, or two. See Structure."
        },
        {
          "name": "size",
          "type": "object",
          "required": true,
          "desc": "How many lots each trade opens. See Size."
        },
        {
          "name": "entry",
          "type": "object",
          "required": true,
          "desc": "When a trade opens. See Entry."
        },
        {
          "name": "hedging",
          "type": "object",
          "required": true,
          "desc": "How the book is delta hedged. See Hedging."
        },
        {
          "name": "exits",
          "type": "object",
          "required": true,
          "desc": "When a trade closes, on top of the platform exits. Required as a section, but it may be empty. See Exits."
        }
      ]
    },
    {
      "key": "structure",
      "title": "Structure",
      "intro": "The structure is one leg or two, all on the front expiry. Each leg is an option (call or put) with a signed leg_quantity: positive buys at entry, negative sells. Strikes are found at entry, snapped to the nearest strike in the backtest strike list (the lower one on an exact tie), and kept for the whole trade. Straddles, strangles, risk reversals, call spreads, put spreads and ratio spreads are all possible.",
      "fields": [
        {
          "name": "structure[].leg_name",
          "type": "id",
          "min": 1,
          "max": 20,
          "required": true,
          "desc": "Short name of the leg, unique in the strategy, shown in logs and results. Letters, digits and underscores. It is only a label: the engine reads type and leg_quantity, never the name."
        },
        {
          "name": "structure[].type",
          "type": "one_of",
          "values": [
            "call",
            "put"
          ],
          "required": true,
          "desc": "Option type."
        },
        {
          "name": "structure[].leg_quantity",
          "type": "integer",
          "not_zero": true,
          "unit": "contracts per lot",
          "required": true,
          "desc": "Contracts of this leg per lot, with a sign: positive buys at entry, negative sells. -1 sells one, +1 buys one; +1 and -2 give a 1x2 ratio spread. Zero is not allowed. Contracts traded = lots x leg_quantity."
        },
        {
          "name": "structure[].strike",
          "type": "object",
          "required": true,
          "desc": "How the strike is chosen at entry."
        },
        {
          "name": "structure[].strike.rule",
          "type": "one_of",
          "values": [
            "call_delta",
            "spot_offset"
          ],
          "required": true,
          "desc": "call_delta: by delta, on the call delta scale. spot_offset: by distance from spot, in percent."
        },
        {
          "name": "structure[].strike.call_delta",
          "type": "number",
          "min": 1,
          "max": 99,
          "unit": "call delta x 100",
          "required_when": "strike.rule is call_delta",
          "desc": "Target call delta, on the call delta scale only: 25 is a 25 delta call, 75 is a 25 delta put (a put at X delta is 100 minus X). Plain N(d1) of Black-76, found on the front smile at the entry snapshot."
        },
        {
          "name": "structure[].strike.offset_pct",
          "type": "number",
          "unit": "percent of spot",
          "required_when": "strike.rule is spot_offset",
          "desc": "Distance from the spot at the entry snapshot: 0 is at the money, 5 is 5% above spot, a negative number is below spot. The strike is spot x (1 + offset_pct / 100)."
        }
      ]
    },
    {
      "key": "size",
      "title": "Size",
      "intro": "One rule, the same for every trade of the backtest. Contracts traded per leg = lots x the leg's leg_quantity, with its sign.",
      "fields": [
        {
          "name": "size.rule",
          "type": "one_of",
          "values": [
            "lots",
            "target_vega"
          ],
          "required": true,
          "desc": "lots: a fixed number of lots. target_vega: the lots that give a target vega at entry."
        },
        {
          "name": "size.lots",
          "type": "integer",
          "min": 1,
          "required_when": "size.rule is lots",
          "desc": "Number of lots, for example 10 to sell 10 straddles."
        },
        {
          "name": "size.vega_usd",
          "type": "number",
          "min_exclusive": 0,
          "unit": "dollars per 1 vol point",
          "required_when": "size.rule is target_vega",
          "desc": "Target vega of the whole structure, measured once at entry. Lots = target / vega of one lot, rounded to the nearest whole lot (the lower one on an exact tie). Zero lots means no entry. The trade log shows the lots and the vega reached."
        },
        {
          "name": "size.max_lots",
          "type": "integer",
          "min": 1,
          "required_when": "size.rule is target_vega",
          "desc": "Cap on the lots, for structures whose leg vegas cancel out, like risk reversals. If the target needs more, the trade opens with max_lots. For now 100."
        }
      ]
    },
    {
      "key": "entry",
      "title": "Entry",
      "intro": "A trade opens at the first snapshot where entry is allowed and all entry conditions are true, and is executed at that same snapshot. With no conditions, it opens at the first allowed snapshot. Entry is not allowed while a trade is open, on the front expiry's roll day, after a close on the same day, or after the end of the sample (platform rules).",
      "fields": [
        {
          "name": "entry.window_et",
          "type": "object",
          "required": false,
          "absent": "any time of day",
          "desc": "Entries only between these New York times."
        },
        {
          "name": "entry.window_et.from",
          "type": "time",
          "required": true,
          "desc": "Start of the window, HH:MM New York time, included."
        },
        {
          "name": "entry.window_et.to",
          "type": "time",
          "required": true,
          "desc": "End of the window, HH:MM New York time, included. Must be later than from."
        },
        {
          "name": "entry.weekdays",
          "type": "list",
          "of": "one_of: mon, tue, wed, thu, fri",
          "min_items": 1,
          "max_items": 5,
          "required": false,
          "absent": "any weekday",
          "desc": "Entries only on these days. No duplicates."
        },
        {
          "name": "entry.entry_conditions",
          "type": "list",
          "of": "condition",
          "min_items": 0,
          "required": true,
          "desc": "Conditions that must ALL be true at the same snapshot (AND). An empty list means no condition. See Conditions."
        }
      ]
    },
    {
      "key": "hedging",
      "title": "Hedging",
      "intro": "One mode per strategy, for the whole book. Any mode other than none also hedges at entry. Every hedge brings delta back to zero, rounded to the nearest whole contract (the lower size on an exact half); a size of zero sends no order. Delta is counted in contracts of the hedge instrument, which comes from the backtest settings. At each snapshot, option orders come first, then one delta step, which also runs whenever an option trade happened at that snapshot, so the hedge closes with the trade.",
      "fields": [
        {
          "name": "hedging.mode",
          "type": "one_of",
          "values": [
            "none",
            "every_hours",
            "daily_close",
            "delta_threshold"
          ],
          "required": true,
          "desc": "none: no hedging. every_hours: every N hours, counted from the 09:30 open each day, at the first snapshot at or after each time. daily_close: at the last snapshot of each session. delta_threshold: whenever the net delta reaches a size, in either direction."
        },
        {
          "name": "hedging.hours",
          "type": "integer",
          "min": 1,
          "required_when": "hedging.mode is every_hours",
          "desc": "Whole hours between hedges. With 2: 11:30, 13:30, 15:30."
        },
        {
          "name": "hedging.above_delta_contracts",
          "type": "number",
          "min_exclusive": 0,
          "unit": "hedge contracts",
          "required_when": "hedging.mode is delta_threshold",
          "desc": "Hedge whenever the absolute net delta is this size or more (the number included)."
        }
      ]
    },
    {
      "key": "exits",
      "title": "Exits",
      "intro": "Three families of strategy exits: P&L signals, market signals (exit conditions) and a time exit. Every exit signal is optional, and none is required: the LLM proposes an exit strategy to the user. With no strategy exit, the trade runs until the roll or the end of the sample. The first signal that fires closes the whole trade, with its reason in the trade log (take profit, stop loss, exit condition, time). Checked at every snapshot after entry, never on the entry snapshot. Platform exits (the roll, the end of the sample) always apply on top.",
      "fields": [
        {
          "name": "exits.pnl",
          "type": "object",
          "required": false,
          "absent": "no P&L signal",
          "desc": "P&L signals, on the trade's total P&L: options at theo, plus its hedges, minus fees and spread already paid. If present, it holds take_profit, stop_loss or both."
        },
        {
          "name": "exits.pnl.take_profit",
          "type": "object",
          "required": false,
          "absent": "no take profit",
          "desc": "Close when the trade's P&L is this profit or more. Exactly one of usd or pct_of_premium."
        },
        {
          "name": "exits.pnl.stop_loss",
          "type": "object",
          "required": false,
          "absent": "no stop loss",
          "desc": "Close when the trade's loss is this amount or more. Exactly one of usd or pct_of_premium."
        },
        {
          "name": "exits.pnl.*.usd",
          "type": "number",
          "min_exclusive": 0,
          "unit": "dollars",
          "required": false,
          "desc": "Target in dollars, as a positive number. Always allowed."
        },
        {
          "name": "exits.pnl.*.pct_of_premium",
          "type": "number",
          "min_exclusive": 0,
          "unit": "percent of premium",
          "required": false,
          "desc": "Target in percent of the premium: the net premium paid or received at entry, in dollars, as a positive number (for a strangle, both premiums added). Only allowed without hedging and for a single leg, a straddle or a strangle (see Cross rules)."
        },
        {
          "name": "exits.exit_conditions",
          "type": "list",
          "of": "condition",
          "min_items": 1,
          "required": false,
          "absent": "no market signal",
          "desc": "Market signals: ANY one true closes the trade (OR). Same format as entry conditions. See Conditions."
        },
        {
          "name": "exits.time_exit",
          "type": "object",
          "required": false,
          "absent": "no time exit",
          "desc": "Close the trade at a time of day, relative to the session's close."
        },
        {
          "name": "exits.time_exit.minutes_before_close",
          "type": "integer",
          "min": 1,
          "unit": "minutes",
          "required": true,
          "desc": "Close at the first snapshot at or after this many minutes before the session's close: with 30, at 15:30 on a normal day, at 12:30 on a 13:00 early close. The close of each day is the time of that session's last snapshot. An exact clock time is not possible."
        }
      ]
    },
    {
      "key": "condition",
      "title": "Conditions",
      "intro": "Used in entry.entry_conditions (all must be true) and exits.exit_conditions (any one is enough). Every measure is read from the front expiry at the current snapshot, using only past and current snapshots. A condition is a level (above, below: true at every snapshot on that side) or a crossing (crosses_above, crosses_below: true only at the snapshot where the value goes through the level, from 1.1).",
      "fields": [
        {
          "name": "metric",
          "type": "one_of",
          "values": [
            "atm_iv_pts",
            "atm_iv_change_pts",
            "spot_change_pct",
            "realized_vol_pct",
            "iv_rv_gap_pts",
            "skew_put_minus_call_pts",
            "skew_put_minus_atm_pts"
          ],
          "required": true,
          "desc": "What is measured. See Measures."
        },
        {
          "name": "window",
          "type": "object",
          "required_when": "the metric needs a window",
          "desc": "The time window to compare against. Required for the metrics marked as needing one, and not allowed for the others. Exactly one of since, days or minutes."
        },
        {
          "name": "window.since",
          "type": "one_of",
          "values": [
            "session_start",
            "previous_session_start"
          ],
          "required": false,
          "desc": "session_start: from today's first snapshot. previous_session_start: from the previous trading day's first snapshot."
        },
        {
          "name": "window.days",
          "type": "integer",
          "min": 1,
          "required": false,
          "desc": "The same time of day, N trading days back (weekends skipped), using the snapshot at or before that time."
        },
        {
          "name": "window.minutes",
          "type": "integer",
          "min": 1,
          "required": false,
          "desc": "N minutes back, using the snapshot at or before that time."
        },
        {
          "name": "is",
          "type": "one_of",
          "values": [
            "above",
            "below",
            "crosses_above",
            "crosses_below"
          ],
          "required": true,
          "desc": "Levels: above means the value or more; below means the value or less, at every snapshot where it holds. Crossings (from 1.1): crosses_above is true only at the snapshot where the measure reaches the value or more while the previous snapshot of the same day was below it; crosses_below the other way round. The first snapshot of a day never crosses, and a missing value now or at the previous snapshot gives no cross. A crossing is not remembered: if entry is not allowed at that snapshot, the signal is lost."
        },
        {
          "name": "value",
          "type": "number",
          "unit": "the metric's unit",
          "required": true,
          "desc": "The level to compare with."
        }
      ]
    }
  ],
  "measures": [
    {
      "metric": "atm_iv_pts",
      "unit": "vol points",
      "window": false,
      "desc": "At the money implied vol: the vol at the strike equal to spot, on the front smile."
    },
    {
      "metric": "atm_iv_change_pts",
      "unit": "vol points",
      "window": true,
      "desc": "Change in at the money vol over the window, measured on the same expiry, so a roll is never read as a vol jump."
    },
    {
      "metric": "spot_change_pct",
      "unit": "percent",
      "window": true,
      "desc": "Spot change over the window."
    },
    {
      "metric": "realized_vol_pct",
      "unit": "percent, per year",
      "window": true,
      "desc": "Realized vol over the window: spot sampled on a 5 minute grid (a backtest setting), overnight jump included, annualized in trading time (252 days of 6.5 hours). With since session_start, it only counts from 1 hour after the open; before that, the condition is not met."
    },
    {
      "metric": "iv_rv_gap_pts",
      "unit": "vol points",
      "window": true,
      "desc": "At the money vol minus realized vol over the window. Implied 3 points above realized is is above, value 3."
    },
    {
      "metric": "skew_put_minus_call_pts",
      "unit": "vol points",
      "window": false,
      "desc": "25 delta put vol minus 25 delta call vol (put at call delta 75, call at call delta 25), at the exact strikes, without snapping."
    },
    {
      "metric": "skew_put_minus_atm_pts",
      "unit": "vol points",
      "window": false,
      "desc": "25 delta put vol minus at the money vol, at the exact strikes, without snapping."
    }
  ],
  "cross_rules": [
    {
      "rule": "Leg names are unique.",
      "error": "duplicate_leg_name"
    },
    {
      "rule": "Fields that belong to another rule are not allowed: lots only with size rule lots; vega_usd and max_lots only with target_vega; call_delta only with strike rule call_delta; offset_pct only with spot_offset; hours only with every_hours; above_delta_contracts only with delta_threshold.",
      "error": "not_allowed"
    },
    {
      "rule": "A window is required for atm_iv_change_pts, spot_change_pct, realized_vol_pct and iv_rv_gap_pts, and not allowed for the other metrics. A window has exactly one of since, days or minutes.",
      "error": "window"
    },
    {
      "rule": "entry.window_et.from is earlier than entry.window_et.to.",
      "error": "time_order"
    },
    {
      "rule": "exits.pnl, when present, holds take_profit, stop_loss or both; each holds exactly one of usd or pct_of_premium.",
      "error": "pnl_shape"
    },
    {
      "rule": "pct_of_premium is only allowed when hedging.mode is none, and the structure is a single leg, or a call plus a put with the same leg_quantity (straddle or strangle). Otherwise use usd.",
      "error": "premium_not_allowed"
    }
  ],
  "run_time": [
    "A strike outside the backtest strike list: no entry at that snapshot, with a diagnostic.",
    "Both legs on the same contract (same type and strike after snapping): no entry, with a diagnostic.",
    "Target vega that rounds to zero lots: no entry, with a diagnostic."
  ],
  "examples": [
    {
      "title": "Short 25d strangle on high vol",
      "words": "Sell a 25 delta strangle on the front expiry when its at the money vol is 18 or more, between 10:00 and 15:00. Size it to $10,000 of vega, at most 100 lots. Delta hedge every 2 hours. Take profit at $20,000, stop at $10,000 loss, or close if the vol falls back to 14 or less.",
      "demonstrates": [
        "Strikes by call delta, including the put written as call delta 75.",
        "Sizing by target vega, with the lot cap.",
        "An entry window and one entry condition.",
        "Hedging every 2 hours (11:30, 13:30, 15:30, plus at entry).",
        "Both exit families: P&L signals in dollars (pct_of_premium is not allowed here, since the strategy hedges) and a market signal.",
        "Platform rules on top: the roll on Wednesday at 15:00, and no reopening on the same day."
      ],
      "strategy": {
        "schema_version": "1.0",
        "name": "Short 25d strangle on high vol",
        "description": "Sell a 25 delta strangle on the front expiry when its at the money vol is 18 or more, between 10:00 and 15:00. Size it to $10,000 of vega, at most 100 lots. Delta hedge every 2 hours. Take profit at $20,000, stop at $10,000 loss, or close if the vol falls back to 14 or less.",
        "structure": [
          {
            "leg_name": "short_call",
            "type": "call",
            "leg_quantity": -1,
            "strike": {
              "rule": "call_delta",
              "call_delta": 25
            }
          },
          {
            "leg_name": "short_put",
            "type": "put",
            "leg_quantity": -1,
            "strike": {
              "rule": "call_delta",
              "call_delta": 75
            }
          }
        ],
        "size": {
          "rule": "target_vega",
          "vega_usd": 10000,
          "max_lots": 100
        },
        "entry": {
          "window_et": {
            "from": "10:00",
            "to": "15:00"
          },
          "entry_conditions": [
            {
              "metric": "atm_iv_pts",
              "is": "above",
              "value": 18
            }
          ]
        },
        "hedging": {
          "mode": "every_hours",
          "hours": 2
        },
        "exits": {
          "pnl": {
            "take_profit": {
              "usd": 20000
            },
            "stop_loss": {
              "usd": 10000
            }
          },
          "exit_conditions": [
            {
              "metric": "atm_iv_pts",
              "is": "below",
              "value": 14
            }
          ]
        }
      }
    },
    {
      "title": "Unhedged short ATM straddle, premium exits",
      "words": "Sell 10 at the money straddles on the front expiry, on Mondays and Tuesdays between 10:00 and 11:00, when the at the money vol is at least 3 points above the realized vol since the previous session's open. No delta hedging. Take profit at 50% of the premium received, or stop at a loss of 100% of the premium.",
      "demonstrates": [
        "At the money strikes written as spot_offset 0 (both legs snap to the same strike, which is fine since one is a call and one a put).",
        "Sizing by a fixed number of lots.",
        "An entry window, weekdays, and a condition with a window: implied minus realized vol since the previous session's open.",
        "No hedging (mode none).",
        "Exits in pct_of_premium, allowed here because there is no hedging and the structure is a call plus a put, both with leg_quantity -1. The premium is both credits added together: with $12,000 received, take profit at +$6,000, stop at a loss of $12,000.",
        "No exit_conditions: the two P&L signals are the whole exit strategy."
      ],
      "strategy": {
        "schema_version": "1.0",
        "name": "Unhedged short ATM straddle, premium exits",
        "description": "Sell 10 at the money straddles on the front expiry, on Mondays and Tuesdays between 10:00 and 11:00, when the at the money vol is at least 3 points above the realized vol since the previous session's open. No delta hedging. Take profit at 50% of the premium received, or stop at a loss of 100% of the premium.",
        "structure": [
          {
            "leg_name": "short_call",
            "type": "call",
            "leg_quantity": -1,
            "strike": {
              "rule": "spot_offset",
              "offset_pct": 0
            }
          },
          {
            "leg_name": "short_put",
            "type": "put",
            "leg_quantity": -1,
            "strike": {
              "rule": "spot_offset",
              "offset_pct": 0
            }
          }
        ],
        "size": {
          "rule": "lots",
          "lots": 10
        },
        "entry": {
          "window_et": {
            "from": "10:00",
            "to": "11:00"
          },
          "weekdays": [
            "mon",
            "tue"
          ],
          "entry_conditions": [
            {
              "metric": "iv_rv_gap_pts",
              "window": {
                "since": "previous_session_start"
              },
              "is": "above",
              "value": 3
            }
          ]
        },
        "hedging": {
          "mode": "none"
        },
        "exits": {
          "pnl": {
            "take_profit": {
              "pct_of_premium": 50
            },
            "stop_loss": {
              "pct_of_premium": 100
            }
          }
        }
      }
    }
  ]
};
