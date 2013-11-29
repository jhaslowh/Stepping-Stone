var GRAVITY = 980;
var SINK_SPEED = 10;

/** Player Structure */
function Player(){ 
  // Location of player 
  this.nx = 0;
  this.ny = 0;
  this.w = 48;
  this.h = 24;
  this.speed = 5;
  this.mesh;
  
  // Physics 
  this.jumpt = 0;
  this.yo = 0;
  this.air_t = 0;
  this.jumpTime = .45;
	this.minAirtForInAir = .02;
  
  // States 
  this.alive = true;
  this.jumping = false;
  this.inAir = false;
  this.pass_x = true;
  this.pass_y = true;
  this.in_water = false;
}

/** Initialize player values */
Player.prototype.init = function(level){
  // Make mesh and add it to scene
  var cube = new THREE.Geometry(); 
  var material = new THREE.MeshPhongMaterial({color: 0xff1818,shininess: 20, metal: true });
  
  // Make vertices 
  cube.vertices.push(new THREE.Vector3(0,0,12));
  cube.vertices.push(new THREE.Vector3(0,0,-12));
  cube.vertices.push(new THREE.Vector3(0,24,12));
  cube.vertices.push(new THREE.Vector3(0,24,-12));
  cube.vertices.push(new THREE.Vector3(48,12,0));
  
  // Make faces 
  cube.faces.push(new THREE.Face3(0,1,4));
  cube.faces.push(new THREE.Face3(1,3,4));
  cube.faces.push(new THREE.Face3(0,4,2));
  cube.faces.push(new THREE.Face3(3,2,4));
  cube.faces.push(new THREE.Face3(0,2,1));
  cube.faces.push(new THREE.Face3(2,3,1));
  
  this.mesh = new THREE.Mesh(cube, material);
  this.mesh.position.x = level.screen_width/2; 
  this.mesh.position.y = level.water_level; 
  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;
  level.scene.add(this.mesh);
}

/** Update player state */
Player.prototype.update = function(level){
  if (this.alive){
    /** Update Location */
    // Grab location 
    this.nx = this.mesh.position.x;
    this.ny = this.mesh.position.y;
    
    // If player is sitting on or above the water
    if (this.ny <= level.water_level- (this.h/2) ){
      this.in_water = false;
      
      // Update controls 
      if (keyboard[KEY_D])
        this.nx += this.speed;
      if (keyboard[KEY_A])
        this.nx -= this.speed;
      if (keyboard[KEY_W]){
        // See if player can jump 
        if (!this.jumping && !this.inAir){
          // Set up physics 
          this.jumpt = this.jumpTime;
          this.airt = 0;
          this.yo = this.ny;
          
          // Set states 
          this.jumping = true;
          this.inAir = true;
        }
      }
        
      // Gravity 
      if (!this.jumping){
        this.air_t += time_step;
        this.ny = this.yo + (.5 * GRAVITY * (this.air_t * this.air_t));
      }
      // If jumping 
      else {
        // This equation must be used to get a smooth jump curve
				this.ny = this.yo 							// Starting loc 
						- (.5 * GRAVITY * (this.jumpTime * this.jumpTime)) // Add max jump
						+ (.5 * GRAVITY * (this.jumpt * this.jumpt));		// Minus curve value 
				this.jumpt -= time_step;
        
        if (this.jumpt < 0){
          this.stopJump();
        }
      }
    }
    // If player is below the water 
    else if (this.ny > level.water_level- (this.h/2) ){
      this.in_water = true;
      
      // Update controls 
      if (keyboard[KEY_D])
        this.nx += this.speed;
      if (keyboard[KEY_A])
        this.nx -= this.speed;
      if (keyboard[KEY_S])
        this.ny += this.speed;
      if (keyboard[KEY_W])
        this.ny -= this.speed;
        
      // Water gravity 
      this.ny += SINK_SPEED * time_step;
    }
      
    /** Check collision */
    this.checkCollision(level);
    
    /** Collision Response */
    this.collisionResponse();
  }
}

/** Check player collision with other obstacles */
Player.prototype.checkCollision = function(level){
  // Reset our checks 
  this.pass_x = true;
  this.pass_y = true;
  
  // Level collision
  if (this.ny + this.h > level.level_bottom()){
    //this.mesh.position.y = level.level_bottom() - this.h;
    this.pass_y = false;
  }
  /*else if (this.ny < level.level_top()){
    //this.mesh.position.y = level.level_top();
    this.pass_y = false;
  }*/
  
  // Check if the player was above water and lands in it
  if (this.in_water == false && this.ny > level.water_level - (this.h/2)){
    this.hitGround();
  }
  
  // Block collision checks
  for (var i = 0; i < level.blocks.length; i++){
    // Make sure block is alive and not null
    if (level.blocks[i].active && level.blocks[i].collides){
      // x axis collision check 
      if (this.checkBlockX(level.blocks[i])){
        this.pass_x = false;
      }
      
      // y axis collision check 
      if (this.checkBlockY(level.blocks[i])){
        // Might need this
        // this.mesh.position.y = level.blocks[i].y - this.h;
        
        this.hitGround();
        this.pass_y = false;
      }
    }
  }
}

/** Collision Response code */
Player.prototype.collisionResponse = function(){
  // If locations passed, fix them 
  if (this.pass_x)
    this.mesh.position.x = this.nx;
  
  if (this.pass_y)
    this.mesh.position.y = this.ny;
    
  // Stop jump if hits wall 
  if (!this.pass_y && this.jumping)
    this.stopJump();
    
  // Air check 
  if (this.air_t > this.minAirtForInAir)
    this.inAir = true;
    
  // TODO Do death checks 
}

/** Stop player if they are jumping*/
Player.prototype.stopJump = function(){
  this.jumping = false;
  this.air_t = 0;
  this.yo = this.mesh.position.y;
}

/** Call when the player hits the ground **/
Player.prototype.hitGround = function(){
  this.air_t = 0;
  this.yo = this.mesh.position.y;
  this.inAir = false;
  this.jumping = false;
}

/** Check block collision on x axis **/
Player.prototype.checkBlockX = function(block){
  return !((block.y + block.height) < this.mesh.position.y ||
    block.y > (this.mesh.position.y + this.h) ||
    (block.x + block.width) < this.nx ||
    block.x > (this.nx + this.w));
}

/** Check block collision on y axis **/
Player.prototype.checkBlockY = function(block){
  return !((block.y + block.height) < this.ny ||
    block.y > (this.ny + this.h) ||
    (block.x + block.width) < this.mesh.position.x ||
    block.x > (this.mesh.position.x + this.w));
}

/** Check collision on both axis's */
Player.prototype.checkBlockBoth = function(block){
  return !((block.y + block.height) < this.ny ||
    block.y > (this.ny + this.h) ||
    (block.x + block.width) < this.nx ||
    block.x > (this.nx + this.w));
}