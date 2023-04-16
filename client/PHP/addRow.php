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
        $keyList = array();
        $valueList = array();

        foreach($row as $key => $value){
          array_push($keyList, $key);
          array_push($valueList, "\"$value\"");
        }
        $joinedKeys= "(" . join(", ", $keyList) . ")";
        $joinedValues= "(" . join(", ", $valueList) . ")";
        
        $sql = "INSERT INTO nbc353_4.$tableName $joinedKeys 
                VALUES $joinedValues;";
        $result = $conn->query($sql);
        echo $sql;
        echo $result;
    }
   
$conn->close();
?>