<?php
$inData = getRequestInfo();

$contactId = $inData["contactId"];
$name = $inData["name"];
$phone = $inData["phone"];
$email = $inData["email"];

$conn = new mysqli("localhost", "TheBeast", "POOSD-2024-Spring", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
	$successFlag = false;
    // Check if any valid fields are provided for update
    if (isset($name) && !empty($name)) {
        $sql = "UPDATE Contacts SET Name = '$name' WHERE ID = $contactId";
        $conn->query($sql);

		$successFlag = true;
    }

    if (isset($phone) && !empty($phone)) {
        $sql = "UPDATE Contacts SET Phone = '$phone' WHERE ID = $contactId";
        $conn->query($sql);

		$successFlag = true;
    }

    if (isset($email) && !empty($email)) {
        $sql = "UPDATE Contacts SET Email = '$email' WHERE ID = $contactId";
        $conn->query($sql);

		$successFlag = true;
    }

    // Check if any updates were successful
    if ($successFlag) {
        sendResultInfoAsJson(json_encode(["message" => "Contact updated successfully"]));
    } else {
        returnWithError("Contact not found or no changes made.");
    }

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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>
