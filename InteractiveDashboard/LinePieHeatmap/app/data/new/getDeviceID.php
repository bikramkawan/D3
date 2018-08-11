
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://ebs-granite.bigbang.io/api/v1/devices",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "cache-control: no-cache",
    "content-type: application/json",
    "postman-token: b89fbeed-6cbe-0feb-00f7-4e146b9b76b5"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);
print_r("<br>" . $response);

?>