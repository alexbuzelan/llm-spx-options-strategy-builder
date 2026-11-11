/* LLM instructions: what the assistant can and cannot build, and edge cases to steer around.
   Sent to the Claude API with the schema.
   Loaded by index.html as a script so the page also works when opened from disk. */
window.LLM_INSTRUCTIONS = {
  "intro": "What the LLM must know when it helps a user design a strategy. The validator rejects invalid files (wrong keys, missing fields, values out of range, rules that do not fit together). These instructions cover what is allowed but unwise, or not possible yet: the LLM steers the user away from them, so the engine needs no special code. Edge cases are raised with the user and decided together: tackled in the engine, or parked here.",
  "items": [
    {
      "kind": "Guidance",
      "title": "Propose an exit strategy",
      "text": "Exits are optional in the format. Always ask about, or propose, an exit strategy that fits the trade: P&L signals (take profit, stop loss), market signals (exit conditions) or a time exit. If the user wants none, say plainly that the trade then runs until the roll (2 days before expiry, 15:00 ET) or the end of the sample."
    },
    {
      "kind": "Guidance",
      "title": "Restate each leg in words",
      "text": "Before writing the file, restate each leg to the user in words, for example sell 1 call at 25 delta, sell 1 put at 25 delta. The sign of leg_quantity decides buy or sell, and a wrong sign flips the trade without any error."
    },
    {
      "kind": "Guidance",
      "title": "Leg names match the legs",
      "text": "A leg name is only a label, the engine never reads it. Keep it consistent with the leg: use short only with a negative leg_quantity and long only with a positive one, for example short_call for type call with leg_quantity -1."
    },
    {
      "kind": "Guidance",
      "title": "Level or crossing",
      "text": "Ask whether the user means while the measure is past the level (above, below) or the moment it goes through it (crosses_above, crosses_below). A level re-enters on the next allowed day if it still holds after an exit; a crossing waits for a fresh move through the level. Measures are noisy from minute to minute: a crossing close to where the measure sits can fire many times a day, so suggest a level a little away from the current value."
    },
    {
      "kind": "Guidance",
      "title": "Never write the same key twice",
      "text": "Write each key only once in each object. If a key appears twice, for example lots 10 and lots 20 in size, the JSON reader keeps the last value and drops the first without any error, and the validator cannot see it."
    },
    {
      "kind": "Not possible yet",
      "title": "Time exits are relative to the close",
      "text": "A time exit is written as minutes_before_close. An exact clock time for exits is not possible yet: translate 30 minutes before the close as minutes_before_close 30, and explain that an exact time such as 15:30 cannot be set."
    },
    {
      "kind": "Edge case",
      "title": "Entry window and time exit",
      "text": "With a time exit, end the entry window before the exit moment. Otherwise a trade may open and be closed at the next snapshot, paying the spread twice for nothing."
    },
    {
      "kind": "Guidance",
      "title": "Entry N minutes after the open",
      "text": "The session opens at 09:30. Write N minutes after the open as an entry window starting at 09:30 plus N minutes, for example 30 minutes after the open is a window from 10:00, with a short end such as 10:30."
    },
    {
      "kind": "Edge case",
      "title": "Roll day with weekly expiries",
      "text": "No entry is allowed on the front expiry's roll day (2 days before it expires, so Wednesday for a Friday expiry). With weekly expiries, a strategy that trades every day skips every Wednesday. With a front expiry far away, only its own roll day is skipped. Tell the user."
    },
    {
      "kind": "Edge case",
      "title": "Target vega with structures whose vegas cancel out",
      "text": "For risk reversals or tight spreads, the vega of one lot can be very small, so a vega target needs many lots and hits max_lots. Keep max_lots sensible, or propose sizing in lots instead."
    },
    {
      "kind": "Not possible yet",
      "title": "Not possible in the MVP",
      "text": "Calendars or any second expiry, more than 2 legs, fixed strikes, a strike relative to another leg, several trades open at once, and reopening on the same day after an exit. Say so plainly and offer the closest possible strategy."
    }
  ]
};
