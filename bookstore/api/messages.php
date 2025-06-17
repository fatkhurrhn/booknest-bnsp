<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all messages with optional limit
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
    
    $sql = "SELECT m.*, u.username 
            FROM messages m 
            LEFT JOIN users u ON m.user_id = u.id 
            ORDER BY m.created_at DESC";
    
    if ($limit) {
        $sql .= " LIMIT " . $limit;
    }
    
    $stmt = $pdo->query($sql);
    $messages = $stmt->fetchAll();
    
    jsonResponse($messages);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create new message
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Basic validation
    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        jsonResponse(['error' => 'All fields are required'], 400);
        exit;
    }
    
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => 'Invalid email format'], 400);
        exit;
    }
    
    $stmt = $pdo->prepare("INSERT INTO messages (user_id, name, email, message) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        isset($data['user_id']) ? $data['user_id'] : null,
        $data['name'],
        $data['email'],
        $data['message']
    ]);
    
    jsonResponse(['message' => 'Message sent successfully']);
}
?>