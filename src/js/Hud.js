/** Structure to hold hud data **/
function Hud(){
  this.camera;      // Camera to draw all hud elements 
  
  /** Tutorial **/
  this.show_tut = false; 
  this.tutTime = 14;      // Time to show tut at beginning of game 
  this.tutFadePerSec = 2.5; // Time to fade out tutorial 
  this.tut;               // Tutorial for game 
  this.tutSprite;         // Use to edit sprite values 
}

/** Initialize hud **/
Hud.prototype.init = function(w, h){
  // Setup Camera 
  this.camera = new THREE.OrthographicCamera( 0, w, h, 0, -1, 1);  
  
  /** Set up tut **/
  var texture = THREE.ImageUtils.loadTexture( 'res/tut.png' );
	var material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  material.transparent = true;
	var sprite = new THREE.Sprite( material );
	sprite.position.set( 170, h - 130, 0 );
	sprite.scale.set( 319, 234, 1.0 );
  this.tutSprite = sprite;
  this.tut = new THREE.Scene();
	this.tut.add( sprite );
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
  if (level.paused)this.show_tut = true;
  else this.show_tut = false;
  
  // Fade tut if not shown 
  if (this.show_tut || this.tutTime > 0)
    this.tutSprite.material.opacity = 1;
  else if (this.tutSprite.material.opacity != 0){
    this.tutSprite.material.opacity -= this.tutFadePerSec * time_step;
    if (this.tutSprite.material.opacity < 0)
      this.tutSprite.material.opacity = 0;
  }
}

/** Draw hud **/
Hud.prototype.draw = function(renderer){
  // Draw Tutorial
  renderer.render(this.tut, this.camera);
}