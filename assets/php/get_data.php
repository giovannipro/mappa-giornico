<?php
	ini_set("display_errors", 1);
	ini_set("display_startup_errors", 1);
	error_reporting(E_ALL);

	require_once("config.php"); 

	// query db
	// --------------------------------------------

	$query_a = "SELECT * 
		FROM locations
	";

	// get data
	// --------------------------------------------
	
	$result_a = $conn->query($query_a);
	// $data_a = array();

	$items = $result_a->num_rows;

	if ($result_a->num_rows > 0) {
		
		echo "id name lat lon" . "<br/>" ;

		while($row = $result_a->fetch_assoc()) {
			echo (int)$row["id"] . " " . $row["name"] . " " . (float)$row["lat"] . " " . (float)$row["lon"] . "<br/>";
		}
	} 
	else {
		echo "0 results";
	}

	$conn->close();
?>