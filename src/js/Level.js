// Structure to hold all level data 
function GameLevel(){
  // List of all blocks 
  var blocks = [];
  
  // Last correct path block placed 
  var last_path_block;
  
  // Player
  var player = new Player();
  
  // Generation variables 
  var next_gen_loc = 0; // Starting x value for next chunk of generated land 
  var gen_min_y = 0;
  var gen_max_y = 0;
}

/** Initialize level */
GameLevel.prototype.init = function (){
  // TODO 
  // Need to generate starting terrain (probably 3 screens worth) 
}

/** Update the state of the level */
GameLevel.prototype.update = function(){
  // TODO 
}

/** Draw the level to the screen */
GameLevel.prototype.draw = function (){
  // TODO 
}

/** Generate a new chunk of terrain */
GameLevel.prototype.generateChunk = function (){
  // TODO 
}
