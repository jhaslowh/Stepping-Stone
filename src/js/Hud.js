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
  
  this.shieldBar;
  this.shieldOutline;

  /** Level Score **/
  this.levelScoreLoc = {x: 0, y: 0};
  this.levelScoreSize = 30;
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
    
  // Update shield state 
	this.shieldBar.scale.set( (level.player.shieldCurrentRecharge / level.player.shieldRecharge) * 100, 20, 1.0 );
}

/** Draw hud **/
Hud.prototype.draw = function(renderer){
  renderer.render(this.scene, this.camera);

  // Draw level score to screen 
  this.drawText(
    this.levelScoreLoc.x,
    this.levelScoreLoc.y,
    this.levelScoreSize,""+Math.round(level.score));
}

/*==========================================*/
/**           Text Renderer                 */
/*==========================================*/

// Scenes for each number 
var textScenes = [];
// Length of each text 
var textLengths = [];
// Standard text scale
var textScale = 200;

/** Draw text to the screen **/
Hud.prototype.drawText = function(x, y, size, text){
  // Current text offset 
  var offset = 0;
  var scale = size/textScale;

  // Draw text to screen
  for (var i = 0; i < text.length; i++){
    // Get number 
    var index = intFromChar(text.charAt(i));
    // Set position
    textScenes[index].children[0].position.set(x + offset, y, 0);
    // Set size
    textScenes[index].children[0].scale.set(
      textScenes[index].children[0].scale.x * scale, 
      textScenes[index].children[0].scale.y * scale,
      textScenes[index].children[0].scale.z * scale);
    // Set offset for next number 
    offset += textLengths[index] * (size/textScale);
    // Draw number 
    renderer.render(textScenes[index], this.camera);
    // Fix size
    textScenes[index].children[0].scale.set(
      textScenes[index].children[0].scale.x / scale, 
      textScenes[index].children[0].scale.y / scale,
      textScenes[index].children[0].scale.z / scale);
  }
}

/** Get the interger for the corrosponding character **/
function intFromChar(c){
  if (c == '0') return 0;
  else if (c == '1') return 1;
  else if (c == '2') return 2;
  else if (c == '3') return 3;
  else if (c == '4') return 4;
  else if (c == '5') return 5;
  else if (c == '6') return 6;
  else if (c == '7') return 7;
  else if (c == '8') return 8;
  else if (c == '9') return 9;
  else return 0;
}

/*==========================================*/
/**           Init Code                     */
/*==========================================*/

/** Initialize hud **/
Hud.prototype.init = function(w, h){
  // Setup Camera 
  this.camera = new THREE.OrthographicCamera( 0, w, h, 0, -1, 1);  
  this.scene = new THREE.Scene();

  // Set level score location 
  this.levelScoreLoc = {x: w/2, y: h - 70};
  
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
  
  /** Shield **/
  texture = THREE.ImageUtils.loadTexture( 'res/hud_shield_bar.png' );
  material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  this.shieldBar  = new THREE.Sprite( material );
  this.shieldBar.position.set( w/2, h - 25, 0 );
  this.shieldBar.scale.set( 100, 20, 1.0 );
  this.scene.add( this.shieldBar  );
  
  texture = THREE.ImageUtils.loadTexture( 'res/hud_shield_outline.png' );
  material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  this.shieldOutline  = new THREE.Sprite( material );
  this.shieldOutline.position.set( w/2, h - 25, 0 );
  this.shieldOutline.scale.set( 120, 40, 1.0 );
  this.scene.add( this.shieldOutline  );

  this.initText();
}

/** initialize the text **/
Hud.prototype.initText = function(){
  // Setup text sizes 
  textLengths[0] = 140;
  textLengths[1] = 134;
  textLengths[2] = 150;
  textLengths[3] = 160;
  textLengths[4] = 158;
  textLengths[5] = 150;
  textLengths[6] = 154;
  textLengths[7] = 150;
  textLengths[8] = 160;
  textLengths[9] = 160;

  // Make text scenes
  // Number 0
  var texture = THREE.ImageUtils.loadTexture( 'res/nums/num0.png' );
  var material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  var sprite = new THREE.Sprite( material );
  sprite.scale.set( 152,206, 1.0 );
  textScenes[0] = new THREE.Scene();
  textScenes[0].add(sprite);

  // Number 1
  texture = THREE.ImageUtils.loadTexture( 'res/nums/num1.png' );
  material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  sprite = new THREE.Sprite( material );
  sprite.scale.set( 94,200, 1.0 );
  textScenes[1] = new THREE.Scene();
  textScenes[1].add(sprite);

  texture = THREE.ImageUtils.loadTexture( 'res/nums/num2.png' );
  material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  sprite = new THREE.Sprite( material );
  sprite.scale.set( 144,203, 1.0 );
  textScenes[2] = new THREE.Scene();
  textScenes[2].add(sprite);

  texture = THREE.ImageUtils.loadTexture( 'res/nums/num3.png' );
  material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  sprite = new THREE.Sprite( material );
  sprite.scale.set( 143,206, 1.0 );
  textScenes[3] = new THREE.Scene();
  textScenes[3].add(sprite);

  texture = THREE.ImageUtils.loadTexture( 'res/nums/num4.png' );
  material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  sprite = new THREE.Sprite( material );
  sprite.scale.set( 158,203, 1.0 );
  textScenes[4] = new THREE.Scene();
  textScenes[4].add(sprite);

  texture = THREE.ImageUtils.loadTexture( 'res/nums/num5.png' );
  material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  sprite = new THREE.Sprite( material );
  sprite.scale.set( 143,203, 1.0 );
  textScenes[5] = new THREE.Scene();
  textScenes[5].add(sprite);

  texture = THREE.ImageUtils.loadTexture( 'res/nums/num6.png' );
  material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  sprite = new THREE.Sprite( material );
  sprite.scale.set( 154,206, 1.0 );
  textScenes[6] = new THREE.Scene();
  textScenes[6].add(sprite);

  texture = THREE.ImageUtils.loadTexture( 'res/nums/num7.png' );
  material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  sprite = new THREE.Sprite( material );
  sprite.scale.set( 143,200, 1.0 );
  textScenes[7] = new THREE.Scene();
  textScenes[7].add(sprite);

  texture = THREE.ImageUtils.loadTexture( 'res/nums/num8.png' );
  material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  sprite = new THREE.Sprite( material );
  sprite.scale.set( 152,206, 1.0 );
  textScenes[8] = new THREE.Scene();
  textScenes[8].add(sprite);

  texture = THREE.ImageUtils.loadTexture( 'res/nums/num9.png' );
  material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true} );
  sprite = new THREE.Sprite( material );
  sprite.scale.set( 152,206, 1.0 );
  textScenes[9] = new THREE.Scene();
  textScenes[9].add(sprite);
}