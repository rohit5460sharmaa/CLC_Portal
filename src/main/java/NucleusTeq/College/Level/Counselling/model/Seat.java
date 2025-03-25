package NucleusTeq.College.Level.Counselling.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seat")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "branch", nullable = false, unique = true)
    private String branch;

    @Column(name = "general_seats", nullable = false)
    private int generalSeats;

    @Column(name = "obc_seats", nullable = false)
    private int obcSeats;

    @Column(name = "sc_seats", nullable = false)
    private int scSeats;

    @Column(name = "st_seats", nullable = false)
    private int stSeats;

    @Column(name = "filled_general_seats", nullable = false)
    private int filledGeneralSeats;

    @Column(name = "filled_obc_seats", nullable = false)
    private int filledObcSeats;

    @Column(name = "filled_sc_seats", nullable = false)
    private int filledScSeats;

    @Column(name = "filled_st_seats", nullable = false)
    private int filledStSeats;

    @Column(name = "total_seats", nullable = false)
    private int totalSeats;

    @Column(name = "vacant_seats", nullable = false)
    private int vacantSeats;

    // Calculate total seats
    public int calculateTotalSeats() {
        return generalSeats + obcSeats + scSeats + stSeats;
    }

    // Calculate filled seats
    public int calculateFilledSeats() {
        return filledGeneralSeats + filledObcSeats + filledScSeats + filledStSeats;
    }

    // Calculate vacant seats
    public int calculateVacantSeats() {
        return calculateTotalSeats() - calculateFilledSeats();
    }

    @PrePersist
    @PreUpdate
    public void updateSeatCounts() {
        this.totalSeats = calculateTotalSeats();
        this.vacantSeats = calculateVacantSeats();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public int getGeneralSeats() { return generalSeats; }
    public void setGeneralSeats(int generalSeats) { this.generalSeats = generalSeats; }

    public int getObcSeats() { return obcSeats; }
    public void setObcSeats(int obcSeats) { this.obcSeats = obcSeats; }

    public int getScSeats() { return scSeats; }
    public void setScSeats(int scSeats) { this.scSeats = scSeats; }

    public int getStSeats() { return stSeats; }
    public void setStSeats(int stSeats) { this.stSeats = stSeats; }

    public int getFilledGeneralSeats() { return filledGeneralSeats; }
    public void setFilledGeneralSeats(int filledGeneralSeats) { this.filledGeneralSeats = filledGeneralSeats; }

    public int getFilledObcSeats() { return filledObcSeats; }
    public void setFilledObcSeats(int filledObcSeats) { this.filledObcSeats = filledObcSeats; }

    public int getFilledScSeats() { return filledScSeats; }
    public void setFilledScSeats(int filledScSeats) { this.filledScSeats = filledScSeats; }

    public int getFilledStSeats() { return filledStSeats; }
    public void setFilledStSeats(int filledStSeats) { this.filledStSeats = filledStSeats; }

    public int getTotalSeats() { return totalSeats; }
    public int getVacantSeats() { return vacantSeats; }

    @Override
    public String toString() {
        return "Seat{" +
                "id=" + id +
                ", branch='" + branch + '\'' +
                ", totalSeats=" + totalSeats +
                ", vacantSeats=" + vacantSeats +
                ", filledSeats=" + calculateFilledSeats() +
                '}';
    }
}
