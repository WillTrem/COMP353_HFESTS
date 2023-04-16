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

        $sql = "SELECT nbc353_4.Employees.fName, nbc353_4.Employees.lName, nbc353_4.Employees.city, COUNT(nbc353_4.Facilities.name) AS numberFacilities
        FROM nbc353_4.Employees, nbc353_4.Doctors, nbc353_4.Facilities, nbc353_4.WorksIn
        WHERE nbc353_4.Employees.medicareNb = nbc353_4.Doctors.medicareNb
        AND nbc353_4.Employees.medicareNb = nbc353_4.WorksIn.medicareNb
        AND WorksIn.facilityName = nbc353_4.Facilities.name
        AND WorksIn.endDate IS NULL
        AND nbc353_4.Facilities.province = \"Québec\"
        GROUP BY nbc353_4.Employees.medicareNb
        ORDER BY nbc353_4.Employees.city ASC, numberFacilities DESC;";
        $result = $conn->query($sql);
        //echo $sql;
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
   
$conn->close();
?>