package com.frauas.agile_development.repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.frauas.agile_development.model.OfferRole;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.io.Serializable;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<OfferRole, Serializable>{

    @Query("SELECT o FROM OfferRole o JOIN o.provider p WHERE p.offerId = :offerId")
    Optional<OfferRole> findByProviderOfferId(@Param("offerId") String offerId);


}
