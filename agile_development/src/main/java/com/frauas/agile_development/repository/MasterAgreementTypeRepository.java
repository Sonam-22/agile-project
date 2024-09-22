package com.frauas.agile_development.repository;

import com.frauas.agile_development.model.MasterAgreementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MasterAgreementTypeRepository extends JpaRepository<MasterAgreementType,Integer> {
}
