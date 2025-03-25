package NucleusTeq.College.Level.Counselling.Service;

import NucleusTeq.College.Level.Counselling.model.Student;
import NucleusTeq.College.Level.Counselling.model.User;
import NucleusTeq.College.Level.Counselling.Repository.StudentRepo;
import NucleusTeq.College.Level.Counselling.Repository.UserRepository;
import NucleusTeq.College.Level.Counselling.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private StudentRepo studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String login(String username, String password, String role) {
        if ("STUDENT".equalsIgnoreCase(role)) {
            // Check by Email first, then by Roll Number
            Optional<Student> student = studentRepository.findByEmail(username);
            if (student.isEmpty()) {
                student = studentRepository.findByRollNumber(username);
            }

            if (student.isPresent()) {
                if (passwordEncoder.matches(password, student.get().getPassword())) {
                    return jwtUtil.generateToken(username, "STUDENT");
                }
            }
        } else if ("ADMIN".equalsIgnoreCase(role) || "OFFICER".equalsIgnoreCase(role)) {
            // Check in User table
            Optional<User> user = userRepository.findByEmailAndRole(username, role);
            if (user.isPresent()) {
                if (passwordEncoder.matches(password, user.get().getPassword())) {
                    return jwtUtil.generateToken(username, role);
                }
            }
        }

        throw new RuntimeException("Invalid username, password, or role");
    }

    public User registerUser(String username, String email, String password, String role, String name, String phone, String department) {
        if (userRepository.existsByEmail(email) || userRepository.existsByUsername(username)) {
            throw new RuntimeException("User with this email or username already exists");
        }

        String encodedPassword = passwordEncoder.encode(password);
        User newUser = new User(username, email, encodedPassword, role, name, phone, department);

        return userRepository.save(newUser);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }
}
