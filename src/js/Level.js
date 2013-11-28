// Structure to hold all level data 
function GameLevel(){
  // List of all blocks 
  this.blocks = [];
  
  // Player
  this.player = new Player();
  // Water
  this.water_cube;            // Mesh for water. 
  this.water_level;           // Y value for sea level. set in init()
  this.water_size = 0;        // Width for water and sea floor. set in init()
  this.sea_floor;             // Sea floor mesh, created in init()
  // Lights
  this.hem_light;             
  this.direct_light;
  
  // Rendering 
  this.camera;
  this.camera_move_speed = 1; // (TODO set) The camera will move to the right, player must keep up
  this.camera_loc = {x:0,y:0};// Current camera location. Controled by level
  this.camera_zoom = 0;       // Zoom for camera, auto calculated. 
  this.camera_tilt = 0;       // Tilt angle for the camera. Rotation is around x axis 
  this.camera_max_tilt = 35;  // This is tilt down
  this.camera_min_tilt = -15; // This is tilt up
  this.scene;                 // Scene to hold all geometry 
  
  // Generation variables 
  // All these values will be set in init()
  this.next_gen_loc = 0; // Starting x value for next chunk of generated land 
  this.vert_blocks = 0;  // Number of vertical blocks per chunk
  this.hor_blocks = 0;   // Number of horozontal blocks per chunk
  this.gen_top = 0;      // Top of generation range 
  this.gen_bottom = 0;   // Bottom of generation range (bottom box y value plus height)
  this.screen_width = 0; // Width of screen 
  this.screen_height = 0;// height of screen 
  this.block_list_full = false; // used in index method to make it faster 
  // Row of last path block placed 
  this.last_path_block = -1;  // Last y index value in grid for path generation 
  this.grid_water_level = 0;  // Where in the grid the water level is 
  
  // TODO remove
  this.test_cube;
}

/** Initialize level */
GameLevel.prototype.init = function (w,h){
  /** Set up rendering Code */
  // Move camera to middle of level width and height 
  this.camera_loc.x = w/2;
  this.camera_loc.y = h/2;
  /* Set the camera z based on the screen width, 
   * so the whole level can be seen. */
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
  this.screen_width = w;
  this.screen_height = h;
  this.next_gen_loc = w;
  // Get the number of blocks that fit on the screen vertically divided by 2
  this.vert_blocks = Math.round((h / 25)) - 4;
  this.hor_blocks = Math.round((w/ 25));
  this.gen_top = (h/2) - ((this.vert_blocks * 25)/2);
  this.gen_bottom = (h/2) + ((this.vert_blocks * 25)/2);
  this.last_path_block = Math.round(this.vert_blocks/2) + 1;
  
  // Need to generate starting terrain (probably 3 screens worth) 
  this.generateChunk();
  
  /** Set up water */
  this.water_level = h/2;
  this.water_size = w * 2;
  // Water shape for now will be the width plus 200, 1000 height, and 160 depth. 
  var c = new THREE.CubeGeometry(this.water_size, this.gen_bottom - (h/2), 160); 
  var material = new THREE.MeshLambertMaterial( { color: 0x00CAFC} );
  material.opacity = .15;
  material.transparent = true;
  this.water_cube = new THREE.Mesh(c, material);
  this.water_cube.castShadow = true;
  this.water_cube.receiveShadow = true;
  this.scene.add(this.water_cube);
  this.fix_water_level();
  
  /** Set up sea floor */
  material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0xb88854, specular: 0x333333, shininess: 0, metal: false });
  c = new THREE.CubeGeometry(this.water_size, 50, 160);
  this.sea_floor = new THREE.Mesh(c, material);
  this.sea_floor.receiveShadow = true;
  this.sea_floor.position.y = this.gen_bottom + (this.sea_floor.geometry.height/2);
  this.scene.add(this.sea_floor);
  
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
  this.player.init(this);

  /** TODO test stuff  */
  
  var mapHeight = THREE.ImageUtils.loadTexture( 'res/test2.png' );
  mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
  mapHeight.format = THREE.RGBFormat;
  material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0x737980, specular: 0x333333, shininess: 0, bumpMap: mapHeight, bumpScale: 20, metal: true });
  var cube = new THREE.CubeGeometry( 250,250,250); 
  var mesh = new THREE.Mesh(cube, material);
  mesh.position.x = w/2;
  mesh.position.y = h/2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  this.test_cube = mesh;
  //this.scene.add(mesh);
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
  this.player.update(this);
  
  // Update blocks 
  for (var i = 0; i < this.blocks.length; i++)
    this.blocks[i].update(this);
    
  // Block generation 
  if (this.camera_loc.x + this.screen_width > this.next_gen_loc)
    this.generateChunk();
    
  // TODO remove
  this.test_cube.rotation.x += .01;
  this.test_cube.rotation.y += .01;
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
  
  // Draw scene 
  renderer.render( this.scene, this.camera );
}

