<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: *');

   $conn = require('dbConnection.php');

    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    // print "Connected successfully". "<br>";
   
        $sql = "SHOW TABLES FROM nbc353_4;";
        $result = $conn->query($sql);
        
    if ($result) {
      echo json_encode($result->fetch_all());
    } else {
      echo "0 results";
    }
   
$conn->close();
?>