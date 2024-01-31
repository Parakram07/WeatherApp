<?php
// Connect to the MySQL database
$servername = "sql308.infinityfree.com";
$username = "if0_34927884";
$password = "mfqxzuQt9Ot";
$dbname = "if0_34927884_weatherapp";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle incoming JSON data from JavaScript
$data = json_decode(file_get_contents("php://input"));

// Extract data from JSON
$city = $data->city;
$temp = $data->weatherData->temp;
$humidity = $data->weatherData->humidity;
$wind_speed = $data->weatherData->wind_speed;
$icon = $data->weatherData->icon;
$date_recorded = $data->weatherData->date_recorded;

// Prepare and execute the SQL INSERT statement
$sql = "INSERT INTO weather_data (city, temp, humidity, wind_speed, icon, date_recorded) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $city, $temp, $humidity, $wind_speed, $icon, $date_recorded);

if ($stmt->execute()) {
    echo json_encode(array("message" => "Weather data stored successfully."));
} else {
    echo json_encode(array("error" => "Error storing weather data."));
}

// Close the database connection
$stmt->close();
$conn->close();
?>
