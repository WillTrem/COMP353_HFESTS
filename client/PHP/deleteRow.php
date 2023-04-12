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
        $row = $_POST['row'];

        $fieldList = array();
        
        foreach($row as $key => $value){
          array_push($fieldList, "$key='$value'");
        }
        $joinedAttributes = join(" AND ", $fieldList);
        
        $sql = "DELETE FROM nbc353_4.$tableName 
                WHERE $joinedAttributes;";
        $result = $conn->query($sql);
        echo $result;
    }
   
$conn->close();
?>