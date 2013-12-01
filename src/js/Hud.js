/**
 * NOTE: 0,0 is in the bottom left corner for this camera. 
 * Positive x is right and positive y is up 
 **/

/** Structure to hold hud data **/
function Hud(){
  this.camera;      // Camera to draw all hud elements 
  this.scene;
  
  /** Tutorial **/
  this.show_tut = false; 
  this.tutTime = 14;      // Time to show tut at beginning of game 
  this.tutFadePerSec = 2.5; // Time to fade out tutorial 
  this.tutSprite;         // Use to edit sprite values 
  
  this.pauseSprite;       // Used to draw paused text to screen
  this.gameoverSprite;    // Gameover text to draw 
  this.mouseSprite;
  
  this.draw_warning = false;
  this.warningSprite;
}

/** Initialize hud **/
Hud.prototype.init = function(w, h){
  // Setup Camera 
  this.camera = new THREE.OrthographicCamera( 0, w, h, 0, -1, 1);  
  this.scene = new THREE.Scene();
  
  /** Set up tut **/
  var texture = THREE.ImageUtils.loadTexture( 'res/tut.png' );
	var material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  material.transparent = true;
	this.tutSprite  = new THREE.Sprite( material );
	this.tutSprite.position.set( 170, h - 130, 0 );
	this.tutSprite.scale.set( 319, 234, 1.0 );
	this.scene.add( this.tutSprite  );
  
  /** Set up pause **/
  texture = THREE.ImageUtils.loadTexture( 'res/paused.png' );
	material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  material.transparent = true;
	this.pauseSprite  = new THREE.Sprite( material );
	this.pauseSprite.position.set( w/2, h/2, 0 );
	this.pauseSprite.scale.set( 300, 100, 1.0 );
	this.scene.add( this.pauseSprite  );
  
  /** Setup gameover */
  texture = THREE.ImageUtils.loadTexture( 'res/gameover.png' );
	material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  material.transparent = true;
  material.opacity = 0;
	this.gameoverSprite  = new THREE.Sprite( material );
	this.gameoverSprite.position.set( w/2, h/2, 0 );
	this.gameoverSprite.scale.set( 400, 150, 1.0 );
	this.scene.add( this.gameoverSprite  );
  
  /** Setup warning */
  texture = THREE.ImageUtils.loadTexture( 'res/warn.png' );
	material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  material.transparent = true;
  material.opacity = 1;
	this.warningSprite  = new THREE.Sprite( material );
	this.warningSprite.position.set( w/2, h/2, 0 );
	this.warningSprite.scale.set( 150, 75, 1.0 );
	this.scene.add( this.warningSprite  );
  
  /** Mouse warning */
  texture = THREE.ImageUtils.loadTexture( 'res/mouseDown.png' );
	material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  material.transparent = true;
  material.opacity = 0;
	this.mouseSprite  = new THREE.Sprite( material );
	this.mouseSprite.position.set( w/2, h/2, 0 );
	this.mouseSprite.scale.set( 200, 200, 1.0 );
	this.scene.add( this.mouseSprite  );
}

/** Update hud state **/
Hud.prototype.update = function(){
  // Decrement tut time 
  if (this.tutTime != 0){
    this.tutTime -= time_step;
    if (this.tutTime < 0){
      this.tutTime = 0;
    }
  }
  
  // Show tut if paused
  if (level.paused){
    this.show_tut = true;
    this.pauseSprite.material.opacity = 1;
  }
  else {
    this.show_tut = false;
    this.pauseSprite.material.opacity = 0;
  }
  
  // Show gameover text
  if (level.gameover)
    this.gameoverSprite.material.opacity = 1;
  else
    this.gameoverSprite.material.opacity = 0;
  
  // Fade tut if not shown 
  if (this.show_tut || this.tutTime > 0)
    this.tutSprite.material.opacity = 1;
  else if (this.tutSprite.material.opacity != 0){
    this.tutSprite.material.opacity -= this.tutFadePerSec * time_step;
    if (this.tutSprite.material.opacity < 0)
      this.tutSprite.material.opacity = 0;
  }
  
  // Find out if warning should be drawn
  if (level.player.nx < level.level_left() + 200 && !level.gameover)
    this.warningSprite.material.opacity = 1;
  else 
    this.warningSprite.material.opacity = 0;
    
  // Update Mouse Display 
  if (mouse.left_down){
    this.mouseSprite.position.set( mouse.down_x, HEIGHT - mouse.down_y, 0 );
    this.mouseSprite.material.opacity = 1;
  }
  else
    this.mouseSprite.material.opacity = 0; 
}

/** Draw hud **/
Hud.prototype.draw = function(renderer){
  renderer.render(this.scene, this.camera);
}