/** Generate a new chunk of terrain */
GameLevel.prototype.generateChunk = function (){
  // Temporary grid to store blocks 
  var block_grid = [this.hor_blocks];
  // Create block grid 
  for (var i = 0; i < this.hor_blocks; i++){
    block_grid[i] = [this.vert_blocks];
    for (var j = 0; j < this.vert_blocks; j++)
      block_grid[i][j] = BlockType.NoBlock;
  }
  
  /** Generate correct path */
  var direction = -1;
  /* 0 = Up
   * 1 = Right
   * 2 = Down */
  for (var i = 0; i < this.hor_blocks - 1; i++){
    // Get next direction for path
    if (this.last_path_block == 0)
      direction = Math.round(Math.random()) + 1;
    else if (this.last_path_block == this.vert_blocks - 1)
      direction = Math.round(Math.random());
    else
      direction = Math.round(Math.random() * 2)
    
    if (direction == 0){
      // Front two blocks 
      block_grid[i][this.last_path_block] = BlockType.Path;
      block_grid[i+1][this.last_path_block] = BlockType.Path;
      // Top two blocks 
      block_grid[i][this.last_path_block-1] = BlockType.Path;
      block_grid[i+1][this.last_path_block-1] = BlockType.Path;
      
      // Move path block up 
      this.last_path_block -= 1;
    } else if(direction == 1){
      // Front block
      block_grid[i][this.last_path_block] = BlockType.Path;
    } else if(direction == 2){
      // Front two blocks 
      block_grid[i][this.last_path_block] = BlockType.Path;
      block_grid[i+1][this.last_path_block] = BlockType.Path;
      // Top two blocks 
      block_grid[i][this.last_path_block+1] = BlockType.Path;
      block_grid[i+1][this.last_path_block+1] = BlockType.Path;
      
      // Move path block up 
      this.last_path_block += 1;
    }
  }
  block_grid[this.hor_blocks-1][this.last_path_block] = BlockType.Path;
  
  /** Generate obstacles */
  
  
  /** Convert grid to real blocks */
  // Reset list state 
  this.block_list_full = false;
  
  // Add blocks from grid into list 
  for (var i = 0; i < this.hor_blocks; i++){
    for (var j = 0; j < this.vert_blocks; j++){
      if (block_grid[i][j] !== BlockType.NoBlock){
        var index = this.nextChunkIndex();
        var block = generateBlock(block_grid[i][j], 
            this.next_gen_loc +(i * 25), this.gen_top + ( j * 25));
        this.blocks[index] = block;
        this.scene.add(block.mesh);
      }
    }
  }
  
  // Move next gen spot 
  this.next_gen_loc += this.hor_blocks * 25;
  
  // Test Blocks (only keeping for size testing and reference. )
  /*for (var i = 0; i < this.vert_blocks; i++){
    var block = generateBlock(BlockType.Rock, i * 25,this.gen_top+( i * 25));
    this.blocks.push(block);
    var mesh = block.mesh;
    this.scene.add(mesh);
    var block = generateBlock(BlockType.Rock, 0,this.gen_top+( i * 25));
    mesh = block.mesh;
    this.blocks.push(block);
    this.scene.add(mesh);
  }
  
  for (var i = 0; i < this.hor_blocks; i++){
    var mesh = generateBlock(BlockType.Rock, i * 25,this.gen_top).mesh;
    this.scene.add(mesh);
  }*/
}


/** Get the index of the next available chunk */
GameLevel.prototype.nextChunkIndex = function (){
  var i = this.blocks.length;
  if (!this.block_list_full){
    // Go through block list and find first dead block
    for (i = 0; i < this.blocks.length; i++){
      if (!this.blocks[i].active)
        return i;
    }
  }
  // If no block found, return end of list 
  this.block_list_full = true;
  return i;
}

/** Set the water level to the appropriate height */
GameLevel.prototype.fix_water_level = function (){
  this.water_cube.position.y = this.water_level + (this.water_cube.geometry.height /2);
}

/** Set the water location based on camera location */
GameLevel.prototype.fix_water_loc = function(){
  this.water_cube.position.x = this.camera_loc.x;
  this.sea_floor.position.x = this.camera_loc.x;
}

/** Fix the light location based off of the camera */
GameLevel.prototype.fix_light_loc = function(){
  this.hem_light.position.set( this.camera_loc.x, -500, 0 );
  this.direct_light.position.set( this.camera_loc.x, -400, -200 );
  this.direct_light.target.position.set( this.camera_loc.x, 0, 0 );
}

/** Get the x value of the left side of the level */
GameLevel.prototype.level_left = function(){
  return this.camera_loc.x - (this.screen_width/2);
}

/** Get the x value of the right side of the level */
GameLevel.prototype.level_right = function(){
  return this.camera_loc.x + (this.screen_width/2);
}

/** Get the y value of the bottom of the level */
GameLevel.prototype.level_bottom = function(){
  return this.gen_bottom;
}

/** Get the y value of the top of the level */
GameLevel.prototype.level_top = function(){
  return this.gen_top;
}
