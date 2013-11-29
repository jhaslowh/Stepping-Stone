"use strict";

// Input 
var keyboard = {};
var keyboard_old = {};
var mouse = {x:0, y:0};

// Game variables 
var gameState = "playing";
var level = new GameLevel();
var time_step = .016;
var WIDTH = 0, HEIGHT = 0;

// Three.js variables 
var renderer;

// Beginning initialization 
function init(){
  initIO();
  
  // Window size 
  WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
  //var WIDTH = 800, HEIGHT = 600;
        
  // Set up level 
  level.init(WIDTH,HEIGHT);

  /** Setup renderer */
  // Create Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  // Set the background color of the scene.
  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  // Shadows (dont know what all the values do yet)
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.physicallyBasedShading = true;
  renderer.shadowMapEnabled = true;
  renderer.shadowMapCullFace = THREE.CullFaceBack;
  
  document.body.appendChild(renderer.domElement);
  
  var stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild( stats.domElement );
  setInterval( function () {
    stats.update();
  }, 1000 / 60 );
}

// Main Game loop 
function gameLoop() 
{
  // Check for restart 
  if (keyboard[KEY_R]){
    level = new GameLevel();
    level.init(WIDTH,HEIGHT);
  }
  
  // Update
  level.update();
  updateKeyboardButtons();
  
  // Render
  level.draw(renderer);
}

// Play a sound file 
function playSound(file) 
{
  //var sound = document.createElement("audio");
  //sound.setAttribute("src", "sounds/" + file + ".mp3");
  //sound.play();
}

//-----------------------------------------------------------------------------
//start the Game here
//-----------------------------------------------------------------------------

init();

//enter game loop
setInterval(gameLoop, 1000 / 100);


