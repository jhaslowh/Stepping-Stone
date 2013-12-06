/** Structure to hold all level data 
 * NOTE: If a variable is not set here, then it is set in init() **/
function GameLevel(){
  // List of all blocks 
  this.blocks = [];
  this.chunks = [];
  
  // Player
  this.player = new Player();
  // Water
  this.water_cube;            // Mesh for water. 
  this.water_level;           // Y value for sea level. set in init()
  this.water_size = 4000;     // Width for water and sea floor.
  this.sea_floor;             // Sea floor mesh, created in init()
  this.sea_floor_2;             
  // Lights
  this.hem_light;             
  this.direct_light;
  
  // Scoring
  this.score = 0;
  this.score_per_unit = 1;    // Score multiplier 
  
  // Rendering 
  this.camera;
  this.camera_move_speed = 1; // The camera will move to the right, player must keep up
  this.camera_loc = {x:0,y:0};// Current camera location. Controled by level
  this.camera_zoom;           // Zoom for camera, auto calculated in init()
  this.camera_tilt = 0;       // Tilt angle for the camera. Rotation is around x axis 
  this.camera_max_tilt = 35;  // This is tilt down
  this.camera_min_tilt = -15; // This is tilt up
  this.scene;                 // Scene to hold all geometry 
  this.draw_correct_path = false; // Set to draw correct path to screen
  
  // Generation variables 
  // All these values will be set in init()
  this.next_gen_loc;     // Starting x value for next chunk of generated land 
  this.vert_blocks;      // Number of vertical blocks per chunk
  this.hor_blocks;       // Number of horozontal blocks per chunk
  this.gen_top;          // Top of generation range 
  this.gen_bottom;       // Bottom of generation range (bottom box y value plus height)
  this.block_list_full = false; // used in index method to make it faster 
  // Row of last path block placed 
  this.last_path_block = -1;  // Last y index value in grid for path generation 
  this.last_path_block2 = -1;  // Last y index value in grid for path generation 
  this.grid_water_level;      // Where in the grid the water level is 
  this.under_path_percent = .4; // Chance to generate a block under the path if above water
  this.chunks_per_gen = 70;        // Number of chunks to generate each call to gen chunk.
  this.block_overflow_grid;   // Overflow grid so that we dont get strait lines on chunk seems
  this.level_width = 0;
  this.level_height = 1000;
  this.gen_chunk_width = 2500; // Width of a chunk 
  this.pattern_types = 8; // Total number of patterns
  
  // States 
  this.paused = false;      
  this.gameover = false;
}

