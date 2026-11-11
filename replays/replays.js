/* Recorded assistant conversations, played back when a visitor has no API key.
   Written by tools/make_replays.js from the replay_*.json files in this folder. Do not edit by hand. */
window.CHAT_REPLAYS = [
 {
  "format": "chat-replay-1",
  "title": "Sell an ATM straddle when vol rises 2 vol points",
  "summary": "Vol based entry on a crossing, daily hedge, profit target and stop loss",
  "model": "claude-sonnet-5-5",
  "recorded_utc": "2026-11-10T22:21:42Z",
  "turns": [
   {
    "user": "Sell an ATM straddle when ATM vol rises 2 vol points since the open.",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "text",
        "text": "To confirm the legs: sell 1 call at the money and sell 1 put at the money, on the front expiry. Should the vol condition be a level (true at any snapshot where ATM vol is 2 or more points above today's open) or a crossing (only at the moment it first rises through +2)?"
       },
       {
        "type": "tool_use",
        "id": "toolu_01CL4JiJaXZPW8HiUYh5dqnB",
        "name": "update_rules",
        "caller": {
         "type": "direct"
        },
        "input": {
         "legs": {
          "status": "agreed",
          "text": "Sell 1 call and sell 1 put, both at the money, on the front expiry."
         },
         "size": {
          "status": "open",
          "text": "Number of lots not yet chosen."
         },
         "entry": {
          "status": "asking",
          "text": "Enter when ATM vol is up 2 points since today's open: as a level, or only at the crossing?"
         },
         "hedging": {
          "status": "open",
          "text": "Hedging not yet discussed."
         },
         "exits": {
          "status": "open",
          "text": "Exits not yet discussed."
         }
        }
       }
      ]
     }
    ]
   },
   {
    "user": "sell when ATM vol increases by 2 vol points since the beginning of the session",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "tool_use",
        "id": "toolu_01RmkjHcVtV4oyiJEXX4yHSz",
        "name": "update_rules",
        "caller": {
         "type": "direct"
        },
        "input": {
         "legs": {
          "status": "agreed",
          "text": "Sell 1 call and sell 1 put, both at the money, on the front expiry."
         },
         "size": {
          "status": "open",
          "text": "Number of lots not yet chosen."
         },
         "entry": {
          "status": "asking",
          "text": "Enter when ATM vol is up 2 points since today's open: as a level, or only at the crossing?"
         },
         "hedging": {
          "status": "open",
          "text": "Hedging not yet discussed."
         },
         "exits": {
          "status": "open",
          "text": "Exits not yet discussed."
         }
        }
       }
      ]
     },
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "end_turn",
      "content": [
       {
        "type": "text",
        "text": "Level or crossing for the entry?"
       }
      ]
     }
    ]
   },
   {
    "user": "cross for the entry",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "text",
        "text": "Entry is the crossing: it triggers when ATM vol first rises through +2 points since the session start. How many straddles do you want to sell, for example 10 lots?"
       },
       {
        "type": "tool_use",
        "id": "toolu_01QUrAAf3B7AVqqGQznCmdWz",
        "name": "update_rules",
        "caller": {
         "type": "direct"
        },
        "input": {
         "legs": {
          "status": "agreed",
          "text": "Sell 1 call and sell 1 put, both at the money, on the front expiry."
         },
         "size": {
          "status": "asking",
          "text": "How many lots, e.g. 10 fixed lots?"
         },
         "entry": {
          "status": "agreed",
          "text": "Enter at the moment ATM vol crosses up through +2 points since today's open."
         },
         "hedging": {
          "status": "open",
          "text": "Hedging not yet discussed."
         },
         "exits": {
          "status": "open",
          "text": "Exits not yet discussed."
         }
        }
       }
      ]
     }
    ]
   },
   {
    "user": "20 lots each, and I would like to hedge once per day at the end of the session",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "tool_use",
        "id": "toolu_01T6NwTRHkJt8GxJVt9U2757",
        "name": "update_rules",
        "caller": {
         "type": "direct"
        },
        "input": {
         "legs": {
          "status": "agreed",
          "text": "Sell 1 call and sell 1 put, both at the money, on the front expiry."
         },
         "size": {
          "status": "agreed",
          "text": "20 fixed lots."
         },
         "entry": {
          "status": "agreed",
          "text": "Enter at the moment ATM vol crosses up through +2 points since today's open."
         },
         "hedging": {
          "status": "agreed",
          "text": "Delta hedge once a day at the last snapshot of the session (and at entry)."
         },
         "exits": {
          "status": "asking",
          "text": "Proposed: take profit $10,000, stop loss $10,000, or none (run until the roll)?"
         }
        }
       }
      ]
     },
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "end_turn",
      "content": [
       {
        "type": "text",
        "text": "Which exits do you want?"
       }
      ]
     }
    ]
   },
   {
    "user": "stop loss -10k , with take profit +15k USD",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "text",
        "text": "The strategy sells 20 ATM straddles when ATM vol crosses up through +2 points since the open, hedges daily at the close, takes profit at $15,000 and stops out at a $10,000 loss. Without a time exit, a trade that hits neither runs until the roll."
       },
       {
        "type": "tool_use",
        "id": "toolu_019pzH4bD5EHapEcMLLuw3N7",
        "name": "set_strategy",
        "caller": {
         "type": "direct"
        },
        "input": {
         "strategy": {
          "schema_version": "1.1",
          "name": "Short ATM straddle on vol rise",
          "description": "Sell 20 at the money straddles on the front expiry when ATM vol crosses up through 2 vol points above the session open. Delta hedge once a day at the close. Take profit at $15,000, stop loss at $10,000.",
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
           "lots": 20
          },
          "entry": {
           "entry_conditions": [
            {
             "metric": "atm_iv_change_pts",
             "window": {
              "since": "session_start"
             },
             "is": "crosses_above",
             "value": 2
            }
           ]
          },
          "hedging": {
           "mode": "daily_close"
          },
          "exits": {
           "pnl": {
            "take_profit": {
             "usd": 15000
            },
            "stop_loss": {
             "usd": 10000
            }
           }
          }
         }
        }
       }
      ]
     }
    ]
   }
  ]
 },
 {
  "format": "chat-replay-1",
  "title": "Sell put spread if spot drops 1%",
  "summary": "Spot drop trigger, a put 3% lower as protection, hourly hedge",
  "model": "claude-sonnet-5-5",
  "recorded_utc": "2026-11-10T22:28:08Z",
  "turns": [
   {
    "user": "I am thinking about selling an ATM put spread if spot falls by more than 1% since the beginning of the session",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "text",
        "text": "Sell an ATM put and buy a lower-strike put to define the risk, entering when spot is down 1% or more since the session start. How far below spot should the long put be, for example 3% below?"
       },
       {
        "type": "tool_use",
        "id": "toolu_01HSS4os3UwGVUzQkrYtCVeJ",
        "name": "update_rules",
        "caller": {
         "type": "direct"
        },
        "input": {
         "legs": {
          "status": "asking",
          "text": "Sell 1 ATM put, buy 1 put lower; how far below spot is the long put (for example 3% below)?"
         },
         "size": {
          "status": "open",
          "text": "Not discussed yet."
         },
         "entry": {
          "status": "open",
          "text": "When spot is down 1% or more since the session start; level or crossing still to confirm."
         },
         "hedging": {
          "status": "open",
          "text": "Not discussed yet."
         },
         "exits": {
          "status": "open",
          "text": "Not discussed yet."
         }
        }
       }
      ]
     }
    ]
   },
   {
    "user": "when the spot is down 1% or more since the session start. Regarding the structure, the put that I buy (second leg) is 3% below spot level",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "tool_use",
        "id": "toolu_015hQvHmWU3Z14ntVJv8Lz9C",
        "name": "update_rules",
        "caller": {
         "type": "direct"
        },
        "input": {
         "legs": {
          "status": "agreed",
          "text": "Sell 1 put at the money, buy 1 put 3% below spot."
         },
         "size": {
          "status": "open",
          "text": "Not discussed yet."
         },
         "entry": {
          "status": "asking",
          "text": "Spot down 1% or more since session start: while it holds (level) or only when it first falls through (crossing)?"
         },
         "hedging": {
          "status": "open",
          "text": "Not discussed yet."
         },
         "exits": {
          "status": "open",
          "text": "Not discussed yet."
         }
        }
       }
      ]
     },
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "end_turn",
      "content": [
       {
        "type": "text",
        "text": "Please tell me whether entry should be a level or a crossing, as asked above."
       }
      ]
     }
    ]
   },
   {
    "user": "Spot should cross -1% since the start",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "text",
        "text": "Entry is a crossing of -1%, so a trade opens only at the snapshot where spot goes through it. How many lots do you want to sell, for example 10?"
       },
       {
        "type": "tool_use",
        "id": "toolu_01AbyzhLQ7QtYEimaeBp5Wo2",
        "name": "update_rules",
        "caller": {
         "type": "direct"
        },
        "input": {
         "legs": {
          "status": "agreed",
          "text": "Sell 1 put at the money, buy 1 put 3% below spot."
         },
         "size": {
          "status": "asking",
          "text": "How many lots (for example 10)?"
         },
         "entry": {
          "status": "agreed",
          "text": "Enter when spot crosses down through -1% since the session start."
         },
         "hedging": {
          "status": "open",
          "text": "Not discussed yet."
         },
         "exits": {
          "status": "open",
          "text": "Not discussed yet."
         }
        }
       }
      ]
     }
    ]
   },
   {
    "user": "I want to trade the whole structure in 10 lots and hedge once per hour",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "text",
        "text": "Got it: 10 lots, delta hedged every hour. For exits, I suggest a take profit of $5,000, a stop loss of $5,000, and closing 30 minutes before the close. Do you agree, or do you want something else?"
       },
       {
        "type": "tool_use",
        "id": "toolu_01B1SM6p4S3V219rrFXPLwAX",
        "name": "update_rules",
        "caller": {
         "type": "direct"
        },
        "input": {
         "legs": {
          "status": "agreed",
          "text": "Sell 1 put at the money, buy 1 put 3% below spot."
         },
         "size": {
          "status": "agreed",
          "text": "10 lots."
         },
         "entry": {
          "status": "agreed",
          "text": "Enter when spot crosses down through -1% since the session start."
         },
         "hedging": {
          "status": "agreed",
          "text": "Delta hedge every hour."
         },
         "exits": {
          "status": "asking",
          "text": "Proposed: take profit $5,000, stop loss $5,000, close 30 minutes before the close. Agree?"
         }
        }
       }
      ]
     }
    ]
   },
   {
    "user": "ok, let's go with stop loss and take profit at 5k each",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "tool_use",
        "id": "toolu_01C8JaPHrawqLXMCsG9ASMi9",
        "name": "set_strategy",
        "caller": {
         "type": "direct"
        },
        "input": {
         "strategy": {
          "schema_version": "1.1",
          "name": "ATM put spread on -1% spot drop",
          "description": "Sell an ATM put and buy a put 3% below spot, 10 lots, when spot crosses down through -1% since the session start. Delta hedge every hour. Take profit at $5,000, stop loss at $5,000.",
          "structure": [
           {
            "leg_name": "short_put",
            "type": "put",
            "leg_quantity": -1,
            "strike": {
             "rule": "spot_offset",
             "offset_pct": 0
            }
           },
           {
            "leg_name": "long_put",
            "type": "put",
            "leg_quantity": 1,
            "strike": {
             "rule": "spot_offset",
             "offset_pct": -3
            }
           }
          ],
          "size": {
           "rule": "lots",
           "lots": 10
          },
          "entry": {
           "entry_conditions": [
            {
             "metric": "spot_change_pct",
             "window": {
              "since": "session_start"
             },
             "is": "crosses_below",
             "value": -1
            }
           ]
          },
          "hedging": {
           "mode": "every_hours",
           "hours": 1
          },
          "exits": {
           "pnl": {
            "take_profit": {
             "usd": 5000
            },
            "stop_loss": {
             "usd": 5000
            }
           }
          }
         }
        }
       }
      ]
     }
    ]
   }
  ]
 },
 {
  "format": "chat-replay-1",
  "title": "Buy straddle once per day",
  "summary": "Long straddle at the open, closed 30 minutes before the close, no hedge",
  "model": "claude-sonnet-5-5",
  "recorded_utc": "2026-11-10T22:30:44Z",
  "turns": [
   {
    "user": "I want to buy an atm straddle, once per day at the open and close it in the afternoon, before market close. No delta hedge",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "end_turn",
      "content": [
       {
        "type": "text",
        "text": "To confirm the legs: buy 1 call and buy 1 put, both at the money on the front expiry. How many straddles per trade, for example 10 lots?"
       },
       {
        "type": "tool_use",
        "id": "toolu_01EW2RRDpVKMfpdVou43Boxs",
        "name": "update_rules",
        "caller": {
         "type": "direct"
        },
        "input": {
         "legs": {
          "status": "agreed",
          "text": "Buy 1 at the money call and buy 1 at the money put on the front expiry."
         },
         "size": {
          "status": "asking",
          "text": "How many straddles per trade, for example 10 lots?"
         },
         "entry": {
          "status": "open",
          "text": "Once per day near the open, no conditions so far."
         },
         "hedging": {
          "status": "agreed",
          "text": "No delta hedging."
         },
         "exits": {
          "status": "open",
          "text": "Close in the afternoon before the market close, time to be set."
         }
        }
       }
      ]
     }
    ]
   },
   {
    "user": "10 lots each leg",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "text",
        "text": "Got it, 10 lots. For the afternoon close, how many minutes before the market close should it exit, for example 30 minutes (15:30 on a normal day)?"
       },
       {
        "type": "tool_use",
        "id": "toolu_01SeVc83q436JocWsTYHtwu9",
        "name": "update_rules",
        "caller": {
         "type": "direct"
        },
        "input": {
         "legs": {
          "status": "agreed",
          "text": "Buy 1 at the money call and buy 1 at the money put on the front expiry."
         },
         "size": {
          "status": "agreed",
          "text": "10 lots per trade."
         },
         "entry": {
          "status": "open",
          "text": "Once per day at the open, window to be set, no conditions so far."
         },
         "hedging": {
          "status": "agreed",
          "text": "No delta hedging."
         },
         "exits": {
          "status": "asking",
          "text": "How many minutes before the close should it exit, for example 30?"
         }
        }
       }
      ]
     }
    ]
   },
   {
    "user": "yes, 30 minutes before market close works well",
    "responses": [
     {
      "model": "claude-sonnet-5-5",
      "stop_reason": "tool_use",
      "content": [
       {
        "type": "text",
        "text": "I'll buy 10 at the money straddles (1 call and 1 put each) on the front expiry at the open, from 09:30 to 10:00, with no hedging, and close them 30 minutes before the market close."
       },
       {
        "type": "tool_use",
        "id": "toolu_016qzFD2bPW9B5c59tE6MRzE",
        "name": "set_strategy",
        "caller": {
         "type": "direct"
        },
        "input": {
         "strategy": {
          "schema_version": "1.1",
          "name": "Long ATM straddle, daily intraday",
          "description": "Buy 10 at the money straddles on the front expiry once per day at the open, no delta hedging, close 30 minutes before the market close.",
          "structure": [
           {
            "leg_name": "long_call",
            "type": "call",
            "leg_quantity": 1,
            "strike": {
             "rule": "spot_offset",
             "offset_pct": 0
            }
           },
           {
            "leg_name": "long_put",
            "type": "put",
            "leg_quantity": 1,
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
            "from": "09:30",
            "to": "10:00"
           },
           "entry_conditions": []
          },
          "hedging": {
           "mode": "none"
          },
          "exits": {
           "time_exit": {
            "minutes_before_close": 30
           }
          }
         }
        }
       }
      ]
     }
    ]
   }
  ]
 }
];
