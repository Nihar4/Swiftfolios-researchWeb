<?php
//include("../../NSEMasterServices/Connection.php");
include("iinApiGeneralF.php");
// $IIN = $_REQUEST['iin'];
// $type=$_REQUEST['type'];
// $code=$_REQUEST['code'];
// $no=$_REQUEST['no'];
// $no_key=($_REQUEST['type']=="SIP")?"APPLICATION_NO":"USER_TRXNNO";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// $pan=$_REQUEST['pan'];
// $q="select iin_no from frontend_user_individual where primaryPAN='".$pan."'";
// $r=$conn->query($q);
// if(mysqli_num_rows($r)==0){
//     echo "<div id=blank>No data</div>";
//     return;
// }
// $row=$r->fetch_assoc();
// if($row['iin_no']==null || $row['iin_no']==''){
//     echo "<div id=blank>No data</div>";
//     return;
// }
// $IIN=$row['iin_no'];
$IIN="5013023898";
function GetNormalSIPTransactions($IIN)
{

    try{
      $subArray = array();
    $subArrayIndx = 0;

    //$to_date = date('d-M-Y');
    //$from_date = date("d-M-Y", strtotime($to_date . ' - 15 days'));

    $postString = '<NMFIIService>';

    $postString .= '<service_request>
                    <appln_id>MFS128314</appln_id>
                    <password>DJQXZH79</password>
                    <broker_code>ARN-128314</broker_code>
                    <iin>' . $IIN . '</iin>
                </service_request>';

    $postString .= '</NMFIIService>';

    $url = 'https://www.nsenmf.com/NMFIITrxnService/NMFTrxnService/IINDETAILS';

    echo $url."<br>";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postString);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/xml'));

    if(curl_exec($ch) === false)
    {
        echo 'Curl error: ' . curl_error($ch);
    }
    else
    {
        echo 'Operation completed without any errors, you have the response';
    }

    $content = curl_exec($ch);

    echo $content;

    // $resultXML = $content;

    // print_r($resultXML);

    // $xml = new DomDocument();
    // $xml->loadXML($resultXML);
    // $xpath = new DOMXPath($xml);

    // $service = "//service_status";

    // $entries = $xpath->query($service);


    // foreach ($entries as $entry) {
    //     $service_msg =  $entry->getElementsByTagName("service_msg")->item(0)->nodeValue;
    //     $service_return_code =  $entry->getElementsByTagName("service_return_code")->item(0)->nodeValue;
    // }
    // // echo $service_return_code;
    // if ($service_return_code == "0") {

    //     $query = "//service_response";
    //     $datarow = $xpath->query($query);

    //     foreach ($datarow as $data) {
    //         foreach ($data->getElementsByTagName("*") as $element) {
    //             // echo $element->tagName."  : ".$element->nodeValue;
    //             // echo "<br>";
    //             $subArray[$subArrayIndx][$element->tagName] = $element->nodeValue;
    //         }
    //         $subArrayIndx += 1;
    //     }
    // }

    // return $subArray;
    }
    catch(Exception $e){
      echo 'Message: ' .$e->getMessage();
    }
}

// echo '<pre>';
// Function Call
$subArray = GetNormalSIPTransactions($IIN);
// print_r($subArray);

// echo '<pre>';
// echo "<div id=outer>";
// foreach ($subArray as $ar) {
//     echo "<div class=tran>";
//     echo "<table>";
//     foreach ($ar as $key => $subar) {
//         echo "<tr>";
//         echo "<td>" . $key . "</td>";
//         echo "<td>" . $subar . "</td>";
//         echo "</tr>";
//     }
//     echo "</table></div>";
// }
// echo "</div>";
?>