/** Initialize level */
GameLevel.prototype.init = function (w,h){

  this.level_width = Math.round(this.level_height * (w/h));
  
  /** Set up rendering Code */
  // Move camera to middle of level width and height 
  this.camera_loc.x = this.level_width /2;
  this.camera_loc.y = this.level_height /2;
  /* Set the camera z based on the screen width, 
   * so the whole level can be seen. */
  this.camera_zoom = -((this.level_height/2) / Math.tan((Math.PI * 22.5)/180)); 
  
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
  this.next_gen_loc = this.camera_loc.x + (this.level_width / 2);
  // Get the number of blocks that fit on the screen vertically divided by 2
  this.vert_blocks = Math.round((this.level_height / 25)) - 4;
  this.hor_blocks = Math.round((this.gen_chunk_width/ 25));
  this.gen_top = (this.level_height /2) - ((this.vert_blocks * 25)/2);
  this.gen_bottom = (this.level_height /2) + ((this.vert_blocks * 25)/2);
  this.grid_water_level = Math.round(this.vert_blocks/2);
  this.last_path_block = this.grid_water_level + 1;
  this.last_path_block2 = this.grid_water_level + 1;
  
  // Make overflow grid 
  this.resetOverflowGrid();
  // Need to generate starting terrain (probably 3 screens worth) 
  this.generateChunk();
  
  /** Set up water */
  this.water_level = this.level_height /2;
  // Water shape for now will be the width plus 200, 1000 height, and 160 depth. 
  var c = new THREE.CubeGeometry(this.water_size, this.gen_bottom - (this.level_height /2), 160); 
  var material = new THREE.MeshLambertMaterial( { color: 0x00CAFC} );
  material.opacity = .15;
  material.transparent = true;
  this.water_cube = new THREE.Mesh(c, material);
  this.water_cube.castShadow = true;
  this.water_cube.receiveShadow = true;
  this.scene.add(this.water_cube);
  this.fix_water_level();
  
  /** Set up sea floor */
  var mapHeight = THREE.ImageUtils.loadTexture( 'res/sea_floor.png' );
  mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
  mapHeight.format = THREE.RGBFormat;
  material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0xb88854, specular: 0x333333, bumpMap: mapHeight, bumpScale: 10, shininess: 0, metal: false });
  c = new THREE.CubeGeometry(this.water_size, 160, 160); // Don't change the width and depth here, the bump map is based off of them 
  this.sea_floor = new THREE.Mesh(c, material);
  this.sea_floor.receiveShadow = true;
  this.sea_floor.position.x = this.camera_loc.x;
  this.sea_floor.position.y = this.gen_bottom + (this.sea_floor.geometry.height/2);
  this.sea_floor2 = new THREE.Mesh(c, material);
  this.sea_floor2.receiveShadow = true;
  this.sea_floor2.position.x = this.camera_loc.x + this.water_size;
  this.sea_floor2.position.y = this.gen_bottom + (this.sea_floor.geometry.height/2);
  this.scene.add(this.sea_floor);
  this.scene.add(this.sea_floor2);
  
  /** Set up lights */
  // Hemisphere light
  this.hem_light = new THREE.HemisphereLight( 0x61D7FF, 0xffffff, 0.6 );
  this.scene.add( this.hem_light );

  // Directional light 
  this.direct_light = new THREE.DirectionalLight( 0xffffff, 1 ); 
  this.direct_light.castShadow = true;
  this.direct_light.shadowDarkness = 0.35;
  // Changing this makes the shadows have more detail 
  this.direct_light.shadowMapWidth = 2048;
  this.direct_light.shadowMapHeight = 2048;
  this.direct_light.shadowCameraNear = 2;
  this.direct_light.shadowCameraFar = 5000;
  // This is the size of the area the shadow will cover 
  var shadow_box_size = ((w /2)+150);
  this.direct_light.shadowCameraLeft = -this.water_size/2;
  this.direct_light.shadowCameraRight = this.water_size/2;
  this.direct_light.shadowCameraTop = shadow_box_size;
  this.direct_light.shadowCameraBottom = -shadow_box_size;
  //this.direct_light.shadowCameraVisible = true; // Use this for debugging shadows 
  this.scene.add( this.direct_light );
  
  /** Other */
  this.player.init(this);
}

/** Update the state of the level */
GameLevel.prototype.update = function(){
  // Stop game if gameover 
  if (this.gameover)
    return;

  // Update pause button 
  if (keyboard[KEY_P] && !keyboard_old[KEY_P])
    this.paused = !this.paused;

  if (!this.paused){
    // Update camera controls 
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
    
    this.score += this.score_per_unit * this.camera_move_speed;
    
    // Update Player
    this.player.update(this);
    
    // Update blocks 
    for (var i = 0; i < this.blocks.length; i++)
      this.blocks[i].update(this);
      
    // Block generation 
    if (this.camera_loc.x + this.level_width > this.next_gen_loc)
      this.generateChunk();
  }
}

/** Draw the level to the screen */
GameLevel.prototype.draw = function (renderer){
  // Setup camera 
  // Move out to zoom location 
  var cam_loc = new THREE.Vector3(0,0,this.camera_zoom);
  var matrix = new THREE.Matrix4();
  // Make rotation matrix based off of tilt 
  matrix = matrix.makeRotationAxis(
    new THREE.Vector3(1,0,0), this.camera_tilt * (Math.PI/180));
  // Apply matrix to location 
  cam_loc.applyProjection(matrix);
  // Move location to correct x and y values 
  cam_loc.x += this.camera_loc.x;
  cam_loc.y += this.camera_loc.y;
  
  this.camera.position.set( cam_loc.x, cam_loc.y, cam_loc.z );
  this.camera.lookAt(new THREE.Vector3(this.camera_loc.x,this.camera_loc.y,0));
  
  // Draw scene 
  renderer.render( this.scene, this.camera );
}

