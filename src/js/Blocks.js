/** Block structure */
function Block(x,y,type){
  // Location of block
  this.x = x, this.y = y;   // Top left corner of block location 
  this.width = 25;
  this.height = 25;
  this.block_type = type;   // Type of block 
  this.active = true;       // Set to true if block is on level, false if not. 
  this.collides = true;     // Set to true if block collides with player 
}

/** Block type list */
var BlockType = { 
  "NoBlock": 0,
  "Auto": 1, // Sets itself during generation 
  "Path": 2, //(used for the correct block path for the player, should not be drawn)
  "Rock": 3,
  "UnderWRock": 4,
  "Sand": 5,
  "Dirt": 6
};

/** Update block */
Block.prototype.update = function(level){
  // Check if block is off screen. 
  if (this.x < level.level_left() - 100){
    this.active = false;
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
  else if (type == BlockType.Dirt){
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var mesh = new THREE.Mesh(cube, dirt_material);
    mesh.position.x = x + 12;
    mesh.position.y = y + 12;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Put path into chunk 
    if (chunk.sand_mesh == 0)
      chunk.dirt_mesh = mesh;
    else {
      mesh.position.x -= chunk.dirt_mesh.position.x;
      mesh.position.y -= chunk.dirt_mesh.position.y;
      THREE.GeometryUtils.merge(chunk.dirt_mesh.geometry, mesh);
    }
      
    return new Block(x,y,type);
  }
  
  return new Block(x,y,type);
}