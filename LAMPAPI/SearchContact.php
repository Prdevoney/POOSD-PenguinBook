<?php
$inData = getRequestInfo();

$name = $inData["name"];
$userId = $inData["userId"];

$conn = new mysqli("localhost", "TheBeast", "POOSD-2024-Spring", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ? AND BINARY Name LIKE ?");
    $searchPattern = "%" . $name . "%";
    $stmt->bind_param("is", $userId, $searchPattern);
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    $contacts = array();

    while ($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }

    $stmt->close();
    $conn->close();

    if (empty($contacts)) {
        sendResultInfoAsJson(json_encode(["message" => "No contacts found."]));
    } else {
        sendResultInfoAsJson(json_encode($contacts));
    }
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
