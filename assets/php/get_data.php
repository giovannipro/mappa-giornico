<?php
	ini_set("display_errors", 1);
	ini_set("display_startup_errors", 1);
	error_reporting(E_ALL);

	require_once("config.php"); 

	// query db
	// --------------------------------------------

	$query = "SELECT * 
		FROM locations
	";


	// get data
	// --------------------------------------------


	$conn = mysqli_connect($servername, $username, $password, $dbname);
	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
	}
	$result = mysqli_query($conn, $query);

	$data = array();
	while ($row = mysqli_fetch_assoc($result)) {
		$data[] = $row;
	}

	$json = json_encode($data);
	if ($json === false) {
  		die("JSON encoding failed");
	}
	echo $json;

	header('Content-Type: application/json');

	mysqli_close($conn);

?>