/** Holds an entire grid of blocks */
function Chunk(){
  this.path_mesh = 0;   
  this.rock_mesh = 0;   
  this.sand_mesh = 0;   
  this.underWaterRock_mesh = 0;   
  this.dirt_mesh = 0;
  this.grass_mesh = 0;
  this.right = 0; // Current right position of chunk 
  this.active = false; // If the chunk is being used 
}

/** Add Meshes to scene **/
Chunk.prototype.finish = function(scene){
  if (this.path_mesh != 0)scene.add(this.path_mesh);
  if (this.rock_mesh != 0)scene.add(this.rock_mesh);
  if (this.sand_mesh != 0)scene.add(this.sand_mesh);
  if (this.underWaterRock_mesh != 0)scene.add(this.underWaterRock_mesh);
  if (this.dirt_mesh != 0)scene.add(this.dirt_mesh);
  if (this.grass_mesh != 0)scene.add(this.grass_mesh);
}

/** Update the state of the chunk **/
Chunk.prototype.update = function(level){
  // Check if chunk is off screen  
  if (this.right < level.level_left() - 100){
    // remove geometry from scene 
    if (this.path_mesh != 0)scene.remove(this.path_mesh);
    if (this.rock_mesh != 0)scene.remove(this.rock_mesh);
    if (this.sand_mesh != 0)scene.remove(this.sand_mesh);
    if (this.underWaterRock_mesh != 0)scene.remove(this.underWaterRock_mesh);
    if (this.grass_mesh != 0)scene.remove(this.grass_mesh);
    if (this.dirt_mesh != 0)scene.remove(this.dirt_mesh);
      this.active = false;
  }
}