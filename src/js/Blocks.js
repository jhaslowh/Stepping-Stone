/** Block structure */
function Block(x,y,type, mesh){
  // Location of block
  this.x = x;
  this.y = y;
  this.width = 25;
  this.height = 25;
  
  // Block type
  this.block_type = type; 
  
  this.mesh = mesh;
}

/** Block type list */
var BlockType = { 
  "Path": 0, //(used for the correct block path for the player, should not be drawn)
  "Rock": 1, 
  "Sand": 2 
 };

/** Check collision with player */
Block.prototype.collides = function(player){
  // TODO 
  return false;
}

/** Return a block for the given type */
function generateBlock(type, x, y){
  if (type == BlockType.Path){
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var material = new THREE.MeshLambertMaterial( { color: 0x99ff9b} );
    var mesh = new THREE.Mesh(c, material);
    mesh.position.x = x + (this.width / 2);
    mesh.position.y = y + (this.height / 2);
    return new Block(x,y,type,mesh);
  }
  else if (type == BlockType.Rock){
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var material = new THREE.MeshLambertMaterial( { color: 0x737980} );
    var mesh = new THREE.Mesh(c, material);
    mesh.position.x = x + (this.width / 2);
    mesh.position.y = y + (this.height / 2);
    return new Block(x,y,type,mesh);
  }
  else if (type == BlockType.Sand){
    var cube = new THREE.CubeGeometry( 25,25,25); 
    var material = new THREE.MeshLambertMaterial( { color: 0xffefa7} );
    var mesh = new THREE.Mesh(c, material);
    mesh.position.x = x + (this.width / 2);
    mesh.position.y = y + (this.height / 2);
    return new Block(x,y,type,mesh);
  }
  
  // Default Black Block
  var cube = new THREE.CubeGeometry( 25,25,25); 
  var material = new THREE.MeshLambertMaterial( { color: 0x000000} );
  var mesh = new THREE.Mesh(c, material);
  mesh.position.x = x + (this.width / 2);
  mesh.position.y = y + (this.height / 2);
  return new Block(x,y,type,mesh);
}