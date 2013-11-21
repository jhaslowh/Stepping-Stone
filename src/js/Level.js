// Structure to hold all level data 
function GameLevel(){
  // List of all blocks 
  this.blocks = [];
  
  // Last correct path block placed 
  this.last_path_block;
  
  // Player
  this.player = new Player();
  
  // Rendering 
  this.camera;
  this.camera_move_speed = 0; // The camera will move to the right, player must keep up
  this.camera_loc = {x:0,y:0,z:0};
  this.scene;
  
  // Generation variables 
  this.next_gen_loc = 0; // Starting x value for next chunk of generated land 
  this.gen_min_y = 0;
  this.gen_max_y = 0;
  this.level_width = 0;
  this.level_height = 0;
  
  // TODO remove later
  this.cube;
}

/** Initialize level */
GameLevel.prototype.init = function (w,h){
  // TODO Need to generate starting terrain (probably 3 screens worth) 
  
  // Set level width and height
  this.level_width = w;
  this.level_height = h;
  
  // Move camera to middle of level width and height 
  this.camera_loc.x = w/2;
  this.camera_loc.y = h/2;
  this.camera_loc.z = -200; // TODO need to fix this so one full screen fits in the camera 
  
  // Create Camera 
  this.camera = new THREE.PerspectiveCamera(
      45,             // Field of view
      w/h,      // Aspect ratio
      0.1,            // Near plane
      10000           // Far plane
  );
  // Create Scene
  this.scene = new THREE.Scene();
  /* Camera up must be the negative y so that the positive y is in the 
   * down direction and the positive x is in the right direction. If 
   * the camera up is set to the positive y, then positive x will be to 
   * the left. */
  this.camera.up = new THREE.Vector3(0,-1,0); 
  
  // TODO remove later
  cube = new THREE.Mesh( new THREE.CubeGeometry( 25,25,25 ), new THREE.MeshNormalMaterial() );
   //var material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
  cube.position.x = w/2;
  cube.position.y = h/2;
  this.scene.add(cube);
}

/** Update the state of the level */
GameLevel.prototype.update = function(){
  // Update camera 
  this.camera_loc.x += this.camera_move_speed;

  // TODO 
  
  // TODO remove
  cube.rotation.y += .01;
}

/** Draw the level to the screen */
GameLevel.prototype.draw = function (renderer){
  // Setup camera 
  this.camera.position.set( this.camera_loc.x, this.camera_loc.y, this.camera_loc.z );
  this.camera.lookAt(new THREE.Vector3(this.camera_loc.x,this.camera_loc.y,0));
  
  // TODO 

  // Draw scene 
  renderer.render( this.scene, this.camera );
}

/** Generate a new chunk of terrain */
GameLevel.prototype.generateChunk = function (){
  // TODO 
}
