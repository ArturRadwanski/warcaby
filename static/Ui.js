class Ui {
  constructor(net, game) {
    this.net = net;
    this.game = game;
    this.handleLoginClick = this.handleLoginClick.bind(this);
    document
      .getElementById("btn-login")
      .addEventListener("click", this.handleLoginClick);

    document.getElementById("reset").addEventListener("click", this.net.reset);
  }

  handleLoginClick() {
    this.waitForLogin();
    this.net.login().then((res) => {
      if (res.succes) {
        this.game.setPlayers(this.game.players); //rozstawia pionki na planszy
        this.game.setCameraView(res.player); //ustawia kamerę z odpowiedniej strony
        document.getElementById("wait").style.display = "none"; //ukrywa div z oczekiwaniem na gracza
        document.getElementById("root").classList = ""; //usuwa klasę login-shade(anuluje przyciemnienie)
        document.getElementById("status").innerHTML = `Witaj&nbsp<span>${
          res.nickname
        }</span>, grasz ${res.player ? "czarnymi" : "białymi"}`; //set status na witaj "gracz" ...
        if (res.player != 0) {
          this.turnOnTimer();
          window.onmousedown = () => console.log("wait for your move!");
          this.game.player = "black";
          this.game.allowedToMove = -1;
          this.net.updateTab(this.game.players).then((res) => {
            game.players = res.tab;
            clearInterval(this.interval);
            document.getElementById("timer").classList = "hidden";
            console.log(res.tab);
            window.onmousedown = (e) => this.game.handleClick(e);
            game.rebuild();
          });
        } else {
          this.game.player = "white";
          this.game.allowedToMove = 1;
          window.onmousedown = (e) => this.game.handleClick(e);
        } //raycaster działa po zalogowaniu
      } else {
        alert(res.message);
        document.getElementById("login-form").style.display = "flex";
        document.getElementById("wait").style.display = "none";
      } //alert z wiadomością z serwera
    });
  }
  turnOnTimer() {
    let timer = document.getElementById("timer");
    timer.innerText = "30";
    timer.classList = "";
    this.interval = setInterval(() => {
      let currTime = timer.innerText * 1;
      currTime -= 1;
      timer.innerText = currTime;
      if (currTime == 0) {
        timer.innerText = "Przeciwnik się nie ruszył wygrałeś";
        clearInterval(this.interval);
      }
    }, 1000);
  }
  afterMove() {
    this.turnOnTimer();
    window.onmousedown = () => console.log("wait for your move!");
    this.net.updateTab(this.game.players).then((res) => {
      game.players = res.tab;
      clearInterval(this.interval);
      document.getElementById("timer").classList = "hidden";
      console.log(res.tab);
      window.onmousedown = (e) => this.game.handleClick(e);
      game.rebuild();
    });
  }
  waitForLogin() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("wait").style.display = "block";
  }
}
