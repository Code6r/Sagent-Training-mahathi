package com.example.groceryapp.repository;

import com.example.groceryapp.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCart_Id(Long cartId);

    CartItem findByCart_IdAndProduct_Id(Long cartId, Long productId);
}
