<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: *');

   $conn = require('dbConnection.php');

    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    // print "Connected successfully". "<br>";
    $_POST = json_decode(file_get_contents('php://input'), true);

    if($_POST){
        $tableName = $_POST['tableName'];
        $sql = "SELECT * FROM nbc353_4.$tableName;";
        $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
      // output data of each row
    //   while($row = $result->fetch_assoc()) {
    //     print "id: " . $row["medicareNb"]. " - Name: " . $row["fName"]. " " . $row["lName"]. "<br>";
    //   }
      echo json_encode($result->fetch_all());
    } else {
      echo "0 results";
    }
    }
   
$conn->close();
?>