<?php
$g1 = "device-id-8f373a31-a510-4a3f-9472-4a0f5bb56245";

$curl = curl_init();

$curl = curl_init();
curl_setopt_array($curl, array(
 CURLOPT_URL => "https://ebs-granite.bigbang.io/api/v1/call",
 CURLOPT_RETURNTRANSFER => true,
 CURLOPT_ENCODING => "",
 CURLOPT_MAXREDIRS => 10,
 CURLOPT_TIMEOUT => 30,
 CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
 CURLOPT_CUSTOMREQUEST => "POST",
 CURLOPT_POSTFIELDS => "{\n\t\"id\":\"granite1\",\n\t\"namespace\": \"/deviceCountByTimeInterval\",\n\t\"message\": {\n\t\t\"beaconReaderId\":\"$g1\",\n\t\t\"timeInterval\": 60,\n\t\t\"startDateTime\": \"2018-07-15T00:00:00Z\",\n\t\t\"endDateTime\": \"2018-07-15T23:59:00Z\"\n\t}\n}",
 CURLOPT_HTTPHEADER => array(
   "Authorization: Bearer at_4d114c8e-4867-414f-9d65-76c4a9b8bb0b",
   "Cache-Control: no-cache",
   "Content-Type: application/json",
   "Postman-Token: 9637ee41-e18d-4683-aabc-acd703e0ab94"
 ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
 echo "cURL Error #:" . $err;
} else {
 echo $response;
}
