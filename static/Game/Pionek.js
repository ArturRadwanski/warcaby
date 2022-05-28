class Pionek extends THREE.Mesh {
  constructor(element) {
    //element = 1 -> biały , 2 -> czarny
    super();
    this.geometry = new THREE.CylinderGeometry(4, 4, 2, 64);
    const texture = new THREE.TextureLoader().load("/textures/wood.jpg");
    this.material = new THREE.MeshBasicMaterial({
      color: element == 1 ? 0xffffff : 0xff4444,
      map: texture,
    });
    this.name = "pionek";
    this.colorType = element == 1 ? "white" : "black";
    this.number = element;
  }
  set color(val) {
    this.material.setValues({ color: val });
  }
  get color() {
    return this.material.color;
  }
  get position() {
    return this.position;
  }
}
