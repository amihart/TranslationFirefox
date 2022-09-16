<?php
	$conn = mysqli_connect('localhost', 'cache', 'AFLK#$FLK#$F:KFL#$!!)KG!RL:!!');
	if (!$conn)
	{
		echo "Error: " . mysqli_connect_error();
		exit();
	}

        $a = file_get_contents("php://input");

        $b = select($a, $conn);
	if (is_null($b))
	{
		error_log("cache miss");
		file_put_contents(".tmp", $a);
		$b = shell_exec("trans :en file://.tmp -b | sed -e 's/u003d/=/g' -e 's/u003c/</g' -e 's/u003e/>/g'");
		insert($a, $b, $conn);
	}
	else
	{
		error_log("cache hit");
	}
        echo $b;

	mysqli_close($conn);
	exit();

	function insert($i, $o, $conn)
	{
		$i = base64_encode(urlencode($i));
		$o = base64_encode(urlencode($o));
		$sql = <<<HERE
			insert into API.GenericCache
			(
				Service,
				Input,
				Output
			)
			values
			(
				'Translation',
				'$i',
				'$o'
			)
		HERE;
		mysqli_query($conn, $sql);
	}

	function select($i, $conn)
	{
		$i = base64_encode(urlencode($i));
		$sql = <<<HERE
			select Input, Output
			from API.GenericCache
			where Input = '$i'
			and Service = 'Translation'
		HERE;
		$ret = null;
		$result = mysqli_query($conn, $sql);
		if (mysqli_num_rows($result) > 0)
		{
                	while ($row = mysqli_fetch_assoc($result))
			{
				$ret = urldecode(base64_decode($row["Output"]));
			}
                }
		return $ret;
	}



//	$a = "test";

//	echo $a;

/*
	$a = file_get_contents("php://input");
	file_put_contents(".tmp", $a);
	$b = shell_exec("trans :en file://.tmp -b | sed -e 's/u003d/=/g' -e 's/u003c/</g' -e 's/u003e/>/g'");
	echo $b
*/
?>
