package com.example.groceryapp.controller;

import com.example.groceryapp.entity.Cart;
import com.example.groceryapp.entity.CartItem;
import com.example.groceryapp.entity.Product;
import com.example.groceryapp.entity.User;
import com.example.groceryapp.repository.CartItemRepository;
import com.example.groceryapp.repository.CartRepository;
import com.example.groceryapp.repository.ProductRepository;
import com.example.groceryapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // =====================================================
    // GET OR CREATE CART FOR LOGGED-IN USER
    // =====================================================
    @PostMapping("/create/{userId}")
    public Cart createOrGetCart(@PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser_Id(userId)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    cart.setTotalAmount(0);
                    cart.setDiscount(0);
                    cart.setFinalAmount(0);
                    return cartRepository.save(cart);
                });
    }

    // =====================================================
    // ADD PRODUCT TO CART
    // =====================================================
    @PostMapping("/{userId}/add/{productId}")
    public Cart addToCart(
            @PathVariable Long userId,
            @PathVariable Long productId,
            @RequestParam int quantity) {

        Cart cart = cartRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        CartItem existingItem =
                cartItemRepository.findByCart_IdAndProduct_Id(cart.getId(), productId);

        if (existingItem != null) {

            int newQuantity = existingItem.getQuantity() + quantity;
            existingItem.setQuantity(newQuantity);
            existingItem.setSubtotal(product.getPrice() * newQuantity);
            cartItemRepository.save(existingItem);

        } else {

            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setSubtotal(product.getPrice() * quantity);
            cartItemRepository.save(item);
        }

        updateCartTotal(cart);

        return cartRepository.save(cart);
    }

    // =====================================================
    // VIEW ONLY USER'S CART
    // =====================================================
    @GetMapping("/{userId}")
    public Cart getUserCart(@PathVariable Long userId) {

        return cartRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    // =====================================================
    // CLEAR CART AFTER ORDER
    // =====================================================
    public void clearCart(Cart cart) {

        List<CartItem> items =
                cartItemRepository.findByCart_Id(cart.getId());

        cartItemRepository.deleteAll(items);

        cart.setTotalAmount(0);
        cart.setDiscount(0);
        cart.setFinalAmount(0);

        cartRepository.save(cart);
    }

    // =====================================================
    // UPDATE TOTAL
    // =====================================================
    private void updateCartTotal(Cart cart) {

        List<CartItem> items =
                cartItemRepository.findByCart_Id(cart.getId());

        double total = items.stream()
                .mapToDouble(CartItem::getSubtotal)
                .sum();

        cart.setTotalAmount(total);

        if (total > 200) {
            cart.setDiscount(25);
        } else {
            cart.setDiscount(0);
        }

        cart.setFinalAmount(total - cart.getDiscount());
    }
}
