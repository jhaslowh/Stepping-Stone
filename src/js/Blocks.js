/** Block structure */
function Block(x,y,type){
  // Location of block
  this.x = x, this.y = y;   // Top left corner of block location 
  this.width = 25;
  this.height = 25;
  this.block_type = type;   // Type of block 
  this.active = true;       // Set to true if block is on level, false if not. 
  this.collides = true;     // Set to true if block collides with player
  this.picked_up = false;   // Used for power ups 
  this.mesh = 0;
}

/** Block type list */
var BlockType = { 
  "NoBlock": 0,
  "Auto": 1, // Sets itself during generation 
  "Path": 2, //(used for the correct block path for the player, should not be drawn)
  "Rock": 3,
  "UnderWRock": 4,
  "Sand": 5,
  "Dirt": 6,
  "DirtGrass": 7,
  "Time": 8,
  "Death": 9
};

/** Update block */
Block.prototype.update = function(level){
  // Check if block is off screen. 
  if (this.x < level.level_left() - 100){
    this.active = false;
  }
}

/** Called when the player collides with the block **/
Block.prototype.collide = function(){
  if (this.block_type == BlockType.Time && this.picked_up == false){
    level.timeDropPickedUp();
    level.scene.remove(this.mesh);
    this.collides = false;
    this.picked_up = true;
  }
}

/** ================================================= **/
/** ======== Block Generation ======================= **/
/** ================================================= **/
var path_material = new THREE.MeshLambertMaterial( { color: 0x99ff9b} );

// Rock Material
var mapHeight = THREE.ImageUtils.loadTexture( 'res/rock.png' );
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.format = THREE.RGBFormat;
var rock_material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0x737980, specular: 0x333333, shininess: 0, bumpMap: mapHeight, bumpScale: 20, metal: false });

// Sand Material
    mapHeight = THREE.ImageUtils.loadTexture( 'res/sand.png' );
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.format = THREE.RGBFormat;
var sand_material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0xffefa7, specular: 0x333333, shininess: 0, bumpMap: mapHeight, bumpScale: 5, metal: false });

// Underwater rock material
    mapHeight = THREE.ImageUtils.loadTexture( 'res/UnderWRock.png' );
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.format = THREE.RGBFormat;
var UWRock_material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0x3e4a60, specular: 0x333333, shininess: 0, bumpMap: mapHeight, bumpScale: 20, metal: false });

// Dirt material 
    mapHeight = THREE.ImageUtils.loadTexture( 'res/dirt.png' );
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.format = THREE.RGBFormat;
var dirt_material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0xa67944, specular: 0x333333, shininess: 0, bumpMap: mapHeight, bumpScale: 5, metal: false });

// Grass material 
var grass_material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0x59c964, specular: 0x333333, shininess: 0, metal: false });

// Time material 
var texture = THREE.ImageUtils.loadTexture( 'res/time.png' );
    mapHeight = THREE.ImageUtils.loadTexture( 'res/timeb.png' );
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.format = THREE.RGBFormat;
var time_material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0xffffff, specular: 0x333333, shininess: 0, bumpMap: mapHeight, bumpScale: 5, metal: false, map: texture});

