<?php

error_reporting(0);

define('USERNAME', 'salesforce');
define('PASSWORD', 'c3eTJRbs#U3vjUsj');
define('JWT_KEY', 'jdYnaPsFMxpBXKw9mWSbUbueZp8hiN6Gkz+Fkrknsp6R1IdHsY4CukMxytctMQp28P78VhinkP0KBYGBa59zZw==');
define('EXP', 60 * 60 * 24); //24h

// Encode for jwt token
function enc($e)
{
    $e = is_string($e) ? $e : json_encode($e);
    return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($e));
}

// Sign header and payload and return jwt token
function sign($header, $payload, $key)
{
    $msg = enc($header) . "." . enc($payload);
    return $msg . "." . enc(hash_hmac('sha256', $msg, $key, true));
}

// Get username and password
$username = isset($_SERVER['PHP_AUTH_USER']) ? $_SERVER['PHP_AUTH_USER'] : null;
$password = isset($_SERVER['PHP_AUTH_PW']) ? $_SERVER['PHP_AUTH_PW'] : null;

// Check if username and password are valid
if ($username === USERNAME && $password === PASSWORD) {
    $header = ['typ' => 'JWT', 'alg' => 'HS256'];
    $payload = ["iat" => time(), "exp" => time() + EXP, "drupal" => ["uid" => "7"]];
    $token = sign($header, $payload, base64_decode(JWT_KEY));

    $args = explode('/', isset($_REQUEST['d']) && $_REQUEST['d'] ? htmlentities($_REQUEST['d']) : 'resources', 2);
    $display = $args[0];
    $args = isset($args[1]) ? $args[1] : '';

    header('Content-Type: application/json');
    echo json_encode([
        'element' => '<div id="owners-community-integration" data-token="' .
            $token . '" data-display="' . $display . '" data-args="' . $args . '"></div>'
    ]);
    exit;
}

// Username and password seem to be wrong
header('WWW-Authenticate: Basic realm="OC Element"');
header('HTTP/1.0 401 Unauthorized');
echo 'Access denied';
