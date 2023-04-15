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
          array_push($fieldList, "f1.$key=\"$value\"");
        }
        $joinedAttributes = join(" AND ", $fieldList);

        $sql = "SELECT emailSender, emailReceiver, emailSubject, emailDate, emailBody
                FROM nbc353_4.Logs
                JOIN nbc353_4.Facilities f1 ON f1.name = nbc353_4.Logs.emailSender
                AND $joinedAttributes
                ORDER BY emailDate ASC;";
        $result = $conn->query($sql);
        // echo $sql;
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }
   
$conn->close();
?>