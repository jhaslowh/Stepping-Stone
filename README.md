Stepping Stone
====================

Project Description
-------------------

This project was made for CS 425 as the final project for the class.  

Members:  
Jonathan Haslow-Hall  
James Dressel  

[Play latest version here.](http://www.divided-games.com/Apps/SteppingStone/index.html)  
[View Highscore Data](http://www.divided-games.com/Apps/SteppingStone/php/highscore.php)

Game Description & How to play
------------------------------

In this game you play a triangles whos goal is to stay alive. To do this you 
must stay on screen, falling off the left side of the screen will result in 
death. Periodically a Death Cube will be created that will head in your 
direction. If this cubes hits you, you will die and lose. You can survive from
 Death Cube attacks by hitting 'Space' when the cube is about to hit you. 
Current shield charge is shown at the top of the screen as a red bad. Next to 
that you will see a blue bar. This is your current fuel. If you are above 
water, your fuel will drain. Go back into water to refill you fuel. If your fuel
 runs out, you will lose. Score is tracked based on how far you make it. As you 
play the game, the camera will start to move faster. You can pick up yellow time
 cubes to slow it down. 

You use WASD to move the player around. If you are underwater you will move in 
all four directions. If you are above water you can only move left or right. 
While you are above water, you can jump and climb on ceilings. To jump just 
press 'W' while above water. And to stick to a ceiling, hold 'W' when you hit a
ceiling. 

Technical Information
---------------------

Hit the '~' key to enable the Debug menu. 

This project was tested on Chrome and Firefox. Internet Explorer was not tested
against.

**Procedural Generation**  
Level terrain is generated in chunks. Each chunk is n blocks long and m blocks 
high. The first step of generation is the terrain grid is filled with blocks. 
This is done in two ways, either a premade pattern is added to the grid or a 
virus block is added. When a virus block is added to the grid, it spreads into 
the area around it based on a spreading algorithm. Then we cut paths through 
the terrain so that the player will allways have a possible route. After this 
the terrain is checked to make sure there is no loner blocks (blocks not 
touching any other blocks) still in the grid. Next the generated terrain is 
processed and converted into different types of blocks based on its location in
the grid. And finaly the grid of blocks is converted into level blocks that are
then added to the levels' block list.   

Points of Intrest:  
* Level.js, method generateChunk : Used to generate a block chunk  
* Level.js, method makeCorrectPath : Use to cute a path through the terrain
* Level.js, method gen_type6, gen_type7, gen_type9 : Methods used to generate virus chunks 

**A* Motion Planning**  
The "Death Cube" in our game uses A* Pathfinding. When a Death Cube is made, it 
grabs the players current location and homes in on it. The Death Cube does not 
correct its path if the player moves, so it is possible to dodge the cube. 

To see visual information about the A* Path, hit '~' then '5'. You must wait 
for a new path to be generated to see it, it will not show paths allready generated. 

Points of Interest: 
Blocks.js, function findPath : Uses A* to find a path from startLoc to the goalLoc

**AJAX**  
A small amount of AJAX is used to send player scores to the server. You can
view [the highscore](http://www.divided-games.com/Apps/SteppingStone/php/highscore.php). 
Currently the php script saves the highscore to a textfile. A future improvement
would be to use a database to keep track of multiple scores.  

File Descriptions
-----------------

* Blocks.js :: Holds the basic structure for each block Also Handles drawing for each block.
* Debug.js :: Adds some debugging features to make showing the game in class easier.  
* Game.js :: This is the main file for the game. It handles all of the I/O and also the game loop. 
* Hud.js :: Does 2D screen drawing for the game. 
* IO.js :: I/O File for the game. Handles keyboard and mouse. 
* Level.js :: This is the main gameplay file. Level contains the level structure and all the objects needed to play a game. Level also will call all the update and draw functions for all of the other objects in the game. 
* Player.js :: Contains the player objects and all code needed to make the player work. 
* Sound.js :: Controls sound for the game. 
* three.js :: Necessary 3D library for the project.
* jquery-2.0.3.min.js ::  [jquery](http://jquery.com) library used to make the prompt for user name look better.

Controls
--------

WASD  : Move the player  
Q & E : Rotate the camera  
Space : Activate Shield  
R     : Restart game  
P     : Pause game

Sounds
------

* [Slime Splash Sound](http://soundbible.com/1097-Slime-Splash.html) by Mike Koenig
* [Laser Cannon Sound](http://soundbible.com/1771-Laser-Cannon.html) by Mike Koenig
* [Computer Error Sound](http://soundbible.com/172-Computer-Error.html) by Mike Koenig  

Tested Browsers
---------------

OS | Browser | Version | Status 

Windows 7 | Chrome | 31.0.1650.63 m | Working   
Windows 7 | Firefox | 26.0 | Working  
Windows 7 | Safari | 5.1.7 | Not Working  
(Crashing in three.min.js)  
Windows 7 | IE | 9 | Not Working  
(Crashing in three.min.js & jquery-2.0.3.min.js)

