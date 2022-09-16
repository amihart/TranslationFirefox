<?php
        $a = file_get_contents("php://input");
	$b = "./websites/$a";
	if (file_exists($b) && strpos($a, "/") == false && strpos($a, "\\") == false)
	{
		echo file_get_contents($b);
	}
?>
