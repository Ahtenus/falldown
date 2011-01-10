<?php
error_reporting(E_ALL);
if(isset($_GET['n']) && is_numeric($_GET['s']) && isset($_GET['_'])){
	$name = strip_tags(substr($_GET['n'],0,20));
	$arr = json_decode(file_get_contents('score.json'),true);
	$newarr;
	$yourscore = array('n' =>$name, 's' => $_GET['s']);
	$ad = 0;
	$add = 0;
	$n = count($arr) < 10 ? count($arr) : 10;
	for($i = 0;$i < $n - $ad;$i++)
	{
		if($add == 0 && $arr[$i]['s'] < $_GET['s'])
		{
			$ad = count($arr) < 10 ? 0 : 1;
			$add = 1;

			$newarr[] = $yourscore; 
		}
		$newarr[$i + $add] = $arr[$i];
	}
	if($add == 0 && count($arr) < 10){
		$newarr[] = $yourscore;
	}
	$json = json_encode($newarr);
	$file = fopen("score.json", 'w') or exit('Filen kunde inte öppnas.');
	fwrite($file,$json);
	fclose($file);
	echo $json;
}
