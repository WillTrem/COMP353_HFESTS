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

        $sql = "SELECT dnw.fName, dnw.lName, dnw.firstDate, dnw.role, dnw.dateOfBirth, dnw.emailAddress, SUM(HOUR(TIMEDIFF(s.endTime, s.startTime))) as totalHours
        FROM
           (SELECT dn.medicareNb, dn.fName, dn.lName, MIN(w.startDate) as firstDate, dn.role, dn.dateOfBirth, dn.emailAddress
           FROM 
           ((SELECT * 
           FROM nbc353_4.Doctors 
           NATURAL JOIN nbc353_4.Employees
           WHERE medicareNb NOT IN
           (SELECT medicareNb FROM  nbc353_4.IsInfected WHERE nature = 'COVID-19')) 
           UNION
           (SELECT * 
           FROM nbc353_4.Nurses 
           NATURAL JOIN nbc353_4.Employees
           WHERE medicareNb NOT IN
           (SELECT medicareNb FROM  nbc353_4.IsInfected WHERE nature = 'COVID-19'))) as dn, nbc353_4.WorksIn as w
           WHERE dn.medicareNb = w.medicareNb
           GROUP BY dn.medicareNb) as dnw
             LEFT OUTER JOIN nbc353_4.Schedules as s on dnw.medicareNb = s.medicareNb
             GROUP BY dnw.medicareNb
             ORDER BY dnw.role, dnw.fName, dnw.lName
         ;";
        $result = $conn->query($sql);
        //echo $sql;
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
   
$conn->close();
?>