/** Return a block for the given type */
function generateBlock(type, x, y, chunk){
  if (type == BlockType.Path){
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var mesh = new THREE.Mesh(cube, path_material);
    mesh.position.x = x + 12;
    mesh.position.y = y + 12;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    var b = new Block(x,y,type);
    b.collides = false;
    
    // Put path into chunk 
    if (chunk.path_mesh == 0)
      chunk.path_mesh = mesh;
    else {
      mesh.position.x -= chunk.path_mesh.position.x;
      mesh.position.y -= chunk.path_mesh.position.y;
      THREE.GeometryUtils.merge(chunk.path_mesh.geometry, mesh);
    }
    
    return b;
  }
  else if (type == BlockType.Rock){
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var mesh = new THREE.Mesh(cube, rock_material);
    mesh.position.x = x + 12;
    mesh.position.y = y + 12;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Put path into chunk 
    if (chunk.rock_mesh == 0)
      chunk.rock_mesh = mesh;
    else {
      mesh.position.x -= chunk.rock_mesh.position.x;
      mesh.position.y -= chunk.rock_mesh.position.y;
      THREE.GeometryUtils.merge(chunk.rock_mesh.geometry, mesh);
    }
    
    return new Block(x,y,type);
  }
  else if (type == BlockType.Sand){
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var mesh = new THREE.Mesh(cube, sand_material);
    mesh.position.x = x + 12;
    mesh.position.y = y + 12;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Put path into chunk 
    if (chunk.sand_mesh == 0)
      chunk.sand_mesh = mesh;
    else {
      mesh.position.x -= chunk.sand_mesh.position.x;
      mesh.position.y -= chunk.sand_mesh.position.y;
      THREE.GeometryUtils.merge(chunk.sand_mesh.geometry, mesh);
    }
      
    return new Block(x,y,type);
  }
  else if (type == BlockType.UnderWRock){
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var mesh = new THREE.Mesh(cube, UWRock_material);
    mesh.position.x = x + 12;
    mesh.position.y = y + 12;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Put path into chunk 
    if (chunk.underWaterRock_mesh == 0)
      chunk.underWaterRock_mesh = mesh;
    else {
      mesh.position.x -= chunk.underWaterRock_mesh.position.x;
      mesh.position.y -= chunk.underWaterRock_mesh.position.y;
      THREE.GeometryUtils.merge(chunk.underWaterRock_mesh.geometry, mesh);
    }
      
    return new Block(x,y,type);
  }
  else if (type == BlockType.Dirt || type == BlockType.DirtGrass){
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var mesh = new THREE.Mesh(cube, dirt_material);
    mesh.position.x = x + 12;
    mesh.position.y = y + 12;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Put path into chunk 
    if (chunk.dirt_mesh == 0)
      chunk.dirt_mesh = mesh;
    else {
      mesh.position.x -= chunk.dirt_mesh.position.x;
      mesh.position.y -= chunk.dirt_mesh.position.y;
      THREE.GeometryUtils.merge(chunk.dirt_mesh.geometry, mesh);
    }
    
    // Make grass 
    if (type == BlockType.DirtGrass){
      cube = new THREE.CubeGeometry( 25,6,25); 
      mesh = new THREE.Mesh(cube, grass_material);
      mesh.position.x = x + 12;
      mesh.position.y = y - 3;
      mesh.receiveShadow = true;
      
      // Put path into chunk 
      if (chunk.grass_mesh == 0)
        chunk.grass_mesh = mesh;
      else {
        mesh.position.x -= chunk.grass_mesh.position.x;
        mesh.position.y -= chunk.grass_mesh.position.y;
        THREE.GeometryUtils.merge(chunk.grass_mesh.geometry, mesh);
      }
    }
      
    return new Block(x,y,type);
  }
  else if (type == BlockType.Time){
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var mesh = new THREE.Mesh(cube, time_material);
    mesh.position.x = x + 12;
    mesh.position.y = y + 12;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    var b = new Block(x,y,type);
    b.mesh = mesh;
    level.scene.add(b.mesh);
      
    return b;
  }
  
  return new Block(x,y,type);
}


/** =================================== **/
/**       Pathfinding                   **/
/** =================================== **/

var DRAW_PATHFINDING = true;
// 
var MOVE_COST = 1;
var MOVE_COST_DIAG = 2;

// Structure for the death block 
function DeathBlock(x,y,type){
  // Make a child
  Block.call(this,x,y,type);
  // Grid
  this.blockGrid = -1;
  // Current Location in grid
  this.gridLoc = {i:0,j:0};
  // Location start
  this.startLoc = {x:0,y:0};
  // Location goal
  this.goalLoc = {x:0,y:0};
  // Start of grid loc
  this.gridStartX = 0;
  // Bool for path state 
  this.pathMade = false;
  // Mesh of shape 
  this.mesh = -1;

  // Debug 
  this.debug_line = -1;
  this.debug_target = -1;
}

// Update death block 
DeathBlock.prototype.update = function(level){
  // Check if player is x >= grid start x
  if (!this.pathMade && level.player.mesh.position.x >= this.gridStartX){
    // Set Goal 
    this.goalLoc.x = this.gridStartX + 12.5;
    this.goalLoc.y = 
      (Math.floor((level.player.mesh.position.y-level.gen_top)/ 25)*25) + 12.5;

    // Gen path 
    this.findPath();
  }

  // Check if block is off screen. 
  if (this.x < level.level_left() - 100){
    this.active = false;
    level.scene.remove(this.mesh);
    if (this.debug_line != -1) level.scene.remove(this.debug_line);
    if (this.degub_target != -1) level.scene.remove(this.debug_target);
  }
}

/** Called when the player collides with the block **/
DeathBlock.prototype.collide = function(){
  if (this.block_type == BlockType.Death && this.picked_up == false){
    level.scene.remove(this.mesh);
    if (this.debug_line != -1) level.scene.remove(this.debug_line);
    if (this.degub_target != -1) level.scene.remove(this.debug_target);
    this.collides = false;
    this.picked_up = true;
  }
}

