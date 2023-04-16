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

        $sql = "SELECT f.province, f.name, f.capacity, COUNT(i.medicareNb) AS total_infected
        FROM nbc353_4.Facilities f
        LEFT JOIN nbc353_4.WorksIn w ON f.name = w.facilityName AND f.address = w.facilityAddress
        LEFT JOIN nbc353_4.IsInfected i ON w.medicareNb = i.medicareNb
        WHERE i.dateOfInfection >= DATE_ADD(CURRENT_DATE(), INTERVAL -2 WEEK)
        GROUP BY f.province, f.name, f.capacity
        ORDER BY f.province ASC, total_infected ASC;";
        $result = $conn->query($sql);
        //echo $sql;
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
   
$conn->close();
?>