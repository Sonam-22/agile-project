export type Domain = {
  domainId: string;
  id? : string;
  domainName: string;
  description?: string;
  roles?: Role[];
};

export type Role = {
  roleName: string;
  id? : string;
  experienceLevel: string;
  technologiesCatalog: string;
}

export type StandardDomain = {
  domainId: string;
  id : string;
  domainName: string;
  standardRoles?: StandardRole[];
};

export type StandardRole = {
  roleName: string;
  id : string;
}