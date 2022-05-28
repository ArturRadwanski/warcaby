class Pole extends THREE.Mesh {
  constructor(element) {
    //element = 0 -> białe pole, 1 -> czarne pole
    super(); // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
    const texture = new THREE.TextureLoader().load(
      "https://i.imgur.com/Ez3Iox2.jpeg"
    );
    this.material = new THREE.MeshBasicMaterial({
      color: element == 0 ? 0xdddddd : 0x444444,
      map: texture,
    });
    this.geometry = new THREE.BoxGeometry(10, 1, 10);
    this.name = "pole";
    this.colorType = element == 0 ? "white" : "black";
    this.occupied = false;
  }
  set color(val) {
    if (!this.occupied) this.material.setValues({ color: val });
  }
  get color() {
    return this.material.color;
  }
  get position() {
    return this.object.position;
  }
}
