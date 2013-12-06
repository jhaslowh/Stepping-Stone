
//////////////////////////////////////////////////////////
// Assets
//////////////////////////////////////////////////////////
var splash_sound;


function loadResources() 
{
  splash_sound = document.createElement("audio");
  document.body.appendChild(splash_sound);
  splash_sound.setAttribute("src", "res/splash_sound.mp3");
  //To use call splash_sound.play();

}

loadResources();
