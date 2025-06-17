<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($data['action'])) {
        if ($data['action'] === 'register') {
            // Register user
            $username = $data['username'];
            $email = $data['email'];
            $password = password_hash($data['password'], PASSWORD_DEFAULT);
            
            $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
            try {
                $stmt->execute([$username, $email, $password]);
                jsonResponse(['message' => 'User registered successfully']);
            } catch (PDOException $e) {
                jsonResponse(['error' => 'Registration failed: ' . $e->getMessage()], 400);
            }
        } elseif ($data['action'] === 'login') {
            // Login user
            $username = $data['username'];
            $password = $data['password'];
            
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password'])) {
                jsonResponse([
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'role' => $user['role']
                    ]
                ]);
            } else {
                jsonResponse(['error' => 'Invalid username or password'], 401);
            }
        }
    }
}
?>