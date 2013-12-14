CS 425 Final Project
====================

Stepping Stone
--------------
Members: 
Jonathan Haslow-Hall
James Dressel

**Project description**

In this game your objective is to not fall off the left side of the screen. This project was made for CS 425 as the final project for the class. 

[Play latest version here.](http://www.divided-games.com/CS425/index.html)
[View Highscore Data](http://www.divided-games.com/CS425/php/highscore.php)

**File Descriptions**

* Game.js ::
This is the main file for the game. It handles all of the I/O and also the game loop. 
* Blocks.js ::
Holds the basic structure for each block Also Handles drawing for each block. 
* Level.js ::
This is the main gameplay file. Level contains the level structure and all the objects needed to play a game. Level also will call all the update and draw functions for all of the other objects in the game. 
* Player.js ::
Contains the player objects and all code needed to make the player work. 
* three.js ::
Necessary 3D library for the project. 
* IO.js ::
I/O File for the game. Handles keyboard and mouse. 
* Hud.js ::
Does 2D screen drawing for the game. 
* Debug.js ::
Adds some debugging features to make showing the game in class easier. 
* Sound.js ::
Controls sound for the game. 

**Controls**

AWSD  : Move the player

Q & E : Rotate the camera 

R     : Restart game 

P     : Pause game

**Notes**

Currently using 2 spaces for each tab, if this is a problem we an switch to 4 spaces per tab. 


**Sounds**

* [Slime Splash Sound](http://soundbible.com/1097-Slime-Splash.html) by Mike Koenig
* [Laser Cannon Sound](http://soundbible.com/1771-Laser-Cannon.html) by Mike Koenig
* [Computer Error Sound](http://soundbible.com/172-Computer-Error.html) by Mike Koenig

**Project Technical Information**

Procedural Generation:  
Terrain is generated on a chunk basic. Each chunk is n blocks long and m blocks high. The first thing that happens is the terrain is generated. After this we cut paths through the terrain so that the player will allways have a possible route. The the generated terrain is process and converted into different types of blocks based on its location in the level. And finaly the grid of blocks in converted into level blocks that are then added to the levels block list. 

Points of Intrest:  
Level.js, line 309, method generateChunk : Used to generate a block chunk  
Level.js, line 411, method makeCorrectPath : Use to cute a path through the terrain

A* Motion Planning:


Sound Design:


