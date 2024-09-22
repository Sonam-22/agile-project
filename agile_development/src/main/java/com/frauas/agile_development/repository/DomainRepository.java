package com.frauas.agile_development.repository;

import com.frauas.agile_development.model.StandardDomains;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.io.Serializable;

@Repository
public interface DomainRepository extends JpaRepository<StandardDomains, Serializable> {
  
}
