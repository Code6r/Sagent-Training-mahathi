package com.habittrack.controller;

import com.habittrack.entity.User;
import com.habittrack.repository.UserRepository;
import com.habittrack.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService service;
    private final UserRepository repo;

    public UserController(UserService service, UserRepository repo){
        this.service = service;
        this.repo = repo;
    }

    // ── Auth endpoints ──────────────────────────────────────────

    /** POST /api/users/signup  { name, email, password } → { token, user } */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user){
        // Check if email already exists
        if (repo.findByEmail(user.getEmail()).isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }
        User saved = service.create(user);
        return ResponseEntity.ok(buildAuthResponse(saved));
    }

    /** POST /api/users/login  { email, password } → { token, user } */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body){
        String email    = body.get("email");
        String password = body.get("password");
        Optional<User> found = repo.findByEmailAndPassword(email, password);
        if (found.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
        return ResponseEntity.ok(buildAuthResponse(found.get()));
    }

    // ── CRUD endpoints ──────────────────────────────────────────

    @GetMapping
    public List<User> getAll(){ return service.getAll(); }

    @GetMapping("/{id}")
    public User getById(@PathVariable(name = "id") Long id){ return service.getById(id); }

    @PostMapping
    public User create(@RequestBody User user){ return service.create(user); }

    @PutMapping("/{id}")
    public User update(@PathVariable(name = "id") Long id, @RequestBody User user){
        return service.update(id, user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable(name = "id") Long id){ service.delete(id); }

    // ── Helper ──────────────────────────────────────────────────

    private Map<String, Object> buildAuthResponse(User user){
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getUserId());
        userMap.put("userId", user.getUserId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", "jwt-token-" + user.getUserId());
        response.put("user", userMap);
        return response;
    }
}