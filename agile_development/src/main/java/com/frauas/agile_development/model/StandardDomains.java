package com.frauas.agile_development.model;


import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Entity
@Data
public class StandardDomains {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String domainId;
	private String domainName;
	@OneToMany(cascade = CascadeType.ALL)
	List<StandardRoles> standardRoles;

}
