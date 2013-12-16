/** Controls
 * ~ = Turn on/off
 * 1 = Turn on bump cube 
 * 2 = Lock Player 
 * 3 = Show Correct Paths 
 * 4 = Enable/Disable ceiling climbing
 **/

/** Debug structure **/
function Debug(){
  this.on = false;        // Turn on and off debug mode 
  
  // States 
  this.showBumpCube = false; // Show a bump map cube 
  this.lockPlayer = false;   // Lock player to center of screen, possibly will glitch player
  
  // Sprites 
  this.bumpCube;
  this.debugMenu;
  // Scenes
  this.onLight;
  this.offLight;

  // Light positions 
  this.lightLoc = [];
}

/** Set up debug method **/
Debug.prototype.init = function(){
  // Make bump cube 
  var mapHeight = THREE.ImageUtils.loadTexture( 'res/guy.png' );
  mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
  mapHeight.format = THREE.RGBFormat;
  material = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0x737980, specular: 0x333333, shininess: 0, bumpMap: mapHeight, bumpScale: 20, metal: true });
  var cube = new THREE.CubeGeometry( 250,250,250); 
  this.bumpCube = new THREE.Mesh(cube, material);
  this.bumpCube.position.x = WIDTH/2;
  this.bumpCube.position.y = HEIGHT/2;
  this.bumpCube.castShadow = true;
  this.bumpCube.receiveShadow = true;
  
  // Make debug menu
  var texture = THREE.ImageUtils.loadTexture( 'res/DebugMenu.png' );
	var material = new THREE.SpriteMaterial( { map: texture} );
  material.transparent = true;
	this.debugMenu  = new THREE.Sprite( material );
	this.debugMenu.position.set( WIDTH - 138, HEIGHT - 138, 0 );
	this.debugMenu.scale.set( 265, 265, 1.0 );

  // Load Debug menu lights 
  texture = THREE.ImageUtils.loadTexture( 'res/debug_light.png' );
  material = new THREE.SpriteMaterial( { map: texture, color:0xFF0000} );
  var sprite  = new THREE.Sprite( material );
  sprite.scale.set( 14, 14, 1.0 );
  this.offLight = new THREE.Scene();
  this.offLight.add(sprite);

  material = new THREE.SpriteMaterial( { map: texture, color:0x00FF00} );
  var sprite  = new THREE.Sprite( material );
  sprite.scale.set( 14, 14, 1.0 );
  this.onLight = new THREE.Scene();
  this.onLight.add(sprite);

  // Fix locations
  this.lightLoc[0] = {x:WIDTH-266+10,y:HEIGHT-56};
  this.lightLoc[1] = {x:WIDTH-266+10,y:HEIGHT-73};
  this.lightLoc[2] = {x:WIDTH-266+10,y:HEIGHT-90};
  this.lightLoc[3] = {x:WIDTH-266+10,y:HEIGHT-126};
  this.lightLoc[4] = {x:WIDTH-266+10,y:HEIGHT-143};
}

/** Update Debug controls **/
Debug.prototype.update = function(){
  if (this.on){
    // Fix cube location 
    this.bumpCube.position.x = level.level_loc.x;
    this.bumpCube.position.y = level.level_loc.y;
    this.bumpCube.rotation.x += .01;
    this.bumpCube.rotation.y += .01;
    
    // Lock player if true
    if (this.lockPlayer){
      level.player.mesh.position.x = level.level_loc.x;
      level.player.mesh.position.y = level.level_loc.y;
    }
  
    /** Update Controls **/
    // Show hide bump cube 
    if (keyPressed(KEY_1)){
      if (!this.showBumpCube){
        level.scene.add(this.bumpCube);
        this.showBumpCube = true;
      }
      else {
        level.scene.remove(this.bumpCube);
        this.showBumpCube = false;
      }
    }
    // Turn on off player locking 
    if (keyPressed(KEY_2))
      this.lockPlayer = !this.lockPlayer;
    // Turn on off correct path 
    if (keyPressed(KEY_3))
      level.draw_correct_path = !level.draw_correct_path;
    // Turn on/off wall climbing 
    if (keyPressed(KEY_4))
      level.player.allow_roof_climbing = !level.player.allow_roof_climbing;
    // Toggle Pathfinding line 
    if (keyPressed(KEY_5))
      DRAW_PATHFINDING = !DRAW_PATHFINDING;
    
    // Turn off debug mode 
    if (keyPressed(KEY_TILDE)){
      this.on = false;
      this.turnOff();
      hud.scene.remove(this.debugMenu);
    }
  }
  else {
    // Turn on debug mode 
    if (keyPressed(KEY_TILDE)){
      this.on = true;
      hud.scene.add(this.debugMenu);
    }
  }
}

/** Draw Debug info **/
Debug.prototype.draw = function(){
  if (this.on){
    // Draw Debug Menu Item 1
    if (this.showBumpCube){
      this.onLight.children[0].position.set(this.lightLoc[0].x,this.lightLoc[0].y,0);
      renderer.render(this.onLight, hud.camera);
    }else {
      this.offLight.children[0].position.set(this.lightLoc[0].x,this.lightLoc[0].y,0);
      renderer.render(this.offLight, hud.camera);
    }

    // Draw Debug Menu Item 2
    if (this.lockPlayer){
      this.onLight.children[0].position.set(this.lightLoc[1].x,this.lightLoc[1].y,0);
      renderer.render(this.onLight, hud.camera);
    }else {
      this.offLight.children[0].position.set(this.lightLoc[1].x,this.lightLoc[1].y,0);
      renderer.render(this.offLight, hud.camera);
    }

    // Draw Debug Menu Item 3
    if (level.draw_correct_path){
      this.onLight.children[0].position.set(this.lightLoc[2].x,this.lightLoc[2].y,0);
      renderer.render(this.onLight, hud.camera);
    }else {
      this.offLight.children[0].position.set(this.lightLoc[2].x,this.lightLoc[2].y,0);
      renderer.render(this.offLight, hud.camera);
    }

    // Draw Debug Menu Item 4
    if (level.player.allow_roof_climbing){
      this.onLight.children[0].position.set(this.lightLoc[3].x,this.lightLoc[3].y,0);
      renderer.render(this.onLight, hud.camera);
    }else {
      this.offLight.children[0].position.set(this.lightLoc[3].x,this.lightLoc[3].y,0);
      renderer.render(this.offLight, hud.camera);
    }

    // Draw Debug Menu Item 5
    if (DRAW_PATHFINDING){
      this.onLight.children[0].position.set(this.lightLoc[4].x,this.lightLoc[4].y,0);
      renderer.render(this.onLight, hud.camera);
    }else {
      this.offLight.children[0].position.set(this.lightLoc[4].x,this.lightLoc[4].y,0);
      renderer.render(this.offLight, hud.camera);
    }
  }
}

/** Turn off debug mode **/
Debug.prototype.turnOff = function(){
  // Turn off bump cube 
  if (this.showBumpCube){
    level.scene.remove(this.bumpCube);
    this.showBumpCube = false;
  }
  
  // Disable path 
  level.draw_correct_path = false;
}