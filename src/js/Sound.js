
//////////////////////////////////////////////////////////
// Assets
//////////////////////////////////////////////////////////
var splash_sound;
var shield_up_sound;
var shield_down_sound;
var shield_cooldown_sound;

function loadSounds() 
{
  //based on Slime Splash Sound
  splash_sound = document.createElement("audio");
  document.body.appendChild(splash_sound);
  splash_sound.setAttribute("src", "res/splash_sound.mp3");
  //To use call splash_sound.play();

  //based on Laser Cannon Sound
  shield_up_sound = document.createElement("audio");
  document.body.appendChild(shield_up_sound);
  shield_up_sound.setAttribute("src","res/shield_up_sound_m.wav");

  //based on Laser Cannon Sound
  shield_down_sound = document.createElement("audio");
  document.body.appendChild(shield_down_sound);
  shield_down_sound.setAttribute("src","res/shield_down_sound_m.wav");

  //based on Computer Error Sound
  shield_cooldown_sound = document.createElement("audio");
  document.body.appendChild(shield_cooldown_sound);
  shield_cooldown_sound.setAttribute("src","res/shield_cooldown_sound.mp3");
}