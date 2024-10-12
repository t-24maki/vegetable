<?php
header("Content-Type: application/json");

$data_directory = __DIR__ . '/'; // サーバー上のデータ保存ディレクトリ

// POSTリクエスト（データの書き込み）の処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (isset($data['file_name']) && isset($data['data'])) {
        $file_name = basename($data['file_name']); // ファイル名のサニタイズ
        $file_path = $data_directory . $file_name;

        if (file_put_contents($file_path, $data['data']) !== false) {
            echo json_encode(["message" => "File saved successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save file"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid data format"]);
    }
}

// GETリクエスト（データの読み込み）の処理
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['file_name'])) {
        $file_name = basename($_GET['file_name']); // ファイル名のサニタイズ
        $file_path = $data_directory . $file_name;

        if (file_exists($file_path)) {
            $data = file_get_contents($file_path);
            echo $data;
        } else {
            http_response_code(404);
            echo json_encode(["error" => "File not found"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "File name not provided"]);
    }
}

// その他のHTTPメソッドの処理
else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>