<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all books
    if (isset($_GET['search'])) {
        $search = "%{$_GET['search']}%";
        $stmt = $pdo->prepare("SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id WHERE b.title LIKE ? OR b.author LIKE ?");
        $stmt->execute([$search, $search]);
    } else {
        $stmt = $pdo->prepare("SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id");
        $stmt->execute();
    }
    $books = $stmt->fetchAll();
    jsonResponse($books);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add new book
    $data = json_decode(file_get_contents("php://input"), true);
    
    $stmt = $pdo->prepare("INSERT INTO books (title, author, description, price, category_id, cover_image, stock) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['title'],
        $data['author'],
        $data['description'],
        $data['price'],
        $data['category_id'],
        $data['cover_image'],
        $data['stock']
    ]);
    
    jsonResponse(['message' => 'Book added successfully', 'id' => $pdo->lastInsertId()]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update book - PERBAIKAN DI SINI
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    
    if (!$data) {
        parse_str($input, $data);
    }
    
    $stmt = $pdo->prepare("UPDATE books SET title = ?, author = ?, description = ?, price = ?, category_id = ?, cover_image = ?, stock = ? WHERE id = ?");
    $stmt->execute([
        $data['title'],
        $data['author'],
        $data['description'],
        $data['price'],
        $data['category_id'],
        $data['cover_image'],
        $data['stock'],
        $data['id']
    ]);
    
    jsonResponse(['message' => 'Book updated successfully']);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete book
    $id = $_GET['id'];
    
    $stmt = $pdo->prepare("DELETE FROM books WHERE id = ?");
    $stmt->execute([$id]);
    
    jsonResponse(['message' => 'Book deleted successfully']);
}
?>