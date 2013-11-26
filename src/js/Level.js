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
  this.camera_move_speed = 0; // (TODO set) The camera will move to the right, player must keep up
  this.camera_loc = {x:0,y:0};
  this.camera_zoom = 0;
  this.camera_tilt = 0;
  this.camera_max_tilt = 50;  // This is tilt down
  this.camera_min_tilt = -89; // This is tilt up
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
}

/** Initialize level */
GameLevel.prototype.init = function (w,h){
  /** Set up rendering Code */
  // Move camera to middle of level width and height 
  this.camera_loc.x = w/2;
  this.camera_loc.y = h/2;
  /* Set the camera z based on the screen width, 
   * so the whole level can be seen. */
  //this.camera_zoom = -((h/2)/Math.tan(22.5)); 
  this.camera_zoom = -((h/2) / Math.tan((Math.PI * 22.5)/180)); 
  
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
  // Water shape for now will be the width plus 200, 1000 height, and 160 depth. 
  var c = new THREE.CubeGeometry( w + 200, 1000, 160); 
  var material = new THREE.MeshLambertMaterial( { color: 0x00CAFC} );
  material.opacity = .25;
  material.transparent = true;
  this.water_cube = new THREE.Mesh(c, material);
  this.water_cube.castShadow = true;
  this.water_cube.receiveShadow = true;
  this.fix_water_level();
  this.scene.add(this.water_cube);
  
  /** Set up lights */
  // Hemisphere light
  this.hem_light = new THREE.HemisphereLight( 0x61D7FF, 0xffffff, 0.6 );
  this.scene.add( this.hem_light );

  // Directional light 
  this.direct_light = new THREE.DirectionalLight( 0xffffff, 1 ); 
  this.direct_light.castShadow = true;
  this.direct_light.shadowDarkness = 0.35;
  this.direct_light.shadowMapWidth = 2048;
  this.direct_light.shadowMapHeight = 2048;
  this.scene.add( this.direct_light );
  
  /** Other */
  this.player.init(this.scene);

  /** TODO corner cubes to mark correct screen corners  */
  var cube1 = new THREE.Mesh( new THREE.CubeGeometry( 25,25,25 ), new THREE.MeshNormalMaterial() );
  cube1.position.x = 0;
  cube1.position.y = 0;
  this.scene.add(cube1);
  var cube2 = new THREE.Mesh( new THREE.CubeGeometry( 25,25,25 ), new THREE.MeshNormalMaterial() );
  cube2.position.x = w;
  cube2.position.y = 0;
  this.scene.add(cube2);
  var cube3 = new THREE.Mesh( new THREE.CubeGeometry( 25,25,25 ), new THREE.MeshNormalMaterial() );
  cube3.position.x = w;
  cube3.position.y = h;
  this.scene.add(cube3);
  var cube4 = new THREE.Mesh( new THREE.CubeGeometry( 25,25,25 ), new THREE.MeshNormalMaterial() );
  cube4.position.x = 0;
  cube4.position.y = h;
  this.scene.add(cube4);
}

/** Update the state of the level */
GameLevel.prototype.update = function(){
  // Update camera 
  if (keyboard[KEY_Q]){
    this.camera_tilt -= 1;
    if (this.camera_tilt < this.camera_min_tilt)
      this.camera_tilt = this.camera_min_tilt;
  }
  if (keyboard[KEY_E]){
    this.camera_tilt += 1;
    if (this.camera_tilt > this.camera_max_tilt)
      this.camera_tilt = this.camera_max_tilt;
  }
  
  this.camera_loc.x += this.camera_move_speed;
  this.fix_water_loc();
  this.fix_light_loc();
  
  // Update Player
  this.player.update();
  
  // TODO update blocks 
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
  this.direct_light.position.set( this.camera_loc.x, -400, -200 );
  this.direct_light.target.position.set( this.camera_loc.x, 0, 0 );
}

/** Get the x value of the left side of the level */
GameLevel.prototype.level_left = function(){
  return this.camera_loc.x - (this.level_width/2);
}

/** Get the x value of the right side of the level */
GameLevel.prototype.level_right = function(){
  return this.camera_loc.x + (this.level_width/2);
}

/** Get the y value of the bottom of the level */
GameLevel.prototype.level_bottom = function(){
  return this.camera_loc.y + (this.level_height/2);
}

/** Get the y value of the top of the level */
GameLevel.prototype.level_top = function(){
  return this.camera_loc.y - (this.level_height/2);
}
