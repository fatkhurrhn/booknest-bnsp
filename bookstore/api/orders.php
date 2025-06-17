<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get orders with filters
    $status = isset($_GET['status']) && $_GET['status'] !== 'all' ? $_GET['status'] : null;
    $search = isset($_GET['search']) ? $_GET['search'] : null;
    $user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
    
    $sql = "SELECT o.*, u.username 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            WHERE 1=1";
    
    $params = [];
    
    if ($status) {
        $sql .= " AND o.status = ?";
        $params[] = $status;
    }
    
    if ($search) {
        $sql .= " AND (u.username LIKE ? OR o.id LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    if ($user_id) {
        $sql .= " AND o.user_id = ?";
        $params[] = $user_id;
    }
    
    $sql .= " ORDER BY o.created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();
    
    // Get order items for each order
    foreach ($orders as &$order) {
        $stmt = $pdo->prepare("SELECT oi.*, b.title, b.author, b.cover_image
                              FROM order_items oi 
                              JOIN books b ON oi.book_id = b.id 
                              WHERE oi.order_id = ?");
        $stmt->execute([$order['id']]);
        $order['items'] = $stmt->fetchAll();
    }
    
    jsonResponse($orders);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create new order
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validate required fields
    if (empty($data['user_id']) || empty($data['items']) || empty($data['shipping_address'])) {
        jsonResponse(['error' => 'Missing required fields'], 400);
        exit;
    }
    
    try {
        $pdo->beginTransaction();
        
        // Calculate total amount
        $total_amount = array_reduce($data['items'], function($sum, $item) {
            return $sum + ($item['price'] * $item['quantity']);
        }, 0);
        
        // Create order
        $stmt = $pdo->prepare("INSERT INTO orders 
                              (user_id, total_amount, shipping_address, status) 
                              VALUES (?, ?, ?, 'pending')");
        $stmt->execute([
            $data['user_id'],
            $total_amount,
            $data['shipping_address']
        ]);
        $order_id = $pdo->lastInsertId();
        
        // Create order items and update book stock
        foreach ($data['items'] as $item) {
            // Add order item
            $stmt = $pdo->prepare("INSERT INTO order_items 
                                  (order_id, book_id, quantity, price) 
                                  VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $order_id,
                $item['book_id'],
                $item['quantity'],
                $item['price']
            ]);
            
            // Update book stock
            $stmt = $pdo->prepare("UPDATE books SET stock = stock - ? WHERE id = ?");
            $stmt->execute([
                $item['quantity'],
                $item['book_id']
            ]);
        }
        
        $pdo->commit();
        
        jsonResponse([
            'message' => 'Order created successfully',
            'order_id' => $order_id
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        jsonResponse(['error' => 'Order failed: ' . $e->getMessage()], 500);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update order status
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (empty($data['id']) || empty($data['status'])) {
        jsonResponse(['error' => 'Order ID and status are required'], 400);
        exit;
    }
    
    $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$data['status'], $data['id']]);
    
    jsonResponse(['message' => 'Order status updated successfully']);
}
?>