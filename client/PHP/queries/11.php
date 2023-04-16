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
          array_push($fieldList, "nbc353_4.Schedules.$key=\"$value\"");
        }
        $joinedAttributes = join(" AND ", $fieldList);

        $sql = "(SELECT *
        FROM nbc353_4.Employees, nbc353_4.Doctors, nbc353_4.Schedules
        WHERE date >= DATE_ADD(CURRENT_DATE(), INTERVAL -2 WEEK)
        AND nbc353_4.Employees.medicareNb = nbc353_4.Doctors.medicareNb
        AND nbc353_4.Employees.medicareNb = nbc353_4.Schedules.medicareNb
        AND $joinedAttributes
        ORDER BY nbc353_4.Employees.role ASC, nbc353_4.Employees.fName ASC) UNION
        (SELECT *
        FROM nbc353_4.Employees, nbc353_4.Nurses, nbc353_4.Schedules
        WHERE date >= DATE_ADD(CURRENT_DATE(), INTERVAL -2 WEEK)
        AND nbc353_4.Employees.medicareNb = nbc353_4.Nurses.medicareNb
        AND nbc353_4.Employees.medicareNb = nbc353_4.Schedules.medicareNb
        AND $joinedAttributes
        ORDER BY nbc353_4.Employees.role ASC, nbc353_4.Employees.fName ASC)";
        $result = $conn->query($sql);
        //echo $sql;
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
   
$conn->close();
?>