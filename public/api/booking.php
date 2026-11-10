<?php

declare(strict_types=1);

// Requires PHP 8.1+ with cURL. Secrets and delivery state live outside the web root.
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $status, string $message): never
{
    respond($status, ['ok' => false, 'message' => $message]);
}

function lengthOf(string $value): int
{
    preg_match_all('/./us', $value, $matches);
    return count($matches[0]);
}

function contactValid(string $channel, string $value): bool
{
    $phone = preg_match('/^(?:0\d{9}|\+?[1-9]\d{7,14})$/', preg_replace('/[\s().-]/', '', $value)) === 1;
    $handle = preg_replace('/^@/', '', $value);
    $patterns = [
        'telegram' => '/^[a-zA-Z][a-zA-Z0-9_]{2,31}$/',
        'instagram' => '/^(?=.*[a-zA-Z0-9_])[a-zA-Z0-9_.]{1,30}$/',
        'facebook' => '/^[a-zA-Z0-9][a-zA-Z0-9.]{2,99}$/',
    ];
    if ($channel === 'viber') return $phone;
    if ($channel === 'telegram' && $phone) return true;
    if (isset($patterns[$channel]) && preg_match($patterns[$channel], $handle) === 1) return true;
    $hosts = [
        'telegram' => ['t.me', 'telegram.me'],
        'instagram' => ['instagram.com', 'www.instagram.com'],
        'facebook' => ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.com', 'www.fb.com'],
    ];
    $url = parse_url(str_contains($value, '://') ? $value : 'https://' . $value);
    return is_array($url)
        && in_array($url['scheme'] ?? '', ['https', 'http'], true)
        && !isset($url['user']) && !isset($url['pass'])
        && in_array(strtolower($url['host'] ?? ''), $hosts[$channel] ?? [], true)
        && strlen($url['path'] ?? '') > 1;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    fail(405, 'Оберіть надсилання через форму на сайті.');
}

$documentRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
$configPath = getenv('VIPET_BOOKING_CONFIG_PATH');
if (!$configPath && $documentRoot) $configPath = dirname($documentRoot) . '/vipet-booking-config.php';
$configPath = $configPath ? realpath($configPath) : false;
if (!$documentRoot || !$configPath || str_starts_with($configPath, $documentRoot . DIRECTORY_SEPARATOR)) {
    fail(503, 'Онлайн-запис ще налаштовується. Будь ласка, зв’яжіться із салоном.');
}
$config = require $configPath;
if (!is_array($config) || ($config['enabled'] ?? false) !== true
    || !preg_match('/^\d+:[A-Za-z0-9_-]+$/', $config['bot_token'] ?? '')
    || !preg_match('/^-?\d+$/', (string) ($config['chat_id'] ?? ''))
    || !function_exists('curl_init') || !function_exists('iconv')) {
    fail(503, 'Онлайн-запис ще налаштовується. Будь ласка, зв’яжіться із салоном.');
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!$origin || !hash_equals((string) ($config['allowed_origin'] ?? ''), $origin)) {
    fail(403, 'Надішліть заявку з форми на сайті салону.');
}
if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
    fail(415, 'Непідтримуваний формат заявки.');
}
$input = fopen('php://input', 'rb');
$raw = $input ? stream_get_contents($input, 16385) : false;
if ($input) fclose($input);
if ($raw === false || strlen($raw) > 16384) fail(413, 'Заявка завелика. Скоротіть коментар.');
$data = json_decode($raw, true);
if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) fail(400, 'Некоректна заявка.');
foreach (['requestId', 'customerName', 'petName', 'petType', 'breedId', 'serviceId', 'channel', 'contact', 'comment', 'website', 'weightBand', 'coatLength'] as $key) {
    if (!isset($data[$key]) || !is_string($data[$key])) fail(422, 'Перевірте поля заявки.');
    $data[$key] = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $data[$key]));
    if ($key !== 'comment') $data[$key] = preg_replace('/\s+/u', ' ', $data[$key]);
}
if ($data['website'] !== '') fail(422, 'Перевірте поля заявки.');
if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $data['requestId'])) {
    fail(422, 'Оновіть сторінку й спробуйте знову.');
}
$channels = ['telegram' => 'Telegram', 'viber' => 'Viber', 'instagram' => 'Instagram', 'facebook' => 'Facebook'];
if (!in_array($data['petType'], ['dog', 'cat'], true)
    || !isset($channels[$data['channel']])
    || lengthOf($data['customerName']) < 2 || lengthOf($data['customerName']) > 100
    || !preg_match('/\p{L}/u', $data['customerName'])
    || !preg_match('/^[\p{L}\p{M}\s’\'ʼ.\-]+$/u', $data['customerName'])
    || lengthOf($data['petName']) < 1 || lengthOf($data['petName']) > 100
    || lengthOf($data['comment']) > 1500 || lengthOf($data['contact']) > 200
    || !contactValid($data['channel'], $data['contact'])) {
    fail(422, 'Перевірте ім’я, дані улюбленця та контакт для обраного каналу зв’язку.');
}
$catalog = json_decode((string) @file_get_contents(__DIR__ . '/booking-catalog.json'), true);
if (!is_array($catalog)) fail(503, 'Онлайн-запис тимчасово недоступний.');
$breedMap = array_column($catalog['breeds'], null, 'id');
$serviceMap = array_column($catalog['services'], null, 'id');
$extraMap = array_column($catalog['extras'], null, 'id');
$breed = $breedMap[$data['breedId']] ?? null;
if ($data['breedId'] !== 'other' && (!$breed || $breed['petType'] !== $data['petType'])) {
    fail(422, 'Оберіть породу для вашого улюбленця.');
}
$service = $serviceMap[$data['serviceId']] ?? null;
if ($data['serviceId'] !== '' && (!$service
    || !in_array($data['petType'], $service['petTypes'], true)
    || ($breed && !in_array($data['serviceId'], $breed['serviceIds'], true)))) {
    fail(422, 'Оберіть доступну послугу для вашого улюбленця.');
}
$weights = ['' => '', 'under-5' => 'до 5 кг', '5-10' => '5–10 кг', '10-15' => '10–15 кг'];
$coats = ['' => '', 'short' => 'коротка шерсть', 'medium' => 'середня шерсть', 'long' => 'довга шерсть'];
if (!isset($weights[$data['weightBand']]) || !isset($coats[$data['coatLength']])
    || !isset($data['extraIds']) || !is_array($data['extraIds']) || count($data['extraIds']) > 10) {
    fail(422, 'Перевірте параметри догляду.');
}
$extraNames = [];
foreach ($data['extraIds'] as $extraId) {
    if (!is_string($extraId) || !isset($extraMap[$extraId])
        || !in_array($data['petType'], $extraMap[$extraId]['petTypes'], true)
        || !in_array($data['serviceId'], $extraMap[$extraId]['serviceIds'], true)) {
        fail(422, 'Перевірте додаткові послуги.');
    }
    $extraNames[] = $extraMap[$extraId]['title'];
}
$reference = strtoupper(substr(str_replace('-', '', $data['requestId']), 0, 12));
$lines = [
    'Нова заявка V.I.Pet · ' . $reference,
    '',
    'Клієнт: ' . $data['customerName'],
    'Улюбленець: ' . $data['petName'],
    'Вид: ' . ($data['petType'] === 'dog' ? 'Собака' : 'Кіт'),
    'Порода: ' . ($breed['label'] ?? 'Інша порода / не знаю'),
    'Догляд: ' . ($service['title'] ?? 'Допоможіть обрати'),
    'Зручний канал зв’язку: ' . $channels[$data['channel']],
    'Контакт клієнта: ' . $data['contact'],
];
if ($data['weightBand'] !== '') $lines[] = 'Вага: ' . $weights[$data['weightBand']];
if ($data['coatLength'] !== '') $lines[] = 'Шерсть: ' . $coats[$data['coatLength']];
if ($extraNames) $lines[] = 'Додатковий догляд: ' . implode(', ', array_unique($extraNames));
if ($data['comment'] !== '') $lines[] = 'Коментар: ' . $data['comment'];
$lines[] = '';
$lines[] = 'Зв’яжіться з клієнтом через обраний канал для погодження дати, часу й вартості.';
$text = implode("\n", $lines);
// Telegram counts UTF-16 units. Keep each request in one readable message.
if (strlen(iconv('UTF-8', 'UTF-16LE', $text)) / 2 > 4096) fail(422, 'Скоротіть коментар до заявки.');

