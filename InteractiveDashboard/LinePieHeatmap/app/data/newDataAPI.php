<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://ebeacons.bigbang.io/api/v1/call",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "{\n\t\"id\":\"whatever\",\n\t\"namespace\": \"/deviceCountByTimeInterval\",\n\t\"message\": {\n\t\t\"beaconReaderId\":\"device-id-9f2050e2-d51e-4449-b078-5ee65461bf1e\",\n\t\t\"timeInterval\": 5,\n\t\t\"startDateTime\": \"2018-04-25T20:51:00Z\"\n\n\t}\n}",
  CURLOPT_HTTPHEADER => array(
    "Authorization: Bearer at_4d114c8e-4867-414f-9d65-76c4a9b8bb0b",
    "Cache-Control: no-cache",
    "Content-Type: application/json",
    "Postman-Token: 28074254-dd77-46fa-a552-163fcde04121"
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

?>