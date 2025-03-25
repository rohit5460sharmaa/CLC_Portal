package NucleusTeq.College.Level.Counselling.Controller;

import NucleusTeq.College.Level.Counselling.model.Student;
import NucleusTeq.College.Level.Counselling.model.User;
import NucleusTeq.College.Level.Counselling.DTOs.AuthRequest;
import NucleusTeq.College.Level.Counselling.DTOs.AuthResponse;
import NucleusTeq.College.Level.Counselling.Repository.StudentRepo;
import NucleusTeq.College.Level.Counselling.Repository.UserRepository;
import NucleusTeq.College.Level.Counselling.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentRepo studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        String username = authRequest.getUsername();
        String password = authRequest.getPassword();

        Optional<Student> student = studentRepository.findByEmailOrRollNumber(username, username);
        if (student.isPresent() && passwordEncoder.matches(password, student.get().getPassword())) {
            String token = jwtUtil.generateToken(username, "STUDENT");
            return ResponseEntity.ok(new AuthResponse(token, "STUDENT"));
        }

        Optional<User> user = userRepository.findByEmail(username);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            String token = jwtUtil.generateToken(username, user.get().getRole());
            return ResponseEntity.ok(new AuthResponse(token, user.get().getRole()));
        }

        return ResponseEntity.status(401).body("Invalid Credentials");
    }

    @PostMapping("/add-user")
    public ResponseEntity<?> addUser(@RequestBody User user, @RequestHeader("Authorization") String token) {
        String adminRole = jwtUtil.extractRole(token.substring(7));
        if (!"ADMIN".equals(adminRole)) {
            return ResponseEntity.status(403).body("Access Denied. Only Admins can add users.");
        }

        if (user.getUsername() == null || user.getEmail() == null || user.getPassword() == null || user.getRole() == null) {
            return ResponseEntity.badRequest().body("All fields (username, email, password, role) are required.");
        }

        if (!user.getRole().equals("OFFICER") && !user.getRole().equals("ADMIN")) {
            return ResponseEntity.badRequest().body("Invalid role. Allowed roles: OFFICER, ADMIN.");
        }

        if (userRepository.existsByEmail(user.getEmail()) || userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("User with this email or username already exists.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);

        userRepository.save(user);
        return ResponseEntity.ok("User created successfully with role: " + user.getRole());
    }

    @PostMapping("/generate-admin-token")
    public ResponseEntity<?> generateAdminToken() {
        String adminToken = jwtUtil.generateAdminToken("admin@example.com");
        System.out.println("Token is: " + adminToken);
        return ResponseEntity.ok("Admin Token: " + adminToken);
    }

    @DeleteMapping("/remove-officer")
    public ResponseEntity<?> removeOfficer(@RequestParam String username, @RequestHeader("Authorization") String token) {
        String adminRole = jwtUtil.extractRole(token.substring(7));
        if (!"ADMIN".equals(adminRole)) {
            return ResponseEntity.status(403).body("Access Denied. Only Admins can remove officers.");
        }

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty() || !"OFFICER".equals(user.get().getRole())) {
            return ResponseEntity.badRequest().body("Officer not found.");
        }

        userRepository.delete(user.get());
        return ResponseEntity.ok("Officer removed successfully.");
    }

    @GetMapping("/get-all-officers")
    public ResponseEntity<?> getAllOfficers(@RequestHeader("Authorization") String token) {
        String adminRole = jwtUtil.extractRole(token.substring(7));
        if (!"ADMIN".equals(adminRole)) {
            return ResponseEntity.status(403).body("Access Denied. Only Admins can view all officers.");
        }

        List<User> officers = userRepository.findByRole("OFFICER");
        return ResponseEntity.ok(officers);
    }

    @PutMapping("/update-officer")
    public ResponseEntity<?> updateOfficer(@RequestBody User updatedUser, @RequestHeader("Authorization") String token) {
        String role = jwtUtil.extractRole(token.substring(7));
        String email = jwtUtil.extractUsername(token.substring(7));

        if ("OFFICER".equals(role) && !email.equals(updatedUser.getEmail())) {
            return ResponseEntity.status(403).body("Access Denied. Officers can only update their own profile.");
        }

        if ("ADMIN".equals(role) || ("OFFICER".equals(role) && email.equals(updatedUser.getEmail()))) {
            Optional<User> userOptional = userRepository.findByEmail(updatedUser.getEmail());

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found.");
            }

            User user = userOptional.get();
            user.setUsername(updatedUser.getUsername());
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            userRepository.save(user);

            return ResponseEntity.ok("User updated successfully.");
        }

        return ResponseEntity.status(403).body("Access Denied.");
    }
}
