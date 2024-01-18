<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "TheBeast", "POOSD-2024-Spring", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Check if the login already exists before registering
		$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($result->num_rows > 0)
		{
			returnWithError("Login already exists");
		}
		else
		{
			// Insert new user into the Users table
			$stmt = $conn->prepare("INSERT INTO Users (DateCreated, DateLastLoggedIn, FirstName, LastName, Login, Password) VALUES (NOW(), NOW(), ?, ?, ?, ?)");
			$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);
			$stmt->execute();

			// Retrieve the ID of the newly registered user
			$id = $conn->insert_id;

			// Return registration information
			returnWithInfo($inData["firstName"], $inData["lastName"], $id);
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithInfo($firstName, $lastName, $id)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson($retValue);
	}
	
?>
