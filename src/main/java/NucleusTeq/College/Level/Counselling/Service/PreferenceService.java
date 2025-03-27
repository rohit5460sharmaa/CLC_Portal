package NucleusTeq.College.Level.Counselling.Service;

import NucleusTeq.College.Level.Counselling.model.Preference;
import jakarta.transaction.Transactional;
import NucleusTeq.College.Level.Counselling.Repository.PreferenceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PreferenceService {

    private final PreferenceRepository preferenceRepository;

    public PreferenceService(PreferenceRepository preferenceRepository) {
        this.preferenceRepository = preferenceRepository;
    }

    public Preference savePreference(String studentName, String rollNumber, int rank, String category, List<String> branches) {
        if (studentName == null || rollNumber == null || branches == null || branches.isEmpty()) {
            throw new IllegalArgumentException("Student name, roll number, and branches cannot be null or empty");
        }
        String branchList = String.join(",", branches);
        Preference preference = new Preference(studentName, rollNumber, rank, category, branchList);
        return preferenceRepository.save(preference);
    }


    public List<Preference> getAllPreferences() {
        return preferenceRepository.findAll();
    }

    public Preference getPreferenceByRollNumber(String rollNumber) {
        return preferenceRepository.findByRollNumber(rollNumber).orElse(null);
    }

    public void deletePreference(Long id) {
        if (preferenceRepository.existsById(id)) {
            preferenceRepository.deleteById(id);
        } else {
            throw new RuntimeException("Preference not found with id: " + id);
        }
    }
    

    @Transactional
    public void deleteByRollNumber(String rollNumber) {
        preferenceRepository.deleteByRollNumber(rollNumber);
    }

}
