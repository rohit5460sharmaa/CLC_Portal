package NucleusTeq.College.Level.Counselling.JWT;

import java.util.Base64;
import javax.crypto.SecretKey;
import javax.crypto.KeyGenerator;

public class JwtSecretKeyGenerator {
    public static void main(String[] args) throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
        keyGen.init(256); // Set key size
        SecretKey secretKey = keyGen.generateKey();
        String encodedKey = Base64.getEncoder().encodeToString(secretKey.getEncoded());

        System.out.println("Generated Secret Key: " + encodedKey);
    }
}
