<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all users
    $stmt = $pdo->query("SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();
    jsonResponse($users);
}
?>