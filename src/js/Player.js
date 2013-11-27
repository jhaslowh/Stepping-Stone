/** Player Structure */
function Player(){ 
  // Location of player 
  this.nx = 0;
  this.ny = 0;
  this.w = 48;
  this.h = 24;
  this.speed = 5;
  this.mesh;
}

/** Initialize player values */
Player.prototype.init = function(level){
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
  this.mesh.position.x = level.screen_width/2; 
  this.mesh.position.y = level.screen_height/2; 
  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;
  level.scene.add(this.mesh);
}

/** Update player state */
Player.prototype.update = function(level){
  /** Update Location */
  // Grab location 
  this.nx = this.mesh.position.x;
  this.ny = this.mesh.position.y;
  
  // Update position
  if (keyboard[KEY_D])
    this.nx += this.speed;
  if (keyboard[KEY_A])
    this.nx -= this.speed;
  if (keyboard[KEY_W])
    this.ny -= this.speed;
  if (keyboard[KEY_S])
    this.ny += this.speed;
    
  // TODO replace the above with better physics 
  /*
  if (player is above water line or on water line){
    
  
  }else if (player is below line){
  
  }
  */
    
  /** Check collision */
  var checkx = true;
  var checky = true;
  
  // Level collision
  if (this.ny + this.h > level.level_bottom()){
    this.ny = level.level_bottom() - this.h;
    checky = false;
  }
  
    
  // TODO block Collision
  
  /** Collision Response */
  this.mesh.position.x = this.nx;
  this.mesh.position.y = this.ny;
}