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
        $row = $_POST['row'];
        $medicareNb = array_shift($row);
        $fieldList = array();
        
        foreach($row as $key => $value){
          array_push($fieldList, "$key='$value'");
        }
        $joinedAttributes = join(", ", $fieldList);
        
        $sql = "UPDATE nbc353_4.Employees 
                SET $joinedAttributes
                WHERE medicareNb = $medicareNb;";
        $result = $conn->query($sql);

    }
   
$conn->close();
?>