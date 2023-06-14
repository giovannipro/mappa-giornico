<?php
	ini_set("display_errors", 1);
	ini_set("display_startup_errors", 1);
	error_reporting(E_ALL);

	$hostname = getenv('HTTP_HOST');

	// access data
	require_once("access.php"); 

	// Create and check connection
	$conn = new mysqli($servername, $username, $password, $dbname); 

	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

?>