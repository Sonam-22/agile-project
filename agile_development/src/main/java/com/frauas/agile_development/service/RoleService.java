package com.frauas.agile_development.service;

import java.util.List;

import com.frauas.agile_development.model.StandardDomains;
import com.frauas.agile_development.model.StandardRoles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.frauas.agile_development.model.Role;
import com.frauas.agile_development.repository.RoleRepository;

@Service
public class RoleService {
  
  @Autowired
  private RoleRepository roleRepository;

  public List<StandardRoles> getAllRoles() {
    return roleRepository.findAll();
  }

  public List<StandardRoles> addStdRoles(List<StandardRoles> roles) {
   return roleRepository.saveAll(roles);
  }
}
