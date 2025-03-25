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
            return ResponseEntity.ok(new AuthResponse(token, "STUDENT")); // Include userType
        }

        Optional<User> user = userRepository.findByEmail(username);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            String token = jwtUtil.generateToken(username, user.get().getRole());
            return ResponseEntity.ok(new AuthResponse(token, user.get().getRole())); // Include userType
        }

        return ResponseEntity.status(401).body("Invalid Credentials");
    }

}
