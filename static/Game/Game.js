class Game {
  checkers = []; //tab z  pionkami
  squares = []; //tab z polami
  obj = new THREE.Object3D();
  constructor(setUp) {
    //camera and scene setUp
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.raycaster = new THREE.Raycaster();
    this.mouseVector = new THREE.Vector2();

    this.renderer.setClearColor(0xffffff);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("root").append(this.renderer.domElement);
    this.camera.position.set(0, 100, 100);
    this.camera.lookAt(this.scene.position);

    //setUpBoard
    this.board = [
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
    ];

    this.players = [
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
    ];
    const axes = new THREE.AxesHelper(1000);
    this.scene.add(axes);
    this.generateBoard(this.board);
    this.render(); // wywołanie metody render
    window.onresize = () => this.resize();
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  };

  generateBoard(tab) {
    tab.map((el, i) => {
      let tab = [];
      el.map((element, j) => {
        const cube = new Pole(element);
        cube.position.set(j * 10 - 35, 0, i * 10 - 35);
        this.scene.add(cube);
        tab.push(cube);
      });
      this.squares.push(tab);
    });
    this.render();
  }

  setPlayers(tab) {
    tab.map((el, i) => {
      el.map((element, j) => {
        if (element != 0) {
          const cylinder = new Pionek(element);
          cylinder.position.set(j * 10 - 35, 1, i * 10 - 35);
          this.obj.add(cylinder);
          this.scene.add(this.obj);
          this.checkers.push(cylinder);
          this.squares[i][j].occupied = true;
        }
      });
    });
  }
  setCameraView(player) {
    if (player) this.camera.position.set(0, 100, 100);
    else this.camera.position.set(0, 100, -100);
    this.camera.lookAt(this.scene.position);
  }
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  handleClick(e) {
    this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.raycaster.setFromCamera(this.mouseVector, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    net.checkTab().then((res) => {
      this.players = res.tab;
    });
    for (let i = 0; i < intersects.length; i++) {
      let el = intersects[i];
      if (el.object.name == "pionek" && this.player == el.object.colorType) {
        el.object.position;
        this.selectCurrent(el);
        break;
      } else if (el.object.name == "pole" && el.object.colorType == "black") {
        this.move(el);
      }
    }
  }

  selectCurrent(element) {
    if (this.current == element.object) {
      this.current.color = this.player == "white" ? 0xffffff : 0xff4444;
      this.current = {};
      this.squares.map((row) => {
        row.map((square) => {
          square.color = square.colorType == "white" ? 0xdddddd : 0x444444;
        });
      });
      return;
    }
    try {
      this.current.color = this.player == "white" ? 0xffffff : 0xff4444;
      this.squares.map((row) => {
        row.map((square) => {
          square.color = square.colorType == "white" ? 0xdddddd : 0x444444;
        });
      });
    } finally {
      this.current = element.object;
      this.current.color = 0x00ffff;
      const [a, b, actJ, actI] = this.getIndexInTabFromPosition(element);
      this.squares.map((row, i) => {
        row.map((square, j) => {
          if (Math.abs(j - actJ) == 1 && i - actI == this.allowedToMove) {
            //this.allowed to move -1 dla czarnych, 1 dla białych w ten sposób poruszają się w przeciwnym kierunku
            square.color = 0x00ffff;
            if (square.occupied && this.players[i][j] != this.current.number)
              this.squares[i + this.allowedToMove][
                j + (j - actJ)
              ].color = 0xff0000;
          }
        });
      });
    }
  }

  move(element) {
    try {
      const [j, i, newJ, newI] = this.getIndexInTabFromPosition(element);
      let pole = this.squares[newI][newJ];
      let white = new THREE.Color(0xdddddd);
      let black = new THREE.Color(0x444444);
      let green = new THREE.Color(0x00ffff);
      if (pole.color.equals(white) || pole.color.equals(black)) return;
      else if (pole.color.equals(green)) {
        this.changePosition(element);
        ui.afterMove();
      } else {
        this.kill(element);
        ui.afterMove();
      }
    } finally {
    }
  }
  changePosition(element) {
    const [j, i, newJ, newI] = this.getIndexInTabFromPosition(element);
    let [x, z, newX, newZ] = [
      this.current.position.x,
      this.current.position.z,
      element.object.position.x,
      element.object.position.z,
    ];
    this.current.position.set(
      element.object.position.x,
      1,
      element.object.position.z
    );
    this.current.color = this.player == "white" ? 0xffffff : 0xff4444;
    this.current = {};
    this.players[i][j] = 0;
    this.players[newI][newJ] = this.player == "white" ? 1 : 2;
    this.squares.map((row) => {
      row.map((square) => {
        square.color = square.colorType == "white" ? 0xdddddd : 0x444444;
      });
    });
    return [x, z, newX, newZ];
  }
  kill(element) {
    const [x, z, newX, newZ] = this.changePosition(element);
    const [killX, killZ] = [(x + newX) / 2, (z + newZ) / 2];
    const pos = new THREE.Vector3(killX, 1, killZ);
    let [checker] = this.obj.children.filter((el) => {
      return el.position.x == pos.x && el.position.z == pos.z;
    });
    const [, , j, i] = this.getIndexInTabFromPosition({ object: checker });
    this.players[i][j] = 0;
    this.obj.remove(checker);
  }

  rebuild() {
    this.obj.clear();
    this.squares.map((row) => {
      row.map((square) => (square.occupied = false));
    });
    this.setPlayers(this.players);
  }

  getIndexInTabFromPosition(element) {
    let x = this.current.position === undefined ? 0 : this.current.position.x;
    let z = this.current.position === undefined ? 0 : this.current.position.z;
    let j = (x + 35) / 10;
    let i = (z + 35) / 10;
    let newJ = (element.object.position.x + 35) / 10;
    let newI = (element.object.position.z + 35) / 10;
    return [j, i, newJ, newI];
  }
}
