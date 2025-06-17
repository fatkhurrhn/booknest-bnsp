<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all categories
    $stmt = $pdo->query("SELECT * FROM categories");
    $categories = $stmt->fetchAll();
    jsonResponse($categories);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add new category (admin only)
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (?)");
    $stmt->execute([$data['name']]);

    jsonResponse(['message' => 'Category added successfully']);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update category (admin only)
    parse_str(file_get_contents("php://input"), $data);

    $stmt = $pdo->prepare("UPDATE categories SET name = ? WHERE id = ?");
    $stmt->execute([$data['name'], $data['id']]);

    jsonResponse(['message' => 'Category updated successfully']);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete category (admin only)
    $id = $_GET['id'];

    $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['message' => 'Category deleted successfully']);
}
