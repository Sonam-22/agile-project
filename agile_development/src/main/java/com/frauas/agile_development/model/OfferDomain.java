package com.frauas.agile_development.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class OfferDomain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String domainId;
    private String domainName;

    private float rolepriceaverage;

}
