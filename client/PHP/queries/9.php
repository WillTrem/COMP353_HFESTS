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

        $sql = "SELECT fName, lName, dateOfInfection, name
                FROM nbc353_4.Employees, nbc353_4.IsInfected, nbc353_4.Facilities, nbc353_4.Doctors, nbc353_4.Infections, nbc353_4.WorksIn
                WHERE nbc353_4.Employees.medicareNb = nbc353_4.Doctors.medicareNb 
                AND nbc353_4.Employees.medicareNb = nbc353_4.WorksIn.medicareNb
                AND nbc353_4.Employees.medicareNb = nbc353_4.IsInfected.medicareNb
                AND nbc353_4.WorksIn.facilityName = nbc353_4.Facilities.name
                AND nbc353_4.WorksIn.endDate IS NULL
                AND Infections.nature = nbc353_4.IsInfected.nature
                AND Infections.nature = 'COVID-19'
                AND nbc353_4.IsInfected.dateOfInfection >= '2023-04-01'
                ORDER BY name, fname ASC;";
        $result = $conn->query($sql);
        // echo $sql;
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
   
$conn->close();
?>