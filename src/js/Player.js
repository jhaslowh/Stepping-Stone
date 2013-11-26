/** Player Structure */
function Player(x,y){ 
  // Location of player 
  this.x = x;
  this.y = y;
  this.width = 50;
  this.height = 24;
  this.speed = 5;
  this.mesh;
}

/** Initialize player values */
Player.prototype.init = function(scene){
  // Make mesh and add it to scene
  var cube = new THREE.Geometry(); 
  var material = new THREE.MeshLambertMaterial( { color: 0xff1818} );
  
  // Make vertices 
  cube.vertices.push(new THREE.Vector3(0,0,12));
  cube.vertices.push(new THREE.Vector3(0,0,-12));
  cube.vertices.push(new THREE.Vector3(0,24,12));
  cube.vertices.push(new THREE.Vector3(0,24,-12));
  cube.vertices.push(new THREE.Vector3(48,12,0));
  
  // Make faces 
  cube.faces.push(new THREE.Face3(0,1,4));
  cube.faces.push(new THREE.Face3(1,3,4));
  cube.faces.push(new THREE.Face3(0,4,2));
  cube.faces.push(new THREE.Face3(3,2,4));
  cube.faces.push(new THREE.Face3(0,2,1));
  cube.faces.push(new THREE.Face3(2,3,1));
  
  this.mesh = new THREE.Mesh(cube, material);
  this.mesh.position.x = 300; // TODO start location
  this.mesh.position.y = 300; // TODO start location
  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;
  scene.add(this.mesh);
}

/** Update player state */
Player.prototype.update = function(){
  // Update position
  if (keyboard[KEY_D])
    this.mesh.position.x += this.speed;
  if (keyboard[KEY_A])
    this.mesh.position.x -= this.speed;
  if (keyboard[KEY_W])
    this.mesh.position.y -= this.speed;
  if (keyboard[KEY_S])
    this.mesh.position.y += this.speed;
}

/** Draw player to screen */
Player.prototype.draw = function (){
  // TODO 
}