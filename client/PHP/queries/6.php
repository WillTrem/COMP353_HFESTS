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
        $sql = "WITH GeneralManagers as 
                  (SELECT fName, lName, facilityName, facilityAddress FROM nbc353_4.WorksIn NATURAL JOIN (SELECT * 
                    FROM nbc353_4.Employees as e 
                    NATURAL JOIN nbc353_4.AdministrativePersonnel) 
                  as admins),
                numberOfEmployees as (
                    SELECT name, address, count(nbc353_4.w.medicareNb) as nbWorkingEmployees
                        FROM nbc353_4.Facilities as fa RIGHT OUTER JOIN nbc353_4.WorksIn as w ON fa.name = w.facilityName AND fa.address = w.facilityAddress
                        WHERE w.endDate IS NULL 
                        GROUP BY name, address
                    )
      
                SELECT f.name, f.address, f.city, f.province, f.postalCode, f.phoneNb, f.webAddress, f.type, f.capacity, g.fName as GM_fName, g.lName as GM_lName, n.nbWorkingEmployees
                FROM nbc353_4.Facilities as f 
                LEFT OUTER JOIN GeneralManagers as g on f.name = g.facilityName AND f.address = g.facilityAddress
                NATURAL JOIN numberOfEmployees as n
                ORDER BY f.province, f.city, n.nbWorkingEmployees;";
        $result = $conn->query($sql);
        
      echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
   
$conn->close();
?>