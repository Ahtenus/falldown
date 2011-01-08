<?php
error_reporting(E_ALL);
if(isset($_GET['n']) && is_numeric($_GET['s'])){
	$name = strip_tags($_GET['n']);
	$arr = json_decode(file_get_contents('score.json'),true);
	$newarr;
	$yourscore = array('n' =>$name, 's' => $_GET['s']);
	$ad = 0;
	$n = count($arr) < 10 ? count($arr) : 10;
	for($i = 0;$i < $n - $ad;$i++)
	{
		if($ad == 0 && $arr[$i]['s'] < $_GET['s'])
		{
			$ad = 1;
			$newarr[] = $yourscore; 
		}
		$newarr[$i + $ad] = $arr[$i];
	}
	if($ad == 0 && count($arr) < 10){
		$newarr[] = $yourscore;
	}
	$file = fopen("score.json", 'w') or exit('Filen kunde inte öppnas.');
	fwrite($file,json_encode($newarr));
	fclose($file);
}
