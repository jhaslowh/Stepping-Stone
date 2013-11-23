// Structure to hold all level data 
function GameLevel(){
  // List of all blocks 
  this.blocks = [];
  
  // Player
  this.player = new Player();
  // Water
  this.water_cube;
  this.water_level;
  // Lights
  this.hem_light;
  this.direct_light;
  
  // Rendering 
  this.camera;
  this.camera_move_speed = 0; // The camera will move to the right, player must keep up
  this.camera_loc = {x:0,y:0};
  this.camera_zoom = 0;
  this.camera_tilt = -20;
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
  this.camera_loc.y = (h/2);
  /* Set the camera z based on the screen width, 
   * so the whole level can be seen. */
  this.camera_zoom = -((w/2)/Math.tan(22.5)); 
  
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
  
  // Need to generate starting terrain (probably 3 screens worth) 
  this.generateChunk(this.scene);
  this.generateChunk(this.scene);
  this.generateChunk(this.scene);
  
  /** Set up water */
  this.water_level = h/2;
  // Water shape for now will be the width plus 200, half the height plus 50, and 160 depth. 
  var c = new THREE.CubeGeometry( w + 200, (h/2) + 50, 160); 
  var material = new THREE.MeshLambertMaterial( { color: 0x00CAFC} );
  material.opacity = .25;
  material.transparent = true;
  this.water_cube = new THREE.Mesh(c, material);
  this.fix_water_level();
  this.scene.add(this.water_cube);
  
  /** Set up lights */
  // Hemisphere light
  this.hem_light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  this.hem_light.color.setHSL( 0.6, 1, 0.6 ); // TODO these values may need to be change, they were from an example 
  this.hem_light.groundColor.setHSL( 0.095, 1, 0.75 );// TODO these values may need to be change, they were from an example 
  this.scene.add( this.hem_light );

  // Directional light 
  this.direct_light = new THREE.DirectionalLight( 0xffffff, 1 );
  this.direct_light.color.setHSL( 0.1, 1, 0.95 );// TODO these values may need to be change, they were from an example 
  this.direct_light.castShadow = true;
  this.direct_light.shadowDarkness = 0.35;
  this.scene.add( this.direct_light );
  
  /** Other */
  this.player.init(this.scene);

  /** TODO remove later, for now, test cube */
  this.cube = new THREE.Mesh( new THREE.CubeGeometry( 25,25,25 ), new THREE.MeshNormalMaterial() );
  this.cube.position.x = w/2;
  this.cube.position.y = h/2;
  this.scene.add(this.cube);
}

/** Update the state of the level */
GameLevel.prototype.update = function(){
  // Update camera 
  this.camera_loc.x += this.camera_move_speed;
  this.fix_water_loc();
  this.fix_light_loc();
  
  // TODO 
  
  // TODO remove
  this.cube.rotation.y += .01;
  this.cube.rotation.x += .01;
  
  if (keyboard[KEY_RIGHT])
    this.cube.position.x += 2;
  if (keyboard[KEY_LEFT])
    this.cube.position.x -= 2;
  if (keyboard[KEY_UP])
    this.cube.position.y -= 2;
  if (keyboard[KEY_DOWN])
    this.cube.position.y += 2;
  
  if (keyboard[KEY_W]){
    this.camera_tilt -= 1;
    if (this.camera_tilt < -89)
      this.camera_tilt = -89;
  }
  if (keyboard[KEY_S]){
    this.camera_tilt += 1;
    if (this.camera_tilt > 89)
      this.camera_tilt = 89;
  }
}

/** Draw the level to the screen */
GameLevel.prototype.draw = function (renderer){
  // Setup camera 
  var cam_loc = new THREE.Vector3(0,0,this.camera_zoom);
  var matrix = new THREE.Matrix4();
  matrix = matrix.makeRotationAxis(
    new THREE.Vector3(1,0,0), this.camera_tilt * (Math.PI/180));
  cam_loc.applyProjection(matrix);
  cam_loc.x += this.camera_loc.x;
  cam_loc.y += this.camera_loc.y;
  
  this.camera.position.set( cam_loc.x, cam_loc.y, cam_loc.z );
  this.camera.lookAt(new THREE.Vector3(this.camera_loc.x,this.camera_loc.y,0));
  
  // TODO 
  
  // Draw scene 
  renderer.render( this.scene, this.camera );
}

/** Generate a new chunk of terrain */
GameLevel.prototype.generateChunk = function (scene){
  // TODO 

  //this.blocks[this.nextChunkIndex()] = new Block();
}

/** Get the index of the next available chunk */
GameLevel.prototype.nextChunkIndex = function (){
  var i;
  for (i = 0; i < this.blocks.length; i++){
    if (this.blocks[i] == null)
      break;
  }
  return i;
}

/** Set the water level to the appropriate height */
GameLevel.prototype.fix_water_level = function (){
  this.water_cube.position.y = this.water_level + (this.water_cube.geometry.height /2);
}

/** Set the water location based on camera location */
GameLevel.prototype.fix_water_loc = function(){
  this.water_cube.position.x = this.camera_loc.x;
}

/** Fix the light location based off of the camera */
GameLevel.prototype.fix_light_loc = function(){
  this.hem_light.position.set( this.camera_loc.x, -500, 0 );
  this.direct_light.position.set( this.camera_loc.x, -100, 0 );
}
