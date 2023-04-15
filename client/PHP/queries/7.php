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

        $sql = "SELECT e.fName, e.lName, e.startDate, e.dateOfBirth, e.medicareNb, e.phoneNb, e.address, e.city, e.province, e.postalCode, e.citizenship, e.emailAddress, e.role
                FROM nbc353_4.Facilities as f
                JOIN (SELECT * FROM nbc353_4.WorksIn as w
                      NATURAL JOIN nbc353_4.Employees
                      WHERE w.endDate IS NULL) as e 
                ON f.name = e.facilityName 
                AND f.address = e.facilityAddress
                WHERE $joinedAttributes
                ORDER BY e.role, e.fName, e.lName;";
        $result = $conn->query($sql);
        //echo $sql;
      echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
   
$conn->close();
?>