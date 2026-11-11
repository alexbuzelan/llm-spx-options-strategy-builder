/* Strategy ideas for the assistant.
   Shown as cards by "Give me some ideas" and by the assistant's show_ideas tool.
   Each idea: a short title and one sentence with the legs and the entry only;
   size, hedging and exits are agreed in the chat after a pick. Edit freely. */
window.BACKTEST_IDEAS = [
  { title: "Sell the vol spike", text: "Sell an ATM straddle when ATM vol rises 2 vol points since the open." },
  { title: "Buy cheap vol", text: "Buy an ATM straddle when ATM vol falls 1 point below realized vol over the last 5 trading days." },
  { title: "Put spread on a selloff", text: "Buy a put spread when SPX falls 1% since the open." }
];
