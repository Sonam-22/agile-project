package com.frauas.agile_development.repository;

import com.frauas.agile_development.model.StandardRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.frauas.agile_development.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<StandardRoles, Integer> {

}
