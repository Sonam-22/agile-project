package com.frauas.agile_development.model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

public enum StandardTechCatalog implements Serializable {
    COMMON,
    UNCOMMON,
    RARE
}

