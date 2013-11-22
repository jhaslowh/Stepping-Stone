// Structure to hold all level data 
function GameLevel(){
  // List of all blocks 
  this.blocks = [];
  
  // Player
  this.player = new Player();
  
  // Rendering 
  this.camera;
  this.camera_move_speed = 0; // The camera will move to the right, player must keep up
  this.camera_loc = {x:0,y:0,z:0};
  this.scene;
  
  // Generation variables 
  // All these values will be set in init()
  this.next_gen_loc = 0; // Starting x value for next chunk of generated land 
  this.gen_min_y = 0;
  this.gen_max_y = 0;
  this.level_width = 0;
  this.level_height = 0;
  
  // Last correct path block placed 
  this.last_path_block;
  
  // TODO remove later
  this.cube;
}

/** Initialize level */
GameLevel.prototype.init = function (w,h){
  /** Set up rendering Code */
  // Move camera to middle of level width and height 
  this.camera_loc.x = w/2;
  this.camera_loc.y = h/2;
  /* Set the camera z based on the screen width, 
   * so the whole level can be seen. */
  this.camera_loc.z = (w/2)/Math.tan(22.5); 
  
  // Create Camera 
  this.camera = new THREE.PerspectiveCamera(
      45,       // Field of view
      w/h,      // Aspect ratio
      0.1,      // Near plane
      10000     // Far plane
  );
  /* Camera up must be the negative y so that the positive y is in the 
   * down direction and the positive x is in the right direction. If 
   * the camera up is set to the positive y, then positive x will be to 
   * the left. */
  this.camera.up = new THREE.Vector3(0,-1,0); 
  
  // Create Scene
  this.scene = new THREE.Scene();
  
  /** Set up generation code */
  // Set level width and height
  this.level_width = w;
  this.level_height = h;
  this.next_gen_loc = w;
  // Get the number of blocks that fit on the screen vertically divided by 2
  var vert_blocks = Math.round(h / 25) / 2;
  this.gen_min_y = -vert_blocks * 25;
  this.gen_max_y = vert_blocks * 25;
  
  // TODO Need to generate starting terrain (probably 3 screens worth) 
  
  // TODO remove later
  this.cube = new THREE.Mesh( new THREE.CubeGeometry( 25,25,25 ), new THREE.MeshNormalMaterial() );
   //var material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
  this.cube.position.x = w/2;
  this.cube.position.y = h/2;
  this.scene.add(this.cube);
}

/** Update the state of the level */
GameLevel.prototype.update = function(){
  // Update camera 
  this.camera_loc.x += this.camera_move_speed;

  // TODO 
  
  // TODO remove
  this.cube.rotation.y += .01;
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
