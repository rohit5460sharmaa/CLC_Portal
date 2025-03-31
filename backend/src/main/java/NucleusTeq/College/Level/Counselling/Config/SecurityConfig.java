package NucleusTeq.College.Level.Counselling.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disable CSRF for API endpoints
            .cors(cors -> {})  // Enable CORS - configurations are picked up from CorsConfig
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/**").permitAll()  // Allow all requests for now (development)
                .requestMatchers("/api/**").permitAll() // Allow public access to APIs

                .requestMatchers("/api/auth/**").permitAll()  // Allow all auth endpoints
                .requestMatchers("/api/seats/**").permitAll()
                .requestMatchers("/auth/register-student", "/auth/login-student").permitAll()
                .requestMatchers("/api/auth/login").permitAll()  // Public
                .requestMatchers("/api/auth/add-user").hasAuthority("ADMIN")  // Only Admins
                .anyRequest().authenticated()
            );
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

         