// A single private locked file coordinates retries and rate limits across PHP workers.
// Contains only keyed hashes, timestamps, request IDs and delivery states.
$statePath = dirname($configPath) . '/vipet-booking-state.json';
$previousMask = umask(0077);
$stateFile = @fopen($statePath, 'c+');
umask($previousMask);
if (!$stateFile || !flock($stateFile, LOCK_EX)) fail(503, 'Онлайн-запис тимчасово недоступний.');
@chmod($statePath, 0600);
$stored = stream_get_contents($stateFile);
$state = $stored === '' ? ['requests' => [], 'attempts' => []] : json_decode($stored, true);
if (!is_array($state) || !isset($state['requests'], $state['attempts'])
    || !is_array($state['requests']) || !is_array($state['attempts'])) {
    fail(503, 'Онлайн-запис тимчасово недоступний.');
}
$now = time();
$state['requests'] = array_filter($state['requests'], fn ($entry) => $entry['at'] > $now - 86400);
$state['attempts'] = array_filter($state['attempts'], fn ($entry) => $entry['at'] > $now - 600);
$save = function () use ($stateFile, &$state): void {
    rewind($stateFile);
    $json = json_encode($state);
    if (!ftruncate($stateFile, 0) || fwrite($stateFile, $json) !== strlen($json) || !fflush($stateFile)) {
        fail(503, 'Не вдалося підтвердити стан заявки. Зв’яжіться із салоном.');
    }
};
$fingerprint = hash_hmac('sha256', $text, $config['bot_token']);
$existing = $state['requests'][$data['requestId']] ?? null;
if ($existing) {
    if (!hash_equals($existing['fingerprint'], $fingerprint)) fail(409, 'Оновіть форму для нової заявки.');
    if ($existing['state'] === 'sent') respond(200, ['ok' => true, 'reference' => $reference]);
    fail(409, 'Попереднє надсилання потребує перевірки. Зв’яжіться із салоном, щоб уточнити отримання заявки.');
}
$ip = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', $config['bot_token']);
$attempt = $state['attempts'][$ip] ?? ['count' => 0, 'at' => $now];
if ($attempt['count'] >= 5 || count($state['requests']) >= 10000 || count($state['attempts']) >= 10000) {
    header('Retry-After: 600');
    fail(429, 'Забагато спроб. Спробуйте через 10 хвилин або зв’яжіться із салоном.');
}
$state['attempts'][$ip] = ['count' => $attempt['count'] + 1, 'at' => $attempt['at']];
$state['requests'][$data['requestId']] = ['fingerprint' => $fingerprint, 'state' => 'pending', 'at' => $now];
$save();

$curl = curl_init('https://api.telegram.org/bot' . $config['bot_token'] . '/sendMessage');
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode([
        'chat_id' => $config['chat_id'],
        'text' => $text,
        'link_preview_options' => ['is_disabled' => true],
    ], JSON_UNESCAPED_UNICODE),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 12,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
]);
$response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
$telegram = is_string($response) ? json_decode($response, true) : null;
curl_close($curl);
if ($status === 200 && ($telegram['ok'] ?? false) === true && isset($telegram['result']['message_id'])) {
    $state['requests'][$data['requestId']]['state'] = 'sent';
    $save();
    respond(200, ['ok' => true, 'reference' => $reference]);
}
if (is_array($telegram) && ($telegram['ok'] ?? null) === false) {
    unset($state['requests'][$data['requestId']]);
    $save();
    fail(502, 'Заявку не доставлено. Спробуйте пізніше або зв’яжіться із салоном.');
}
// Keep uncertain delivery marked pending to avoid sending the same enquiry twice.
fail(502, 'Не вдалося підтвердити доставку. Зв’яжіться із салоном, щоб перевірити отримання заявки.');
