/** Block structure */
function Block(x,y,type){
  // Location of block
  this.x = x;
  this.y = y;
  this.width = 25;
  this.height = 25;
  
  // Block type
  this.block_type = type; 
}

/** Block type list */
var BlockType = { 
  "Path": 0, //(used for the correct block path for the player, should not be drawn)
  "Rock": 1, 
  "Sand": 2 
 };

/** Draw block to the screen */
Block.prototype.draw = function (){
  /* Based on the type of block, render it differently */
  if (this.block_type === BlockType.Path){return;}
  else if (this.block_type === BlockType.Rock){
    // TODO
  }
  else if (this.block_type === BlockType.Sand){
    // TODO 
  }
}

/** Check collision with player */
Block.prototype.collides = function(player){
  // TODO 
  return false;
}