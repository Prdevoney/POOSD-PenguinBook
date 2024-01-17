<?php
	$inData = getRequestInfo();
	
	$contact = $inData["contact"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "POOSD-2024-Spring", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (UserId,Name) VALUES(?,?)");
		$stmt->bind_param("ss", $userId, $contact);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>