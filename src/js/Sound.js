
//////////////////////////////////////////////////////////
// Assets
//////////////////////////////////////////////////////////
var splash_sound;
var shield_up_sound;

function loadResources() 
{
  splash_sound = document.createElement("audio");
  document.body.appendChild(splash_sound);
  splash_sound.setAttribute("src", "res/splash_sound.mp3");
  //To use call splash_sound.play();

  shield_up_sound = document.createElement("audio");
  document.body.appendChild(shield_up_sound);
  shield_up_sound.setAttribute("src","res/shield_up_sound.mp3")

}

loadResources();
