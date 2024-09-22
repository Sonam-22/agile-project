package com.frauas.agile_development.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.frauas.agile_development.model.Provider;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Integer> {

    @Query("SELECT o FROM Provider o " +

            "JOIN o.domains d " +
            "JOIN d.roles r " +
            "WHERE o.providerName = :providerName " +
            "AND d.domainId = :domainId " +
            "AND r.roleName = :roleName")
    Optional<Provider> findByProviderNameAndDomainIdAndRoleName(
            @Param("providerName") String providerName,
            @Param("domainId") String domainId,
            @Param("roleName") String roleName);

}
