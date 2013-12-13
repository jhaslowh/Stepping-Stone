<?php 
error_reporting(E_ALL |E_STRICT);

$score_file = 'highscore.txt';

// Read from disk
$score_file_text = file_get_contents($score_file);
$input_array = explode(' ', $score_file_text, 2);//First element is score, second is name
$current_highscore = intval($input_array[0]);
$current_highscore_holder = $input_array[1];

echo "highscore: ";
echo $current_highscore;
echo " by " ;
echo $current_highscore_holder;

?>