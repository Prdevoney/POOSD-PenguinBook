<?php
$inData = getRequestInfo();

$userId = $inData["userId"];

// Check if userId is empty
if (empty($userId)) {
    returnWithError("UserID is required.");
    exit();
}

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];

$conn = new mysqli("localhost", "TheBeast", "POOSD-2024-Spring", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ? AND BINARY FirstName LIKE ? AND BINARY LastName LIKE ?");
    $searchFirstName = "%" . $firstName . "%";
    $searchLastName = "%" . $lastName . "%";
    $stmt->bind_param("iss", $userId, $searchFirstName, $searchLastName);
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
