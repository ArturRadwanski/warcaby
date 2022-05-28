let game;
let net;
let ui;
let pionek
window.onload = () => {
  net = new Net();
  game = new Game();
  ui = new Ui(net, game);
};
