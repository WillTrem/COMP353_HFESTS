<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: *');

   $conn = require('../dbConnection.php');

    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    // print "Connected successfully". "<br>";
    $_POST = json_decode(file_get_contents('php://input'), true);

    if($_POST){
        $keys = $_POST['keys'];
        $fieldList = array();
        foreach($keys as $key => $value){
          array_push($fieldList, "$key=\"$value\"");
        }
        $joinedAttributes = join(" AND ", $fieldList);

        $sql = "SELECT facilityName, DAYOFYEAR(date) AS dayOfTheYear, startTime, endTime
                FROM nbc353_4.Schedules
                WHERE $joinedAttributes AND date >= '2023-05-01' AND date <= '2023-06-01'
                ORDER BY facilityName, dayOfTheYear, startTime ASC;";
        $result = $conn->query($sql);
        // echo $sql;
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
   
$conn->close();
?>