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
          array_push($fieldList, "f.$key=\"$value\"");
        }
        $joinedAttributes = join(" AND ", $fieldList);

        $sql = "WITH ScheduledEmployees as (SELECT medicareNb, startTime, endTime
        FROM nbc353_4.Facilities as f
        LEFT OUTER JOIN nbc353_4.Schedules as s on f.name = s.facilityName AND f.address = s.facilityAddress
        WHERE $joinedAttributes )
        
        SELECT role, SUM(HOUR(TIMEDIFF(endTime , startTime ))) as totalHours 
        FROM nbc353_4.Employees
        NATURAL JOIN ScheduledEmployees
        GROUP BY role
        ORDER BY role
        ;";
        $result = $conn->query($sql);
        //echo $sql;
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
   
$conn->close();
?>