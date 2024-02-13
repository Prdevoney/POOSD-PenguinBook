<?php
header("Content-Type: application/json");

// Create connection
$conn = new mysqli("localhost", "TheBeast", "POOSD-2024-Spring", "COP4331");

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Process incoming JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$requiredFields = ["firstName", "lastName", "login", "password"];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        die(json_encode(["error" => "Missing required field: $field"]));
    }
}

// Retrieve user input
$firstName = $data["firstName"];
$lastName = $data["lastName"];
$login = $data["login"];
$password = $data["password"];

// Check if login already exists
$checkLoginQuery = "SELECT ID FROM Users WHERE Login = '$login'";
$checkLoginResult = $conn->query($checkLoginQuery);

if ($checkLoginResult->num_rows > 0) {
    // Login already exists
    die(json_encode(["error" => "Login already exists"]));
}

// Password verification
if (strlen($password) < 8 || strlen($password) > 16 ||
    !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password) ||
    !preg_match('/[^a-zA-Z0-9]/', $password)) {
    die(json_encode(["error" => "Password must be between 8 and 16 characters and contain at least one capital letter, one number, and one symbol"]));
}

// Insert user into the database with current timestamp
$sql = "INSERT INTO Users (DateCreated, DateLastLoggedIn, FirstName, LastName, Login, Password) VALUES (NOW(), NOW(), '$firstName', '$lastName', '$login', '$password')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "User registered successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>
