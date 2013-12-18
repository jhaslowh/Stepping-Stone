var GRAVITY = 1400;
var SINK_SPEED = 40;

/** Player Structure */
function Player(){ 
  // Location of player 
  this.nx = 0;
  this.ny = 0;
  this.w = 48;
  this.h = 24;
  this.speed = 450;
  this.mesh;
  
  /** Shield **/
  this.meshShield;
  // How long the shield is currently on for. Set to (shield time to set)
  this.shieldCurrentTime = 0;   
  // Time shield will stay on for
  this.shieldTime = 2;      
  // Current recharge time of the shield, if == to sheild recharge, then player can use shield   
  this.shieldCurrentRecharge = 10;
  // Time until shield can be used again
  this.shieldRecharge = 10; 

  /** Fuel **/
  this.fuelCurrent = 100;
  this.fuelMax = 100;     // Fuel capacity 
  this.fuelFillRate = 50; // Fuel to fill per second 
  this.fuelLossRate = 6; // Fuel lost per second if not filling      
  
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
  this.allow_roof_climbing = true;
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
  this.mesh.position.x = level.level_width/2; 
  this.mesh.position.y = -100; 
  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;
  level.scene.add(this.mesh);
  
  /** Make shield **/
  var circle = new THREE.SphereGeometry(30, 25, 25);
  var texture = THREE.ImageUtils.loadTexture( 'res/shield.png' );
  texture.format = THREE.RGBFormat;
  material = new THREE.MeshPhongMaterial({color: 0xffffff,map:texture});
  material.opacity = 0;
  material.transparent = true;
  this.meshShield = new THREE.Mesh(circle, material);
  level.scene.add(this.meshShield);
  this.meshShield.position.z = 1;
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
        this.nx += this.speed * time_step;
      if (keyboard[KEY_A])
        this.nx -= this.speed * time_step;
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

      // Update fuel for not in water 
      if (this.fuelCurrent > 0){
        this.fuelCurrent -= this.fuelLossRate * time_step;
        if (this.fuelCurrent < 0) this.fuelCurrent = 0;
      }
    }
    // If player is below the water 
    else if (this.ny > level.water_level- (this.h/2) ){
      this.in_water = true;
      
      // Update controls 
      if (keyboard[KEY_D])
        this.nx += this.speed * time_step;
      if (keyboard[KEY_A])
        this.nx -= this.speed * time_step;
      if (keyboard[KEY_S])
        this.ny += this.speed * time_step;
      if (keyboard[KEY_W])
        this.ny -= this.speed * time_step;
        
      // Water gravity 
      this.ny += SINK_SPEED * time_step;


      // Update fuel for in water 
      if (this.fuelCurrent < this.fuelMax){
        this.fuelCurrent += this.fuelFillRate * time_step;
        if (this.fuelCurrent > this.fuelMax) this.fuelCurrent = this.fuelMax;
      }
    }
      
    /** Check collision */
    this.checkCollision(level);
    
    /** Collision Response */
    this.collisionResponse();
    
    /** Update Shield **/
    this.meshShield.rotation.z += .01;
    this.meshShield.rotation.x += .01;
    

    // Check to see if player is trying to turn on shield 
    if (keyboard[KEY_SPACE] && this.shieldCurrentRecharge == this.shieldRecharge){
      this.shieldCurrentRecharge = 0;
      this.shieldCurrentTime = this.shieldTime;
      shield_up_sound.play();
      
    }

    // Play a sound if the player tries to use the shiled before it is recharged
    if ((keyboard[KEY_SPACE] && this.shieldCurrentRecharge < this.shieldRecharge)&&(this.shieldCurrentTime==0)){
      if(shield_cooldown_sound.currentTime>0.3){
        //let the sound play a bit before restarting it
        shield_cooldown_sound.currentTime = 0;
      }
      shield_cooldown_sound.play();
    }
    
    // Update shield state 
    if (this.shieldCurrentTime != 0){
      this.shieldCurrentTime -= time_step;
      if (this.shieldCurrentTime < 0){
        this.shieldCurrentTime = 0;
        shield_down_sound.play();
      }
    }
    else if (this.shieldCurrentRecharge != this.shieldRecharge){
      this.shieldCurrentRecharge += time_step;
      if (this.shieldCurrentRecharge > this.shieldRecharge)
        this.shieldCurrentRecharge = this.shieldRecharge;
    }
    
    // Check if shield is on 
    if (this.shieldCurrentTime != 0) this.meshShield.material.opacity = .5;
    else this.meshShield.material.opacity = 0;
  }
}

