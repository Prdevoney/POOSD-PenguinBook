<?php
$secret = 'SK-123456789';
$json = file_get_contents('php://input');
$data = json_decode($json);

$signature = $_SERVER['HTTP_X_HUB_SIGNATURE'];

if (calculate_git_signature($json, $secret) == $signature) {
    exec('cd /var/www/html && git pull');
    echo 'success';
} else {
    header('HTTP/1.0 403 Forbidden');
    echo 'Invalid signature';
}

function calculate_git_signature($data, $secret) {
    return 'sha1=' . hash_hmac('sha1', $data, $secret);
}
?>