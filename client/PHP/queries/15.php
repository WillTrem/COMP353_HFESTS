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

        $sql = "SELECT e.fName, e.lName, e.dateOfBirth, e.emailAddress, MIN(w.startDate) AS firstDayOfWork, SUM(HOUR(TIMEDIFF(s.endTime, s.startTime))) AS totalHoursScheduled
        FROM nbc353_4.Employees e, nbc353_4.Nurses n, nbc353_4.WorksIn w, nbc353_4.Schedules s
        
        WHERE  e.medicareNb = n.medicareNb
        AND  e.medicareNb = w.medicareNb 
        AND  e.medicareNb = s.medicareNb 
        
        GROUP BY e.medicareNb
        HAVING SUM(HOUR(TIMEDIFF(s.endTime, s.startTime))) = (
            
          SELECT MAX(hours)
          FROM (
            SELECT e.medicareNb, SUM(HOUR(TIMEDIFF(s.endTime, s.startTime))) AS hours
            FROM nbc353_4.Employees e, nbc353_4.Nurses n, nbc353_4.WorksIn w, nbc353_4.Schedules s
            WHERE  e.medicareNb = n.medicareNb
            AND  e.medicareNb = w.medicareNb 
            AND  e.medicareNb = s.medicareNb
            AND w.endDate IS NULL
            GROUP BY e.medicareNb
          ) t
        );";
        $result = $conn->query($sql);
        //echo $sql;
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
   
$conn->close();
?>