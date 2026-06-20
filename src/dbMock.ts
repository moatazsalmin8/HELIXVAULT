/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { DNAArchive, RetrievalSimulationLog, ProviderSynthesisJob, MarketplaceProviderListing, ProviderRating, BillingInvoice, SaaSMetrics, SubscriptionConfig, SubscriptionTier } from './types';
import { DNACodecEngine } from './dnaEngine';

interface PersistedStore {
  archives: DNAArchive[];
  logs: RetrievalSimulationLog[];
  jobs: ProviderSynthesisJob[];
  listings: MarketplaceProviderListing[];
  ratings: ProviderRating[];
  invoices: BillingInvoice[];
  currentTier: SubscriptionTier;
  currentEmail: string;
}

export class HelixDatabase {
  private static readonly STORE_PATH = path.join(process.cwd(), '.helixvault-data', 'store.json');

  private static archives: DNAArchive[] = [];
  private static logs: RetrievalSimulationLog[] = [];
  private static jobs: ProviderSynthesisJob[] = [];
  private static listings: MarketplaceProviderListing[] = [];
  private static ratings: ProviderRating[] = [];
  private static invoices: BillingInvoice[] = [];
  
  public static currentTier: SubscriptionTier = 'PROFESSIONAL';
  public static currentEmail: string = 'moatazsalmin@gmail.com';

  private static tryLoadFromDisk(): boolean {
    try {
      if (typeof process === 'undefined' || !process.versions?.node) return false;
      if (!fs.existsSync(this.STORE_PATH)) return false;

      const data = JSON.parse(fs.readFileSync(this.STORE_PATH, 'utf-8')) as PersistedStore;
      this.archives = data.archives ?? [];
      this.logs = data.logs ?? [];
      this.jobs = data.jobs ?? [];
      this.listings = data.listings ?? [];
      this.ratings = data.ratings ?? [];
      this.invoices = data.invoices ?? [];
      this.currentTier = data.currentTier ?? 'PROFESSIONAL';
      this.currentEmail = data.currentEmail ?? 'moatazsalmin@gmail.com';
      return true;
    } catch (e) {
      console.warn('[HelixDatabase] Failed to load persisted store, re-seeding:', e);
      return false;
    }
  }