// Pathfinding for death block 
// Uses: http://www.policyalmanac.org/games/aStarTutorial.htm
DeathBlock.prototype.findPath = function(){
  // Blocks to look at
  var open = [];
  // Current Path Blocks 
  var closed = [];

  // Set up first node 
  var current = new Node(this.startLoc.x,this.startLoc.y,0,this.gridLoc.i,this.gridLoc.j);
  current.setHeuristic(this.goalLoc);
  open.push(current);

  // Search grid for correct path 
  while (current.loc.x != this.goalLoc.x && current.loc.y != this.goalLoc.y){
    // Take current out of open list and add it to closed
    var index = open.indexOf(current);
    if (index >= 0) open.splice(index, 1);
    closed.push(current);

    // Add neighbors to open list 
    this.addLegal(this.gridLoc.i, this.gridLoc.j, open, closed, current);

    // Find next closest path 
    if (open.length == 0)break;
    current = open[0];
    for (var i = 1; i < open.length; i++){
      if (open[i].F() < current.F())
        current = open[i];
    }

    // Move grid location 
    this.gridLoc.i = current.i;
    this.gridLoc.j = current.j;
  }

  // Debug path 
  if (DRAW_PATHFINDING){
    var temp = current;
    var geom = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({ color: 0x000000 });
    while (temp != -1){
      geom.vertices.push(new THREE.Vector3(temp.loc.x, temp.loc.y, 0));
      temp = temp.parent;
    }
    this.debug_line = new THREE.Line(geom, material);
    level.scene.add(this.debug_line);
    var cube = new THREE.CubeGeometry( 14,14,14); 
    this.debug_target = new THREE.Mesh(cube, path_material);
    this.debug_target.position.x = this.goalLoc.x;
    this.debug_target.position.y = this.goalLoc.y;
    level.scene.add(this.debug_target);
  }

  // Get rid of grid 
  this.blockGrid = -1;
  this.pathMade = true;

  // current is not equal to target, kill block 
  if (current.loc.x != this.goalLoc.x && current.loc.y != this.goalLoc.y){
    this.active = false;
    level.scene.remove(this.mesh);
    return;
  }


  // TODO generate path movement 

}

// Add ajacent legal nodes to open list
DeathBlock.prototype.addLegal = function(i,j,open,closed,parent){
  // Check left 
  if (i-1 >= 0 && (this.blockGrid[i-1][j] == BlockType.NoBlock ||
    this.blockGrid[i-1][j] == BlockType.Path)){
    // Make node
    var node = new Node(
      this.gridStartX + ((i-1) * 25) + 12.5, 
      level.gen_top + (j * 25) + 12.5, 
      parent.G + MOVE_COST, i-1, j);
    node.parent = parent;
    node.setHeuristic(this.goalLoc);

    // Add to open list
    this.addToOpenList(node,open,closed);
  }

  // Check Top Left 
  if (i-1 >= 0 && j-1 >= 0 && (this.blockGrid[i-1][j-1] == BlockType.NoBlock ||
    this.blockGrid[i-1][j-1] == BlockType.Path)){
    // Make node
    var node = new Node(
      this.gridStartX + ((i-1) * 25) + 12.5, 
      level.gen_top + ((j-1) * 25) + 12.5, 
      parent.G + MOVE_COST_DIAG, i-1, j-1);
    node.parent = parent;
    node.setHeuristic(this.goalLoc);

    // Add to open list
    this.addToOpenList(node,open,closed);
  }

  // Check top
  if (j-1 >= 0 && (this.blockGrid[i][j-1] == BlockType.NoBlock ||
    this.blockGrid[i][j-1] == BlockType.Path)){
    // Make node
    var node = new Node(
      this.gridStartX + (i * 25) + 12.5, 
      level.gen_top + ((j-1) * 25) + 12.5, 
      parent.G + MOVE_COST,i,j-1);
    node.parent = parent;
    node.setHeuristic(this.goalLoc);

    // Add to open list
    this.addToOpenList(node,open,closed);
  }

  // Check top right 
  if (i+1 < this.blockGrid.length && j-1 >= 0 && 
    (this.blockGrid[i+1][j-1] == BlockType.NoBlock ||
    this.blockGrid[i+1][j-1] == BlockType.Path)){
    // Make node
    var node = new Node(
      this.gridStartX + ((i+1) * 25) + 12.5, 
      level.gen_top + ((j-1) * 25) + 12.5, 
      parent.G + MOVE_COST_DIAG,i+1,j-1);
    node.parent = parent;
    node.setHeuristic(this.goalLoc);

    // Add to open list
    this.addToOpenList(node,open,closed);
  }

  // Check right
  if (i+1 < this.blockGrid.length && (this.blockGrid[i+1][j] == BlockType.NoBlock ||
    this.blockGrid[i+1][j] == BlockType.Path)){
    // Make node
    var node = new Node(
      this.gridStartX + ((i+1) * 25) + 12.5, 
      level.gen_top + (j * 25) + 12.5, 
      parent.G + MOVE_COST,i+1,j);
    node.parent = parent;
    node.setHeuristic(this.goalLoc);

    // Add to open list
    this.addToOpenList(node,open,closed);
  }

  // Check bottom right
  if (j+1 < this.blockGrid[i].length && i+1 < this.blockGrid.length && 
    (this.blockGrid[i+1][j+1] == BlockType.NoBlock ||
    this.blockGrid[i+1][j+1] == BlockType.Path)){
    // Make node
    var node = new Node(
      this.gridStartX + ((i+1) * 25) + 12.5, 
      level.gen_top + ((j+1) * 25) + 12.5, 
      parent.G + MOVE_COST_DIAG,i+1,j+1);
    node.parent = parent;
    node.setHeuristic(this.goalLoc);

    // Add to open list
    this.addToOpenList(node,open,closed);
  }

  // Check bottom
  if (j+1 < this.blockGrid[i].length && (this.blockGrid[i][j+1] == BlockType.NoBlock ||
    this.blockGrid[i][j+1] == BlockType.Path)){
    // Make node
    var node = new Node(
      this.gridStartX + (i * 25) + 12.5, 
      level.gen_top + ((j+1) * 25) + 12.5, 
      parent.G + MOVE_COST,i,j+1);
    node.parent = parent;
    node.setHeuristic(this.goalLoc);

    // Add to open list
    this.addToOpenList(node,open,closed);
  }

  // Check bottom left
  if (j+1 < this.blockGrid[i].length && i-1 >= 0 && 
    (this.blockGrid[i-1][j+1] == BlockType.NoBlock ||
    this.blockGrid[i-1][j+1] == BlockType.Path)){
    // Make node
    var node = new Node(
      this.gridStartX + ((i-1) * 25) + 12.5, 
      level.gen_top + ((j+1) * 25) + 12.5, 
      parent.G + MOVE_COST_DIAG,i-1,j+1);
    node.parent = parent;
    node.setHeuristic(this.goalLoc);

    // Add to open list
    this.addToOpenList(node,open,closed);
  }
}