/** Check player collision with other obstacles */
Player.prototype.checkCollision = function(level){
  // Reset our checks 
  this.pass_x = true;
  this.pass_y = true;
  
  // Level collision
  if (this.ny + this.h > level.level_bottom()){
    this.mesh.position.y = level.level_bottom() - this.h;
    this.pass_y = false;
  }
  /*else if (this.ny < level.level_top()){
    //this.mesh.position.y = level.level_top();
    this.pass_y = false;
  }*/
  if (this.nx > level.level_right())
    this.pass_x = false;
  
  // Check if the player was above water and lands in it
  if (this.in_water == false && this.ny > level.water_level - (this.h/2)){
    this.hitWater();
  }
  
  // Block collision checks
  for (var i = 0; i < level.blocks.length; i++){
    // Make sure block is alive and not null
    if (level.blocks[i].active && level.blocks[i].collides){
      // x axis collision check 
      if (this.checkBlockX(level.blocks[i]) && this.pass_x){
        // Small collision response 
        if (level.blocks[i].x < this.nx)
          this.mesh.position.x = level.blocks[i].x + level.blocks[i].width + .5;
        else if (level.blocks[i].x > this.nx)
          this.mesh.position.x = level.blocks[i].x - this.w - .5;
        // Set collision flag 
        this.pass_x = false;
        
        level.blocks[i].collide();
      }
      
      // y axis collision check 
      if (this.checkBlockY(level.blocks[i]) && this.pass_y){
        // Small collision response 
        if (level.blocks[i].y < this.ny){
          this.hitCeiling();
          this.mesh.position.y = level.blocks[i].y + level.blocks[i].height + .5;
        }
        else if (level.blocks[i].y > this.ny){
          this.hitGround();
          this.mesh.position.y = level.blocks[i].y - this.h - .5;
        }
        
        // Set collision flag 
        this.pass_y = false;
        
        level.blocks[i].collide();
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
    
  // Air check 
  if (this.air_t > this.minAirtForInAir)
    this.inAir = true;
    
  /** Do death checks **/
  // Check if off screen
  if (this.mesh.position.x + this.w < level.level_left())
    this.kill();
  // Check if out of fuel 
  if (this.fuelCurrent <= 0)
    this.kill();
  
  // Fix shield location 
  this.meshShield.position.x = this.mesh.position.x + 24;
  this.meshShield.position.y = this.mesh.position.y + 12;
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

/** Call when the player hits the ceiling **/
Player.prototype.hitCeiling = function(){
  this.air_t = 0;
  this.yo = this.mesh.position.y;
  // If inAir is set false here, player will be able to roof climb. 
  // if it is true, they will not. 
  this.inAir = !this.allow_roof_climbing; 
  this.jumping = false;
}

/** Called when player hits the surface of water **/
Player.prototype.hitWater = function(){
  // Play splash sound 
  if (PLAY_SOUNDS){
    splash_sound.volume = this.air_t; // Volume depends on how long the player falls. Volume maxes when air_t is =>1
    splash_sound.currentTime = 0;
    splash_sound.play();
  }
  this.hitGround();
}

/** Call to try and kill the player **/
Player.prototype.tryKill = function(){
  if (this.shieldCurrentTime <= 0) this.kill();
}

/** Call to kill player **/
Player.prototype.kill = function(){
  this.alive = false;
  level.gameover = true;
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