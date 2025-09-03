<?php
header('Content-Type: application/json; charset=UTF-8');

$file  = __DIR__ . '/responses.json';
$TOKEN = 'marcepan'; // ten sam co w ?token=...

$action = $_GET['action'] ?? '';

function load_all($file){
  if (!file_exists($file)) return [];
  $json = file_get_contents($file);
  $data = json_decode($json, true);
  return is_array($data) ? $data : [];
}

if ($action === 'save') {
  $payload = json_decode(file_get_contents('php://input'), true) ?? [];

  // >>> TU JEST KLUCZ: pełna lista dozwolonych pól <<<
  $allowed = [
    'id','timestamp',
    'q1','q1_other',
    'q2','q2_other',
    'q3',
    'q4','q4_other',
    'q5','q5_other',
    'q6','q6_other',
    'q7','q8','q9',
    'q10','q10_other'
  ];

  $row = array_intersect_key($payload, array_flip($allowed));
  if (empty($row)) {
    echo json_encode(['ok'=>false,'error'=>'Brak danych do zapisu']); exit;
  }

  $all = load_all($file);
  $all[] = $row;
  file_put_contents($file, json_encode($all, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));

  echo json_encode(['ok'=>true]); exit;
}

if ($action === 'list') {
  $token = $_GET['token'] ?? '';
  if ($token !== $TOKEN) { echo json_encode(['ok'=>false,'error'=>'Zły token']); exit; }

  $all = load_all($file);
  echo json_encode(['ok'=>true,'data'=>$all]); exit;
}

if ($action === 'clear') {
  // application/x-www-form-urlencoded
  parse_str(file_get_contents('php://input'), $post);
  if (($post['token'] ?? '') !== $TOKEN) { echo json_encode(['ok'=>false,'error'=>'Zły token']); exit; }

  file_put_contents($file, json_encode([], JSON_UNESCAPED_UNICODE));
  echo json_encode(['ok'=>true]); exit;
}

echo json_encode(['ok'=>false,'error'=>'Nieznana akcja']);
