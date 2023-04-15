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
        $name = array_shift($row);
        $address = array_shift($row);
        $fieldList = array();
        
        foreach($row as $key => $value){
          array_push($fieldList, "$key=\"$value\"");
        }
        $joinedAttributes = join(", ", $fieldList);
        
        $sql = "UPDATE nbc353_4.Facilities 
                SET $joinedAttributes
                WHERE name = '$name' AND address = '$address';";
        $result = $conn->query($sql);
        echo $result;
    }
   
$conn->close();
?>