// Add to open
DeathBlock.prototype.addToOpenList = function(node, open,closed){
  // Check if legal
  for (var i = 0; i < open.length; i++){
    if (open[i].loc.x == node.loc.x && open[i].loc.y == node.loc.y)
    {
      // TODO Might be wrong 
      if (node.G > open[i].G){
        open[i].G = node.G;
        open[i].parent = node.parent;
      }
      return;
    }
  }
  for (var i = 0; i < closed.length; i++){
    if (closed[i].loc.x == node.loc.x && closed[i].loc.y == node.loc.y)
      return;
  }

  open.push(node);
}

// Get death block 
function getDeathBlock(x,y,type,grid,i,j,gridx){
  var cube = new THREE.CubeGeometry( 25,25,25); 
  var mapHeight = THREE.ImageUtils.loadTexture( 'res/rock.png' );
  mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
  mapHeight.format = THREE.RGBFormat;
  var material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0xff0000, specular: 0x333333, shininess: 0, bumpMap: mapHeight, bumpScale: 20, metal: false });
  var mesh = new THREE.Mesh(cube, material);
  mesh.position.x = x + 12.5;
  mesh.position.y = y + 12.5;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  var b = new DeathBlock(x,y,type);
  // Set up block variables 
  b.mesh = mesh;
  b.blockGrid = grid;
  b.startLoc.x = x + 12.5;
  b.startLoc.y = y + 12.5;
  b.gridLoc.i = i;
  b.gridLoc.j = j;
  b.gridStartX = gridx;
  
  level.scene.add(b.mesh);
  return b;
}

// Node used for pathfinding 
function Node(x,y,G,i,j){
  // Parent node of this one 
  this.parent = -1;
  // Location 
  this.loc = {x:x,y:y};
  // Our G score value 
  this.G = 0;
  // Our heuristic value 
  this.H = 0;
  // indexs
  this.i = i;
  this.j = j;
}

// Get node F score 
Node.prototype.F = function(){ 
  return this.G + this.H;
}

// Set Heuristic value 
Node.prototype.setHeuristic = function(goal){
  var dx = Math.abs(this.loc.x - goal.x);
  var dy = Math.abs(this.loc.y - goal.y);
  // Movement cost 
  var D = 1;
  this.H = D * Math.max(dx, dy);
}













