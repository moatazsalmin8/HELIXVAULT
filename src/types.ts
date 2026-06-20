/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- CORE DNA ENGINE TYPES ---
export interface DNASequenceReport {
  sequenceId: string;
  originalName: string;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  compressionRatio: number; // original / compressed
  nucleotideCount: number; // length of ACTG sequence
  oligoCount: number; // number of chunked strands (fragments)
  gcContent: number; // percentage of G and C (crucial for physical biological synthesizability!)
  homopolymerMaxRun: number; // longest repeating sequence (e.g. AAAAA)
  redundancyOverhead: number; // percentage of size added for parity error correction
  durationMs: number; // processing speed
  integrityScore: number; // score from 0 to 100 based on biological stability
}

export interface DNAOligo {
  index: number;
  header: string; // binary index metadata
  sequence: string; // DNA payload fragment (A, C, T, G)
  parity: string; // error detection/correction nucleotide
}

// --- DIGITAL ARCHIVE MANAGEMENT ---
export interface DNAArchive {
  id: string;
  name: string;
  fileMimeType: string;
  originalSizeBytes: number;
  nucleotideLength: number;
  fastaString: string; // Bioinformatics standard format
  createdAt: string;
  status: 'SAFE' | 'DEGRADED' | 'RESTORING' | 'CORRUPTED';
  encryptionStandard: string; // "AES-256GCM + DNA Payload Coding"
  isArchived: boolean;
  providerId: string; // ID of simulated target provider
  nucleotideData: string; // Concatenated full DNA stream
  sourceBinary?: string; // Original binary payload for lossless decode round-trip
}

export interface RetrievalSimulationLog {
  id: string;
  archiveId: string;
  timestamp: string;
  simulatedDecayRate: number; // percent mutated
  mutationsDetected: number; // count of nucleotide flips
  mutationsCorrected: number; // restored successfully via Reed-Solomon/Parity
  success: boolean;
  durationMs: number;
  retrievedPayloadPreview: string;
}

// --- FUTURE DNA PARTNER INTEGRATOR LAYER ---
export type ProviderID = 
  | 'twist-bioscience' 
  | 'genscript' 
  | 'idt-dna' 
  | 'biomemory' 
  | 'atlas-data' 
  | 'oxford-nanopore' 
  | 'illumina';

export interface DNAProviderConfig {
  id: ProviderID;
  name: string;
  type: 'SYNTHESIS' | 'SEQUENCING' | 'HYBRID' | 'FACILITY';
  status: 'ONLINE' | 'MAINTENANCE' | 'DEVELOPMENT';
  synthesisCostPerBaseUSD: number;
  sequencingCostPerBaseUSD: number;
  turnaroundTimeDays: number;
  authorizedApis: string[];
  maxOligoLength: number; // Max nucleotides per physical DNA segment (typically 120-200)
  errorRate: number; // baseline physical chemical error rate (e.g., 0.001)
  supportedVials: string[]; // ['Vial', '96-well plate', 'Microchip']
}

export interface ProviderSynthesisJob {
  jobId: string;
  archiveId: string;
  providerId: ProviderID;
  sequenceLength: number;
  costUSD: number;
  status: 'PENDING_BIOSECURITY' | 'SYNTHESIZING' | 'QUALITY_CONTROL' | 'SHIPPED_TO_FACILITY' | 'COMPLETED' | 'FAILED';
  biosecurityPass: boolean;
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
}

// --- DNA STORAGE MARKETPLACE TYPES ---
export interface MarketplaceProviderListing {
  id: string;
  providerId: ProviderID;
  displayName: string;
  description: string;
  ratingAverage: number;
  ratingCount: number;
  isVerified: boolean;
  locationCountry: string;
  tags: string[];
  complianceCertifications: string[]; // ['HIPAA', 'ISO-13485', 'CLIA', 'SOC2']
  throughputCapacityGbPerDay: number;
}

export interface ProviderRating {
  id: string;
  providerId: ProviderID;
  userEmail: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

// --- REVENUE & BILLING MODELS ---
export type SubscriptionTier = 'STARTER' | 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE';

export interface SubscriptionConfig {
  id: SubscriptionTier;
  name: string;
  priceMonthlyUSD: number;
  baseStorageGB: number;
  includedSequences: number;
  overageCostPerNucleotide: number;
  features: string[];
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  userEmail: string;
  tier: SubscriptionTier;
  itemizedCharges: {
    description: string;
    amountUSD: number;
    usageQty?: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'PAID' | 'UNPAID' | 'REFUNDED';
  date: string;
}

// --- INVESTOR & SAAS PERFORMANCE METRICS ---
export interface SaaSMetrics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  activeUsers: number;
  ltvUSD: number; // Lifetime Value
  cacUSD: number; // Customer Acquisition Cost
  churnRatePercent: number;
  totalDataEncodedGb: number;
  totalNucleotidesSynthesized: number;
  marketplaceTakeRatePercent: number;
  marketplaceARR: number;
  unitEconomicsProfitMargin: number; // percent profit margin
}

export interface ComplianceStandard {
  id: string;
  name: string;
  description: string;
  status: 'COMPLIANT' | 'PENDING' | 'NOT_APPLICABLE';
  lastCheckedDate: string;
  evidenceLink?: string;
}
