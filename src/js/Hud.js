/** Structure to hold hud data **/
function Hud(){
  this.camera;      // Camera to draw all hud elements 
  this.scene;
  
  /** Tutorial **/
  this.show_tut = false; 
  this.tutFadePerSec = 3; // Time to fade out tutorial 
  this.tutSprite;         // Use to edit sprite values 
  
  this.pauseSprite;       // Used to draw paused text to screen
  this.gameoverSprite;    // Gameover text to draw 
  
  this.draw_warning = false;
  this.warningSprite;
  
  this.shieldBar;
  this.shieldOutline;

  this.fuelBar;
  this.fuelOutline;

  /** Sounds **/
  this.soundOnSprite;
  this.soundOffSprite;

  /** Level Score **/
  this.levelScoreLoc = {x: 0, y: 0};
  this.levelScoreSize = 25;
}

/** Update hud state **/
Hud.prototype.update = function(){
  // Show tut if paused
  if (level.paused)
    this.show_tut = true;
  else 
    this.show_tut = false;

  
  // Show gameover text
  if (level.gameover)
    this.gameoverSprite.material.opacity = 1;
  else
    this.gameoverSprite.material.opacity = 0;
  
  // Fade tut if not shown 
  if (this.show_tut)
    this.tutSprite.material.opacity = 1;
  else if (this.tutSprite.material.opacity != 0){
    this.tutSprite.material.opacity -= this.tutFadePerSec * time_step;
    if (this.tutSprite.material.opacity < 0)
      this.tutSprite.material.opacity = 0;
  }
  this.pauseSprite.material.opacity = this.tutSprite.material.opacity;
  
  // Find out if warning should be drawn
  if (level.player.nx < level.level_left() + 200 && !level.gameover)
    this.warningSprite.material.opacity = 1;
  else 
    this.warningSprite.material.opacity = 0;
    
  // Update shield state 
	this.shieldBar.scale.set( (level.player.shieldCurrentRecharge / level.player.shieldRecharge) , 1.0, 1.0 );

  // Update fuel state 
  this.fuelBar.scale.set((level.player.fuelCurrent / level.player.fuelMax), 1.0, 1.0);

  // Update Sound buttons 
  // Check if clicked
  if (mouse.x >= 0 && mouse.x <= 52 && mouse.y >= 0 && mouse.y <= 52 
    && mouse.left_down && !mouse.left_down_old) PLAY_SOUNDS = !PLAY_SOUNDS;
  // Set displays 
  if (PLAY_SOUNDS){
    this.soundOnSprite.material.opacity = 1;
    this.soundOffSprite.material.opacity = 0;
  }else{
    this.soundOnSprite.material.opacity = 0;
    this.soundOffSprite.material.opacity = 1;
  }
}

/** Draw hud **/
Hud.prototype.draw = function(renderer){
  renderer.render(this.scene, this.camera);

  // Draw level score to screen 
  var s = ""+Math.round(level.score);
  var len = this.measureNumString(s,this.levelScoreSize);
  this.drawText(
    this.levelScoreLoc.x-(len/2),
    this.levelScoreLoc.y,
    this.levelScoreSize,s);
}

/** Make a sprite **/
function makeSprite(width, height, texPath){
  // Load the texture file 
  var texture = null;
  if (texPath != null) texture = THREE.ImageUtils.loadTexture(texPath);
  // Make a new basic material and give it the texture 
  var mat = new THREE.MeshBasicMaterial({map:texture});
  // Must set this to true or the texture will not draw correctly if there is alpha 
  mat.transparent = true;
  // Make a new blank geometry 
  var geom = new THREE.Geometry(); 
  
  // Add verticies to the geometry 
  geom.vertices.push(new THREE.Vector3(0,0,0));
  geom.vertices.push(new THREE.Vector3(0,height,0));
  geom.vertices.push(new THREE.Vector3(width,height,0));
  geom.vertices.push(new THREE.Vector3(width,0,0));
  
  // Set the geometry faces 
  geom.faces.push(new THREE.Face3(0,1,2));
  geom.faces.push(new THREE.Face3(2,3,0));

  // Set the UV's for the faces 
  if (texture != null){
    geom.faceVertexUvs[0].push([
      new THREE.Vector2(0,1),
      new THREE.Vector2(0,0),
      new THREE.Vector2(1,0)]);
    geom.faceVertexUvs[0].push([
      new THREE.Vector2(1,0),
      new THREE.Vector2(1,1),
      new THREE.Vector2(0,1)]);
    geom.faces[0].normal.set(0,0,1); 
  }

  // Make the mesh 
  return new THREE.Mesh(geom, mat);
}

/*==========================================*/
/**           Text Renderer                 */
/*==========================================*/

// Scenes for each number 
var textScenes = [];
// Length of each text 
var textLengths = [];
// Standard text scale
var textScale = 100;

