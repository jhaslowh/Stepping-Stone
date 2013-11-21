"use strict";

// Input 
var keyboard = {};
var mouse = {x:0, y:0};

// Game variables 
var gameState = "playing";
var level = new GameLevel();

// Three.js variables 
var renderer;

// Beginning initialization 
function init(){
  //listen to keyboard events
  addKeyboardEvents();
  addMouseEvents();

  //load assets
  loadResources();
  
  // Window size 
  //var WIDTH = window.innerWidth,
  //      HEIGHT = window.innerHeight;
  var WIDTH = 800,
        HEIGHT = 600;
        
  // Set up level 
  level.init(WIDTH,HEIGHT);

  /** Setup renderer */
  // Create Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  // Set the background color of the scene.
  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  document.body.appendChild(renderer.domElement);
}

// Main Game loop 
function gameLoop() 
{
  // Update
  level.update();
  
  // Render
  level.draw(renderer);
}

function addEvent(node, name, func) 
{
  if(node.addEventListener) {
    node.addEventListener(name, func, false);
  } else if(node.attachEvent) {
    node.attachEvent(name, func);
  }
}

function addMouseEvents()
{
  // TODO this is broken and needs to be fixed 
    /*addEvent(document, "mousedown", function(e){
        mouse = {
			x:(e.clientX-renderer.getBoundingClientRect().left), 
			y:(e.clientY-renderer.getBoundingClientRect().top)};
    });*/
}

function addKeyboardEvents() 
{
  addEvent(document, "keydown", function(e) 
  {
    keyboard[e.keyCode] = true;
  });

  addEvent(document, "keyup", function(e) 
  {
    keyboard[e.keyCode] = false;
  });

}

// Play a sound file 
function playSound(file) 
{
  //var sound = document.createElement("audio");
  //sound.setAttribute("src", "sounds/" + file + ".mp3");
  //sound.play();
}

// Load out resources 
function loadResources() 
{
  /*gun_image = new Image();
  gun_image.src = 'images/gun.png';
  
  baby_sound = document.createElement("audio");
  document.body.appendChild(baby_sound);
  baby_sound.setAttribute("src", "sounds/baby.mp3");*/

}

//-----------------------------------------------------------------------------
//start the Game here
//-----------------------------------------------------------------------------

init();

//enter game loop
setInterval(gameLoop, 1000 / 100);