  private static persist(): void {
    try {
      if (typeof process === 'undefined' || !process.versions?.node) return;

      const dir = path.dirname(this.STORE_PATH);
      fs.mkdirSync(dir, { recursive: true });

      const snapshot: PersistedStore = {
        archives: this.archives,
        logs: this.logs,
        jobs: this.jobs,
        listings: this.listings,
        ratings: this.ratings,
        invoices: this.invoices,
        currentTier: this.currentTier,
        currentEmail: this.currentEmail,
      };

      fs.writeFileSync(this.STORE_PATH, JSON.stringify(snapshot, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[HelixDatabase] Failed to persist store:', e);
    }
  }

  static {
    if (!HelixDatabase.tryLoadFromDisk()) {
    // SEED INITIAL HISTORICAL DIGITAL ARCHIVES
    const seed1Text = "VOYAGER GOLDEN RECORD. Greetings from Earth. Music of the Spheres. Bach, Mozart, Chuck Berry. We are attempting to survive our time so we may live into yours.";
    const seed1Bin = DNACodecEngine.compressTextToBinary(seed1Text);
    const seed1Nuc = DNACodecEngine.binaryToNucleotides(seed1Bin);
    const oligos1 = DNACodecEngine.createOligos(seed1Nuc);
    
    const seed2Text = "MAGNA CARTA (1215). No free man shall be seized or imprisoned, or stripped of his rights or possessions, except by the lawful judgment of his equals.";
    const seed2Bin = DNACodecEngine.compressTextToBinary(seed2Text);
    const seed2Nuc = DNACodecEngine.binaryToNucleotides(seed2Bin);
    const oligos2 = DNACodecEngine.createOligos(seed2Nuc);

    const seed3Text = "HUMAN GENOME MITOCHONDRIAL RECORD (draft v1). ATGCATGCATGCATGCATGC... Chromosome 21 select indicators for biological preservation. Security sequence clearance cleared.";
    const seed3Bin = DNACodecEngine.compressTextToBinary(seed3Text);
    const seed3Nuc = DNACodecEngine.binaryToNucleotides(seed3Bin);
    const oligos3 = DNACodecEngine.createOligos(seed3Nuc);

    this.archives = [
      {
        id: 'arc_voyager',
        name: 'Voyager_Golden_Record_Metadata.txt',
        fileMimeType: 'text/plain',
        originalSizeBytes: seed1Text.length,
        nucleotideLength: seed1Nuc.length,
        fastaString: `>Voyager_Metadata nucleotide_length=${seed1Nuc.length}\n${seed1Nuc.match(/.{1,80}/g)?.join('\n') || seed1Nuc}`,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        status: 'SAFE',
        encryptionStandard: 'AES-256GCM + Alternate Nucleotide Code',
        isArchived: true,
        providerId: 'biomemory',
        nucleotideData: seed1Nuc,
        sourceBinary: seed1Bin,
      },
      {
        id: 'arc_magnacarta',
        name: 'Magna_Carta_Core_Principles.md',
        fileMimeType: 'text/markdown',
        originalSizeBytes: seed2Text.length,
        nucleotideLength: seed2Nuc.length,
        fastaString: `>Magna_Carta_Core_Principles nucleotide_length=${seed2Nuc.length}\n${seed2Nuc.match(/.{1,80}/g)?.join('\n') || seed2Nuc}`,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        status: 'SAFE',
        encryptionStandard: 'AES-256GCM + Alternate Nucleotide Code',
        isArchived: true,
        providerId: 'twist-bioscience',
        nucleotideData: seed2Nuc,
        sourceBinary: seed2Bin,
      },
      {
        id: 'arc_mitochondria',
        name: 'Human_Mitochondrial_DNA_Draft.fasta',
        fileMimeType: 'text/plain',
        originalSizeBytes: seed3Text.length,
        nucleotideLength: seed3Nuc.length,
        fastaString: `>Human_Mitochondria_Draft nucleotide_length=${seed3Nuc.length}\n${seed3Nuc.match(/.{1,80}/g)?.join('\n') || seed3Nuc}`,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        status: 'DEGRADED',
        encryptionStandard: 'AES-256GCM + Alternate Nucleotide Code',
        isArchived: true,
        providerId: 'genscript',
        nucleotideData: seed3Nuc,
        sourceBinary: seed3Bin,
      }
    ];

    // SEED INITIAL PROVIDER MARKETPLACE LISTINGS
    this.listings = [
      {
        id: 'lst_twist',
        providerId: 'twist-bioscience',
        displayName: 'Twist Bioscience Silicon-DNA',
        description: 'Twist Bioscience utilizes custom silicon platforms to write high-density oligonucleotides cheaply and structurally, certified for long-term vault archival.',
        ratingAverage: 4.8,
        ratingCount: 142,
        isVerified: true,
        locationCountry: 'United States',
        tags: ['Silicon Array', 'High Density', 'Biomedical standard'],
        complianceCertifications: ['SOC2', 'ISO-13485', 'CLIA'],
        throughputCapacityGbPerDay: 2.5
      },
      {
        id: 'lst_genscript',
        providerId: 'genscript',
        displayName: 'GenScript Molecular Synthesizers',
        description: 'Proprietary enzyme-driven DNA write technologies. Excellent for custom, bio-shield protected DNA microplates with biosecurity pathogen screening pre-clearance.',
        ratingAverage: 4.6,
        ratingCount: 98,
        isVerified: true,
        locationCountry: 'Singapore',
        tags: ['Enzymatic Synthesis', 'Rapid Production', 'Threat Cleared'],
        complianceCertifications: ['ISO-9001', 'SOC2', 'HIPAA'],
        throughputCapacityGbPerDay: 4.0
      },
      {
        id: 'lst_biomemory',
        providerId: 'biomemory',
        displayName: 'Biomemory Smart-Card Storage',
        description: 'Specializes in durable, non-liquid DNA storage encapsulated in biological microchips with integrated NFC controllers, capable of centuries of shelf durability.',
        ratingAverage: 4.9,
        ratingCount: 37,
        isVerified: true,
        locationCountry: 'France',
        tags: ['Room Temperature', 'NFC Sync', 'Carbon Negative'],
        complianceCertifications: ['CE Mark', 'SOC2', 'ISO-14001'],
        throughputCapacityGbPerDay: 1.0
      },
      {
        id: 'lst_idt',
        providerId: 'idt-dna',
        displayName: 'Integrated DNA Technologies (IDT)',
        description: 'Rapid turnaround physical synthesis using trusted chemical plate synthesis. Ideal for smaller research data archiving iterations with high precision accuracy.',
        ratingAverage: 4.7,
        ratingCount: 220,
        isVerified: true,
        locationCountry: 'United States',
        tags: ['Chemical Plates', 'Sub-week Delivery', 'High Purity'],
        complianceCertifications: ['ISO-13485', 'CLIA', 'SOC2'],
        throughputCapacityGbPerDay: 5.5
      }
    ];

    // SEED SIMULATED PROVIDER RATINGS
    this.ratings = [
      {
        id: 'rt_1',
        providerId: 'twist-bioscience',
        userEmail: 'genomics-director@stanford.edu',
        rating: 5,
        comment: 'Outstanding synthesis consistency. The nucleotide pools arrived in perfect preservation with excellent GC balancing.',
        date: '2026-05-12T14:32:00Z'
      },
      {
        id: 'rt_2',
        providerId: 'biomemory',
        userEmail: 'archivist@louvre.fr',
        rating: 5,
        comment: 'We encoded 15 high-res digital maps of the Louvre archives. Undergoing decay chambers, we experienced 100% data recovery.',
        date: '2026-06-01T09:12:00Z'
      },
      {
        id: 'rt_3',
        providerId: 'genscript',
        userEmail: 'compliance@pharma-pfizer.com',
        rating: 4,
        comment: 'Biosecurity checks are highly detailed. It flagged a false positive in one of our test encrypted strings but resolved in 24 hours.',
        date: '2026-06-14T11:45:00Z'
      }
    ];

    // SEED STRIPE BILLING INVOICES
    this.invoices = [
      {
        id: 'inv_1',
        invoiceNumber: 'INV-2026-001',
        userEmail: this.currentEmail,
        tier: 'PROFESSIONAL',
        itemizedCharges: [
          { description: 'Professional Plan Subscription (June 2026)', amountUSD: 249.00 },
          { description: 'DNA encoding activity (12,450 nucleotides generated)', amountUSD: 62.25, usageQty: 12450 },
          { description: 'Decay Simulation and recovery runs (5 retrieval logs)', amountUSD: 0.00 }
        ],
        subtotal: 311.25,
        tax: 24.90,
        total: 336.15,
        status: 'PAID',
        date: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'inv_2',
        invoiceNumber: 'INV-2026-002',
        userEmail: this.currentEmail,
        tier: 'PROFESSIONAL',
        itemizedCharges: [
          { description: 'Professional Plan Subscription (May 2026)', amountUSD: 249.00 },
          { description: 'DNA encoding activity (8,120 nucleotides generated)', amountUSD: 40.60, usageQty: 8120 }
        ],
        subtotal: 289.60,
        tax: 23.17,
        total: 312.77,
        status: 'PAID',
        date: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // SEED RETRIEVAL LOGS
    this.logs = [
      {
        id: 'log_seed_1',
        archiveId: 'arc_voyager',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        simulatedDecayRate: 2.5,
        mutationsDetected: 14,
        mutationsCorrected: 14,
        success: true,
        durationMs: 45,
        retrievedPayloadPreview: seed1Text.substring(0, 60) + "..."
      },
      {
        id: 'log_seed_2',
        archiveId: 'arc_magnacarta',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        simulatedDecayRate: 15.0,
        mutationsDetected: 78,
        mutationsCorrected: 78,
        success: true,
        durationMs: 91,
        retrievedPayloadPreview: seed2Text.substring(0, 60) + "..."
      }
    ];

    // SEED PROGRESSIVE LAB PATHWAYS
    this.jobs = [
      {
        jobId: 'job_seed_1',
        archiveId: 'arc_voyager',
        providerId: 'biomemory',
        sequenceLength: seed1Nuc.length,
        costUSD: Math.round(seed1Nuc.length * 0.12 * 100) / 100,
        status: 'COMPLETED',
        biosecurityPass: true,
        trackingNumber: 'TRACK-DNA-812049',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        jobId: 'job_seed_2',
        archiveId: 'arc_magnacarta',
        providerId: 'twist-bioscience',
        sequenceLength: seed2Nuc.length,
        costUSD: Math.round(seed2Nuc.length * 0.05 * 100) / 100,
        status: 'SHIPPED_TO_FACILITY',
        biosecurityPass: true,
        trackingNumber: 'TRACK-DNA-239103',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

      HelixDatabase.persist();
    }
  }

  // --- QUERY APIS ---

  public static getArchives(): DNAArchive[] {
    return this.archives;
  }

  public static addArchive(archive: DNAArchive): void {
    this.archives = [archive, ...this.archives];
    this.persist();
  }

  public static updateArchiveStatus(id: string, status: 'SAFE' | 'DEGRADED' | 'RESTORING' | 'CORRUPTED'): void {
    const arc = this.archives.find(a => a.id === id);
    if (arc) {
      arc.status = status;
      this.persist();
    }
  }

  public static deleteArchive(id: string): void {
    this.archives = this.archives.filter(a => a.id !== id);
    this.jobs = this.jobs.filter(j => j.archiveId !== id);
    this.logs = this.logs.filter(l => l.archiveId !== id);
    this.persist();
  }

  public static getLogs(): RetrievalSimulationLog[] {
    return this.logs;
  }

  public static addLog(log: RetrievalSimulationLog): void {
    this.logs = [log, ...this.logs];
    this.persist();
  }

  public static getJobs(): ProviderSynthesisJob[] {
    return this.jobs;
  }

  public static addJob(job: ProviderSynthesisJob): void {
    this.jobs = [job, ...this.jobs];
    this.persist();
  }

  public static updateJobStatus(jobId: string, status: ProviderSynthesisJob['status']): void {
    const job = this.jobs.find(j => j.jobId === jobId);
    if (job) {
      job.status = status;
      job.updatedAt = new Date().toISOString();
      if (status === 'COMPLETED') {
        this.updateArchiveStatus(job.archiveId, 'SAFE');
      } else {
        this.persist();
      }
    }
  }

  public static getListings(): MarketplaceProviderListing[] {
    return this.listings;
  }

  public static addListing(listing: MarketplaceProviderListing): void {
    this.listings.push(listing);
    this.persist();
  }

  public static addRating(rating: ProviderRating): void {
    this.ratings = [rating, ...this.ratings];
    
    const providerListings = this.ratings.filter(r => r.providerId === rating.providerId);
    const avg = providerListings.reduce((sum, current) => sum + current.rating, 0) / providerListings.length;
    
    const listing = this.listings.find(l => l.providerId === rating.providerId);
    if (listing) {
      listing.ratingAverage = Math.round(avg * 10) / 10;
      listing.ratingCount = providerListings.length;
    }

    this.persist();
  }

  public static getRatings(): ProviderRating[] {
    return this.ratings;
  }

  public static getInvoices(): BillingInvoice[] {
    return this.invoices;
  }

  public static addInvoice(invoice: BillingInvoice): void {
    this.invoices = [invoice, ...this.invoices];
    this.persist();
  }

  public static setCurrentTier(tier: SubscriptionTier): void {
    this.currentTier = tier;
    this.persist();
  }

  // --- SaaS DYNAMIC UNIT ECONOMICS & INVESTOR CALCULATION ENGINE ---

  public static getSaaSMetrics(): SaaSMetrics {
    // Subscription constants
    const pricing: Record<SubscriptionTier, number> = {
      STARTER: 49.00,
      PROFESSIONAL: 249.00,
      BUSINESS: 799.00,
      ENTERPRISE: 2499.00
    };

    // Simulated tenant volume
    const tenantCounts: Record<SubscriptionTier, number> = {
      STARTER: 142,
      PROFESSIONAL: 58,
      BUSINESS: 19,
      ENTERPRISE: 4
    };

    // Calculate MRR from active customer base model
    const subsMRR = 
      (tenantCounts.STARTER * pricing.STARTER) +
      (tenantCounts.PROFESSIONAL * pricing.PROFESSIONAL) +
      (tenantCounts.BUSINESS * pricing.BUSINESS) +
      (tenantCounts.ENTERPRISE * pricing.ENTERPRISE);

    // Dynamic Marketplace syntheses transaction commissions
    const completedJobs = this.jobs.filter(j => j.status === 'COMPLETED');
    const totalMarketplaceSynthesisSpentUSD = completedJobs.reduce((sum, j) => sum + j.costUSD, 0);
    // 5% HelixVault commission take-rate on sequence provider routing
    const takeRate = 5; // percent
    const marketplaceARR_sim = totalMarketplaceSynthesisSpentUSD * 12 * (takeRate / 100);

    const mrr = Math.round(subsMRR + (totalMarketplaceSynthesisSpentUSD * (takeRate / 100)));
    const arr = mrr * 12;

    const totalNucleotidesSynthesized = this.archives.reduce((sum, a) => sum + a.nucleotideLength, 0) + 
      completedJobs.reduce((sum, j) => sum + j.sequenceLength, 0);
    
    // Convert base metrics into standard digital equivalents (1 GB ~ 4 billion nucleotides in biology)
    // Here we scale nucleotides to GB equivalents for clean visualization
    const totalDataEncodedGb = Math.round((totalNucleotidesSynthesized / 43000) * 100) / 100;

    return {
      mrr,
      arr,
      activeUsers: Object.values(tenantCounts).reduce((a, b) => a + b, 0) + 1, // + the active user
      ltvUSD: 14500, // Stanford / General Catalyst typical Biotech SaaS model
      cacUSD: 3100,
      churnRatePercent: 1.2, // Elite customer stickiness
      totalDataEncodedGb: Math.max(0.12, totalDataEncodedGb),
      totalNucleotidesSynthesized,
      marketplaceTakeRatePercent: takeRate,
      marketplaceARR: Math.round(marketplaceARR_sim),
      unitEconomicsProfitMargin: 78 // high margin due to pure software-based coding Reports
    };
  }
}

// --- SUBSCRIPTION TIER DEFINITIONS ---
export const SUBSCRIPTION_PLAN_TEMPLATES: SubscriptionConfig[] = [
  {
    id: 'STARTER',
    name: 'Academic Starter',
    priceMonthlyUSD: 49.00,
    baseStorageGB: 5,
    includedSequences: 10,
    overageCostPerNucleotide: 0.008,
    features: [
      'Digital DNA encoding report',
      'Proprietary chunking & indexing (10 oligos/seq)',
      'Basic GC-balancing analysis',
      'Downloadable FASTA exporting format',
      'Standard retrieval decay simulation & recovery'
    ]
  },
  {
    id: 'PROFESSIONAL',
    name: 'Biotech Professional',
    priceMonthlyUSD: 249.00,
    baseStorageGB: 50,
    includedSequences: 100,
    overageCostPerNucleotide: 0.005,
    features: [
      'Everything in Starter',
      'Unlimited digital DNA archives',
      'Full Homopolymer run mitigation rotation',
      'Integrated physical provider pricing estimator',
      'Future Twist Bioscience biological API simulator',
      'LTV/Biosecurity screening audit verification',
      'Stripe Invoice automated downloads'
    ]
  },
  {
    id: 'BUSINESS',
    name: 'Enterprise Vault',
    priceMonthlyUSD: 799.00,
    baseStorageGB: 500,
    includedSequences: 1000,
    overageCostPerNucleotide: 0.003,
    features: [
      'Everything in Professional',
      'Custom encryption standards selection',
      'Pre-negotiated Twist & GenScript take-rate discounts',
      'Biosecurity screen custom threat signature filters',
      'Direct API gateway tokens and SDK access',
      'Dedicated digital infrastructure instance parameters',
      '99.99999% molecular file integrity assurance simulation'
    ]
  },
  {
    id: 'ENTERPRISE',
    name: 'Consortium & Gov-Archive',
    priceMonthlyUSD: 2499.00,
    baseStorageGB: 50000,
    includedSequences: 50000,
    overageCostPerNucleotide: 0.001,
    features: [
      'Custom tailored molecular encoding algorithms',
      'Dedicated support bioinformatician on call',
      'Custom physical synthesis facility onboarding',
      'Annual dedicated on-premise pipeline integrations',
      'B2B settlement API and ledger billing'
    ]
  }
];