/** Draw text to the screen **/
Hud.prototype.drawText = function(x, y, size, text){
  // Scale to draw text at 
  var scale = size/textScale;
  // Current text offset 
  var offsetx = 0;
  var offsety = 0;

  // Draw text to screen
  for (var i = 0; i < text.length; i++){
    // Get number 
    var index = intFromChar(text.charAt(i));
    // Set position
    textScenes[index].children[0].position.set(x + offsetx, y + offsety, 0);
    // Set size
    textScenes[index].children[0].scale.set(
      textScenes[index].children[0].scale.x * scale, 
      textScenes[index].children[0].scale.y * scale,
      textScenes[index].children[0].scale.z * scale);
    // Set offset for next number 
    offsetx += textLengths[index] * (size/textScale);
    // Draw number 
    renderer.render(textScenes[index], this.camera);
    // Fix size
    textScenes[index].children[0].scale.set(
      textScenes[index].children[0].scale.x / scale, 
      textScenes[index].children[0].scale.y / scale,
      textScenes[index].children[0].scale.z / scale);
  }
}

/** Measure a number string.
 * Usefull when automatically positioning text **/
Hud.prototype.measureNumString = function(s,size){
  // Current length 
  var len = 0;
  
  for (var i = 0; i < s.length; i++)
    len += textLengths[s.charAt(i)];
  
  return len * (size/textScale);
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
  this.camera = new THREE.OrthographicCamera( 0, w, 0, h, 1, -1);  
  this.scene = new THREE.Scene();

  // Set level score location 
  this.levelScoreLoc = {x: w/2, y: 50};
  
  /** Setup gameover */
  this.gameoverSprite = makeSprite(400, 150,'res/gameover.png' );
  this.gameoverSprite.position.set( (w/2)-200, (h/2)-75, 0 );
  this.gameoverSprite.material.opacity = 0;
  this.scene.add( this.gameoverSprite  );
  
  /** Setup warning */
  this.warningSprite = makeSprite(150, 75,'res/warn.png'  );
  this.warningSprite.position.set( (w/2)-75, (h/2)-37.5, 0 );
  this.warningSprite.material.opacity = 0;
  this.scene.add( this.warningSprite  );
  
  /** Shield **/
  this.shieldBar = makeSprite(100,20, 'res/hud_shield_bar.png' );
  this.shieldBar.position.set( (w/2) - 120, 20, 0 );
  this.shieldBar.material.color.setHex(0xFF0000);
  this.scene.add( this.shieldBar  );
  
  this.shieldOutline = makeSprite(120,40, 'res/hud_shield_outline.png' );
  this.shieldOutline.position.set( (w/2) - 130, 10, 0 );
  this.scene.add( this.shieldOutline  );

  /** Fuel **/
  this.fuelBar = makeSprite(100,20, 'res/hud_shield_bar.png' );
  this.fuelBar.position.set( (w/2) + 20, 20, 0 );
  this.fuelBar.material.color.setHex(0x0000FF);
  this.scene.add( this.fuelBar  );
  
  this.fuelOutline = makeSprite(120,40, 'res/hud_shield_outline.png' );
  this.fuelOutline.position.set( (w/2) + 10, 10, 0 );
  this.scene.add( this.fuelOutline  );

  /** Sound Toggle **/
  this.soundOnSprite = makeSprite(52,52, 'res/sound_on.png' );
  this.scene.add( this.soundOnSprite  );

  this.soundOffSprite = makeSprite(52,52, 'res/sound_off.png' );
  this.scene.add( this.soundOffSprite  );

  /** Set up tut **/
  this.tutSprite = makeSprite(500,400,'res/tutorial.png');
  this.tutSprite.position.set((w/2)-250,(h/2)-200,0);
  this.scene.add( this.tutSprite  );
  
  /** Set up pause **/
  this.pauseSprite = makeSprite(300,100,'res/paused.png');
  this.pauseSprite.position.set( (w/2)-150, (h/2) - 268, 0 );
  this.scene.add( this.pauseSprite  );

  this.initText();
}

/** initialize the text **/
Hud.prototype.initText = function(){
  // Setup text sizes 
  textLengths[0] = 70;
  textLengths[1] = 67;
  textLengths[2] = 75;
  textLengths[3] = 80;
  textLengths[4] = 79;
  textLengths[5] = 75;
  textLengths[6] = 77;
  textLengths[7] = 75;
  textLengths[8] = 80;
  textLengths[9] = 80;

  // Make text scenes
  for (var i = 0; i < 10; i++) textScenes[i] = new THREE.Scene();

  // Number 0
  var sprite = makeSprite(76,103,'res/nums/num0.png' );
  textScenes[0].add(sprite);
  // Number 1
  sprite = makeSprite(47,100,'res/nums/num1.png' );
  textScenes[1].add(sprite);
  // Number 2
  sprite = makeSprite(71,101,'res/nums/num2.png' );
  textScenes[2].add(sprite);
  // Number 3
  sprite = makeSprite(71,102,'res/nums/num3.png' );
  textScenes[3].add(sprite);
  // Number 4
  sprite = makeSprite(79,101,'res/nums/num4.png' );
  textScenes[4].add(sprite);
  // Number 5
  sprite = makeSprite(76,101,'res/nums/num5.png' );
  textScenes[5].add(sprite);
  // Number 6
  sprite = makeSprite(77,103,'res/nums/num6.png' );
  textScenes[6].add(sprite);
  // Number 7
  sprite = makeSprite(76,100,'res/nums/num7.png' );
  textScenes[7].add(sprite);
  // Number 8
  sprite = makeSprite(76,103,'res/nums/num8.png' );
  textScenes[8].add(sprite);
  // Number 9
  sprite = makeSprite(76,103,'res/nums/num9.png' );
  textScenes[9].add(sprite);
}