package NucleusTeq.College.Level.Counselling.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disable CSRF for API endpoints
            .cors(cors -> {})  // Enable CORS - configurations are picked up from CorsConfig
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/**").permitAll()  // Allow all requests for now (development)
            );
        return http.build();
    }
}