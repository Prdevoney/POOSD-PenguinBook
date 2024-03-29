<?php
$inData = getRequestInfo();

$userId = $inData["userId"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];

$conn = new mysqli("localhost", "TheBeast", "POOSD-2024-Spring", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID = ? AND BINARY FirstName = ? AND BINARY LastName = ?");
    $stmt->bind_param("iss", $userId, $firstName, $lastName);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        sendResultInfoAsJson(json_encode(["message" => "Contact deleted successfully"]));
    } else {
        returnWithError("Contact not found or no changes made.");
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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>
