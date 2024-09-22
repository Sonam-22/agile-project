import { Domain } from "../../types";

export type ProviderType = {
  providerId?: number;
  providerName: string;
  existsSince: string;
  address: string;
  validFrom: string;
  validUntil: string;
  isAccepted: string;
  experienceLevel: string;
  technologyLevel: string;
  price: number;
  userName: string;
  userType: string;
  domains: Domain[];
};