/** Set the water level to the appropriate height */
GameLevel.prototype.fix_water_level = function (){
  this.water_cube.position.y = this.water_level + (this.water_cube.geometry.height /2);
}

/** Set the water location based on camera location */
GameLevel.prototype.fix_water_loc = function(){
  this.water_cube.position.x = this.camera_loc.x;
  if (this.sea_floor.position.x < this.camera_loc.x - this.water_size)
    this.sea_floor.position.x = this.sea_floor2.position.x + this.water_size;
  if (this.sea_floor2.position.x < this.camera_loc.x - this.water_size)
    this.sea_floor2.position.x = this.sea_floor.position.x + this.water_size;
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
  return this.gen_bottom;
}

/** Get the y value of the top of the level */
GameLevel.prototype.level_top = function(){
  return this.gen_top;
}

/** ========================================================= **/
/** =================== Block Generation ==================== **/
/** ========================================================= **/

/** Generate a new chunk of terrain */
GameLevel.prototype.generateChunk = function (){
  // Temporary grid to store blocks 
  var block_grid = this.block_overflow_grid;
  this.resetOverflowGrid();
  
  /** =========================== **/
  /** Generate obstacles */
  /** =========================== **/
  for (var i = 0; i < this.chunks_per_gen; i ++){
    var type = Math.round(Math.random() * this.pattern_types);
    var method = "this.gen_type" + type + "(block_grid, BlockType.Auto);";
    eval(method);
  } 
  
  /** =========================== **/
  /** Generate correct paths     **/
  /** =========================== **/
  this.makeCorrectPath(block_grid, this.last_path_block, 0);
  this.makeCorrectPath(block_grid, this.last_path_block2, 1);
  
  /** =========================== **/
  /** Convert grid to real blocks **/
  /** =========================== **/
  // Reset list state 
  this.block_list_full = false;
  var chunk_index = this.nextChunkIndex();
  this.chunks[chunk_index] = new Chunk();
  this.chunks[chunk_index].right = this.next_gen_loc + this.hor_blocks * 25;
  this.chunks[chunk_index].active = true;
  
  // Add blocks from grid into list 
  for (var i = 0; i < this.hor_blocks; i++){
    for (var j = 0; j < this.vert_blocks; j++){
      /** Process Blocks **/
      // Set block type based off of height 
      if (block_grid[i][j] == BlockType.Auto){
        if (j > (this.grid_water_level-1) + 3)
          block_grid[i][j] = BlockType.UnderWRock;
        else if (j >= this.grid_water_level - 1)
          block_grid[i][j] = BlockType.Sand;
        else 
          // Grass and Dirt 
          if (block_grid[i][j-1] == BlockType.NoBlock ||
              block_grid[i][j-1] == BlockType.Path || j-1 < 0){
            block_grid[i][j] = BlockType.DirtGrass;
            
            // Make more dirt to make it more dynamic 
            if (block_grid[i][j+1] == BlockType.Auto && Math.random() < .31)
              block_grid[i][j+1] = BlockType.Dirt;
          }
          else
            block_grid[i][j] = BlockType.Rock;
      }
      
      // Turn off path if it is set off 
      if (block_grid[i][j] == BlockType.Path && !this.draw_correct_path)
        block_grid[i][j] = BlockType.NoBlock;
      
      /** Add blocks to level **/
      if (block_grid[i][j] !== BlockType.NoBlock){
        var index = this.nextBlockIndex();
        var block = generateBlock(block_grid[i][j], 
            this.next_gen_loc +(i * 25), this.gen_top + ( j * 25), this.chunks[chunk_index]);
        this.blocks[index] = block;
      }
    }
  }
  
  // Add chunk to scene 
  this.chunks[chunk_index].finish(this.scene);
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

/** Generate a correct path **/
GameLevel.prototype.makeCorrectPath = function(grid, path, path_number){
  var directon = -1;
  /* 0 = Up
   * 1 = Right
   * 2 = Down */
  for (var i = 0; i < this.hor_blocks - 1; i++){
    // Get next direction for path
    if (path == 0)
      direction = Math.round(Math.random()) + 1;
    else if (path == this.vert_blocks - 1)
      direction = Math.round(Math.random());
    else
      direction = Math.round(Math.random() * 2)
    
    //this.setPathBlockInGrid(grid, i, j, BlockType.Path);
    if (direction == 0){
      // Front two blocks 
      this.setPathBlockInGrid(grid, i, path, BlockType.Path);
      this.setPathBlockInGrid(grid, i+1,path, BlockType.Path);
      // Top two blocks 
      this.setPathBlockInGrid(grid, i, path-1, BlockType.Path);
      this.setPathBlockInGrid(grid, i+1, path-1, BlockType.Path);
      
      // Move path block up 
      path -= 1;
    } else if(direction == 1){
      // Front block
      this.setPathBlockInGrid(grid, i, path, BlockType.Path);
    } else if(direction == 2){
      // Front two blocks 
      this.setPathBlockInGrid(grid, i, path, BlockType.Path);
      this.setPathBlockInGrid(grid, i+1, path, BlockType.Path);
      // Top two blocks 
      this.setPathBlockInGrid(grid, i, path+1, BlockType.Path);
      this.setPathBlockInGrid(grid,i+1,path+1, BlockType.Path);
      
      // Move path block up 
      path += 1;
    }
  }
  grid[this.hor_blocks-1][path] = BlockType.Path;
  
  // Set path index for later 
  if (path_number == 0) this.last_path_block = path;
  if (path_number == 1) this.last_path_block2 = path;
}


/** Get the index of the next available block */
GameLevel.prototype.nextBlockIndex = function (){
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

/** Get the index of the next chunk */
GameLevel.prototype.nextChunkIndex = function (){
  var i = this.chunks.length;
  // Go through chunk list and find first dead chunk
  for (i = 0; i < this.chunks.length; i++){
    if (!this.chunks[i].active)
      return i;
  }
  return i;
}

/** Reset the overflow grid to use next time */
GameLevel.prototype.resetOverflowGrid = function(){
  // Temporary grid to store blocks 
  this.block_overflow_grid = [this.hor_blocks];
  // Create block grid 
  for (var i = 0; i < this.hor_blocks; i++){
    this.block_overflow_grid[i] = [this.vert_blocks];
    for (var j = 0; j < this.vert_blocks; j++)
      this.block_overflow_grid[i][j] = BlockType.NoBlock;
  }
}

/** Helper method to set a block in a block grid. 
 * Check indexes to make sure it is a valid placement */
GameLevel.prototype.setBlockInGrid = function(grid, i, j, type){
  // If block fits in first grid, put it there
  if (i >= 0 && i < this.hor_blocks && j >= 0 && j < this.vert_blocks)
    grid[i][j] = type;
  // If it doesnt fit in first grid, check if it fits in second grid 
  else if (i >= this.hor_blocks && j >= 0 && j < this.vert_blocks){
    i -= this.hor_blocks;
    this.block_overflow_grid[i][j] = type;
  }
}

/** This is the same as the method above, except it places a block below
 ** the path **/
GameLevel.prototype.setPathBlockInGrid = function(grid, i, j, type){
  if (i >= 0 && i < this.hor_blocks && j >= 0 && j < this.vert_blocks)
    grid[i][j] = type;
  
  // Place block below path if above water. 
  j++;
  var place_block = Math.random();
  if (i >= 0 && i < this.hor_blocks && j >= 0 && j < this.vert_blocks && 
      // Make sure block isnt path block 
      grid[i][j] != BlockType.Path && 
      // Random to decide whether to place 
      place_block < this.under_path_percent && 
      // Make sure path is above water level
      j-1 < this.grid_water_level)
    grid[i][j] = BlockType.Auto;
}


/** Generate a square in the grid **/
GameLevel.prototype.gen_type0 = function(grid, type){
  // Randomly decide top left corner for block 
  var x = Math.round(Math.random() * (this.hor_blocks - 1));
  var y = Math.round(Math.random() * (this.vert_blocks - 1));
  // Randomly get a size 
  var w = Math.round(Math.random() * 3) + 1;
  var h = Math.round(Math.random() * 3) + 1;
  
  for (var i = 0; i < w; i++){
    for (var j = 0; j < h; j++){
      this.setBlockInGrid(grid, x + i, y + j, type)
    }
  }
}

/** Generate a block shape that looks like the following 
 *   #
 *  ###
 * #####
 *  ###
 *   #   **/
GameLevel.prototype.gen_type1 = function(grid, type){
  // Get a staring location 
  var x = Math.round(Math.random() * (this.hor_blocks - 1));
  var y = Math.round(Math.random() * (this.vert_blocks - 1));
  
  // Make shape 
  this.setBlockInGrid(grid, x, y, type);
  this.setBlockInGrid(grid, x - 1, y, type);
  this.setBlockInGrid(grid, x - 2, y, type);
  this.setBlockInGrid(grid, x + 1, y, type);
  this.setBlockInGrid(grid, x + 2, y, type);
  this.setBlockInGrid(grid, x, y - 1, type);
  this.setBlockInGrid(grid, x, y - 2, type);
  this.setBlockInGrid(grid, x, y + 1, type);
  this.setBlockInGrid(grid, x, y + 2, type);
  this.setBlockInGrid(grid, x - 1, y - 1, type);
  this.setBlockInGrid(grid, x + 1, y - 1, type);
  this.setBlockInGrid(grid, x + 1, y + 1, type);
  this.setBlockInGrid(grid, x - 1, y + 1, type);
}

/** Generate a block shape that looks like the following 
 *      #####
 *    #########
 *      #####
 **/
GameLevel.prototype.gen_type2 = function(grid, type){
  // Get a staring location 
  var x = Math.round(Math.random() * (this.hor_blocks - 1));
  var y = Math.round(Math.random() * (this.vert_blocks - 1));
  
  // Make shape 
  this.setBlockInGrid(grid, x, y, type);
  this.setBlockInGrid(grid, x - 1, y, type);
  this.setBlockInGrid(grid, x - 2, y, type);
  this.setBlockInGrid(grid, x - 3, y, type);
  this.setBlockInGrid(grid, x - 4, y, type);
  this.setBlockInGrid(grid, x + 1, y, type);
  this.setBlockInGrid(grid, x + 2, y, type);
  this.setBlockInGrid(grid, x + 3, y, type);
  this.setBlockInGrid(grid, x + 4, y, type);
  this.setBlockInGrid(grid, x - 2, y - 1, type);
  this.setBlockInGrid(grid, x - 1, y - 1, type);
  this.setBlockInGrid(grid, x, y - 1, type);
  this.setBlockInGrid(grid, x + 1, y - 1, type);
  this.setBlockInGrid(grid, x + 2, y - 1, type);
  this.setBlockInGrid(grid, x - 2, y + 1, type);
  this.setBlockInGrid(grid, x - 1, y + 1, type);
  this.setBlockInGrid(grid, x, y + 1, type);
  this.setBlockInGrid(grid, x + 1, y + 1, type);
  this.setBlockInGrid(grid, x + 2, y + 1, type);
}

/** Generate a block shape that looks like the following 
 *    ##
 *     ##
 *      ##
 *       ##
 **/
GameLevel.prototype.gen_type3 = function(grid, type){
  // Get a staring location 
  var x = Math.round(Math.random() * (this.hor_blocks - 1));
  var y = Math.round(Math.random() * (this.vert_blocks - 1));
  
  // Make shape 
  this.setBlockInGrid(grid, x, y, type);
  this.setBlockInGrid(grid, x + 1, y + 1, type);
  this.setBlockInGrid(grid, x + 2, y + 2, type);
  this.setBlockInGrid(grid, x + 3, y + 3, type);
  this.setBlockInGrid(grid, x + 1, y, type);
  this.setBlockInGrid(grid, x + 2, y + 1, type);
  this.setBlockInGrid(grid, x + 3, y + 2, type);
  this.setBlockInGrid(grid, x + 4, y + 3, type);
}

/** Generate a block shape that looks like the following 
 *       #
 *     ##
 *     ##
 *    #  
 **/
GameLevel.prototype.gen_type4 = function(grid, type){
  // Get a staring location 
  var x = Math.round(Math.random() * (this.hor_blocks - 1));
  var y = Math.round(Math.random() * (this.vert_blocks - 1));
  
  // Make shape 
  this.setBlockInGrid(grid, x, y, type);
  this.setBlockInGrid(grid, x + 1, y - 1, type);
  this.setBlockInGrid(grid, x + 2, y - 2, type);
  this.setBlockInGrid(grid, x + 3, y - 3, type);
  this.setBlockInGrid(grid, x + 1, y - 2, type);
  this.setBlockInGrid(grid, x + 2, y - 1, type);
}

/** Generate a block shape that looks like the following 
 *    ####
 *     ##
 **/
GameLevel.prototype.gen_type5 = function(grid, type){
  // Get a staring location 
  var x = Math.round(Math.random() * (this.hor_blocks - 1));
  var y = Math.round(Math.random() * (this.vert_blocks - 1));
  
  // Make shape 
  this.setBlockInGrid(grid, x, y, type);
  this.setBlockInGrid(grid, x + 1, y, type);
  this.setBlockInGrid(grid, x + 2, y, type);
  this.setBlockInGrid(grid, x + 3, y, type);
  this.setBlockInGrid(grid, x + 1, y + 1, type);
  this.setBlockInGrid(grid, x + 2, y + 1, type);
}

/** Generate a block shape that looks like the following 
 *    ##
 *
 *    ##
 *
 *    ##
 **/
GameLevel.prototype.gen_type6 = function(grid, type){
  // Get a staring location 
  var x = Math.round(Math.random() * (this.hor_blocks - 1));
  var y = Math.round(Math.random() * (this.vert_blocks - 1));
  
  // Make shape 
  this.setBlockInGrid(grid, x, y, type);
  this.setBlockInGrid(grid, x + 1, y, type);
  this.setBlockInGrid(grid, x, y + 2, type);
  this.setBlockInGrid(grid, x + 1, y + 2, type);
  this.setBlockInGrid(grid, x, y + 4, type);
  this.setBlockInGrid(grid, x + 1, y + 4, type);
}

/** Generate a block shape that looks like the following 
 *    #####
 *    #####
 *      #
 *      #
 *    #####
 **/
GameLevel.prototype.gen_type7 = function(grid, type){
  // Get a staring location 
  var x = Math.round(Math.random() * (this.hor_blocks - 1));
  var y = Math.round(Math.random() * (this.vert_blocks - 1));
  
  // Make shape 
  this.setBlockInGrid(grid, x, y, type);
  this.setBlockInGrid(grid, x + 1, y, type);
  this.setBlockInGrid(grid, x + 2, y, type);
  this.setBlockInGrid(grid, x + 3, y, type);
  this.setBlockInGrid(grid, x + 4, y, type);
  
  this.setBlockInGrid(grid, x, y + 1, type);
  this.setBlockInGrid(grid, x + 1, y + 1, type);
  this.setBlockInGrid(grid, x + 2, y + 1, type);
  this.setBlockInGrid(grid, x + 3, y + 1, type);
  this.setBlockInGrid(grid, x + 4, y + 1, type);
  
  this.setBlockInGrid(grid, x + 2, y + 2, type);
  this.setBlockInGrid(grid, x + 2, y + 3, type);
  
  this.setBlockInGrid(grid, x, y + 4, type);
  this.setBlockInGrid(grid, x + 1, y + 4, type);
  this.setBlockInGrid(grid, x + 2, y + 4, type);
  this.setBlockInGrid(grid, x + 3, y + 4, type);
  this.setBlockInGrid(grid, x + 4, y + 4, type);
}

/** Generate a block shape that looks like the following 
 *    ##
 *   ####
 *  ##  ##
 **/
GameLevel.prototype.gen_type8 = function(grid, type){
  // Get a staring location 
  var x = Math.round(Math.random() * (this.hor_blocks - 1));
  var y = Math.round(Math.random() * (this.vert_blocks - 1));
  
  // Make shape 
  this.setBlockInGrid(grid, x, y, type);
  this.setBlockInGrid(grid, x + 1, y, type);
  this.setBlockInGrid(grid, x - 1, y + 1, type);
  this.setBlockInGrid(grid, x, y + 1, type);
  this.setBlockInGrid(grid, x + 1, y + 1, type);
  this.setBlockInGrid(grid, x + 2, y + 1, type);
  this.setBlockInGrid(grid, x - 2, y + 2, type);
  this.setBlockInGrid(grid, x - 1, y + 2, type);
  this.setBlockInGrid(grid, x + 2, y + 2, type);
  this.setBlockInGrid(grid, x + 3, y + 2, type);
}












