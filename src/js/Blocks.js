/** Block structure */
function Block(x,y,type, mesh){
  // Location of block
  this.x = x, this.y = y;   // Top left corner of block location 
  this.width = 25;
  this.height = 25;
  this.block_type = type;   // Type of block 
  this.mesh = mesh;         // Block mesh 
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
  "Sand": 5
};

/** Update block */
Block.prototype.update = function(level){
  // Check if block is off screen. 
  if (this.mesh.position.x < level.level_left() - 100){
    level.scene.remove(this.mesh);
    this.active = false;
  }
}

/** Return a block for the given type */
function generateBlock(type, x, y){
  if (type == BlockType.Path){
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var material = new THREE.MeshLambertMaterial( { color: 0x99ff9b} );
   // material.opacity = .55;
    //material.transparent = true;
    var mesh = new THREE.Mesh(cube, material);
    mesh.position.x = x + 12;
    mesh.position.y = y + 12;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    var b = new Block(x,y,type,mesh);
    b.collides = false;
    return b;
  }
  else if (type == BlockType.Rock){
    var mapHeight = THREE.ImageUtils.loadTexture( 'res/rock.png' );
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.format = THREE.RGBFormat;
    material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0x737980, specular: 0x333333, shininess: 0, bumpMap: mapHeight, bumpScale: 20, metal: false });
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var mesh = new THREE.Mesh(cube, material);
    mesh.position.x = x + 12;
    mesh.position.y = y + 12;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return new Block(x,y,type,mesh);
  }
  else if (type == BlockType.Sand){
    var mapHeight = THREE.ImageUtils.loadTexture( 'res/sand.png' );
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.format = THREE.RGBFormat;
    material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0xffefa7, specular: 0x333333, shininess: 0, bumpMap: mapHeight, bumpScale: 5, metal: false });
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var mesh = new THREE.Mesh(cube, material);
    mesh.position.x = x + 12;
    mesh.position.y = y + 12;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return new Block(x,y,type,mesh);
  }
  else if (type == BlockType.UnderWRock){
    var mapHeight = THREE.ImageUtils.loadTexture( 'res/UnderWRock.png' );
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.format = THREE.RGBFormat;
    material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0x3e4a60, specular: 0x333333, shininess: 0, bumpMap: mapHeight, bumpScale: 20, metal: false });
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var mesh = new THREE.Mesh(cube, material);
    mesh.position.x = x + 12;
    mesh.position.y = y + 12;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return new Block(x,y,type,mesh);
  }
  
  // Default Black Block
  var cube = new THREE.CubeGeometry( 25,25,25); 
  var material = new THREE.MeshLambertMaterial( { color: 0x000000} );
  var mesh = new THREE.Mesh(cube, material);
  mesh.position.x = x + 12;
  mesh.position.y = y + 12;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return new Block(x,y,type,mesh);
}