
//////////////////////////////////////////////////////////
// Assets
//////////////////////////////////////////////////////////
var splash_sound;
var shield_up_sound;
var shield_down_sound;
var shield_cooldown_sound;

function loadResources() 
{
  //based on Slime Splash Sound
  splash_sound = document.createElement("audio");
  document.body.appendChild(splash_sound);
  splash_sound.setAttribute("src", "res/splash_sound.mp3");
  //To use call splash_sound.play();

  //based on Laser Cannon Sound
  shield_up_sound = document.createElement("audio");
  document.body.appendChild(shield_up_sound);
  shield_up_sound.setAttribute("src","res/shield_up_sound.mp3");

  //based on Laser Cannon Sound
  shield_down_sound = document.createElement("audio");
  document.body.appendChild(shield_down_sound);
  shield_down_sound.setAttribute("src","res/shield_down_sound.mp3");

  //based on Computer Error Sound
  shield_cooldown_sound = document.createElement("audio");
  document.body.appendChild(shield_cooldown_sound);
  shield_cooldown_sound.setAttribute("src","res/shield_cooldown_sound.mp3");



}


function soundTest(){
    splash_sound.volume = this.air_t; // Volume depends on how long the player falls. Volume maxes when air_t is =>1
    splash_sound.currentTime = 0;
//    splash_sound.play();


    var second_sound = splash_sound;
   // second_sound.play();
    //console.log("test");
    //console.log(player);
//    console.log(level.level_left);

//    level.level_left 
  //  player.mesh.position.y. 


}



loadResources();
