/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SchemaTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints?: string;
    description: string;
  }[];
}

export const DATABASE_ERD_SPEC: SchemaTable[] = [
  {
    name: "users_subscriptions",
    description: "Tracks active customer workspaces, billing tier configuration, and Stripe secret parameters.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique customer identifier" },
      { name: "email", type: "VARCHAR(255)", constraints: "UNIQUE NOT NULL", description: "Login credentials key" },
      { name: "subscription_tier", type: "VARCHAR(50)", constraints: "DEFAULT 'PROFESSIONAL' Check (STARTER, PROFESSIONAL, BUSINESS, ENTERPRISE)", description: "Active subscription plan metadata" },
      { name: "stripe_customer_id", type: "VARCHAR(255)", constraints: "NULLABLE", description: "Stripe secure customer reference pointer" },
      { name: "storage_used_bytes", type: "BIGINT", constraints: "DEFAULT 0", description: "Aggregated molecular file weights" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT clock_timestamp()", description: "Onboarding timestamp" }
    ]
  },
  {
    name: "dna_archives",
    description: "Stores encoded FASTA records representing files transformed into biological DNA nucleotides.",
    columns: [
      { name: "id", type: "VARCHAR(100)", constraints: "PRIMARY KEY", description: "Human-readable workspace file ID" },
      { name: "name", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Original file name upload payload" },
      { name: "file_mime_type", type: "VARCHAR(100)", constraints: "NOT NULL", description: "Payload format tracker" },
      { name: "original_size_bytes", type: "INT", constraints: "NOT NULL", description: "Original uncompressed file weight" },
      { name: "nucleotide_length", type: "INT", constraints: "NOT NULL", description: "Total length of ACTG sequence" },
      { name: "fasta_string", type: "TEXT", constraints: "NOT NULL", description: "Standard biological FASTA formatting stream" },
      { name: "status", type: "VARCHAR(50)", constraints: "Check(SAFE, DEGRADED, RESTORING, CORRUPTED)", description: "Molecular safety index" },
      { name: "encryption_standard", type: "VARCHAR(100)", constraints: "DEFAULT 'AES-256GCM'", description: "Cryptographic pre-wrapping format" },
      { name: "provider_id", type: "VARCHAR(50)", constraints: "FOREIGN KEY REFERENCES dna_providers", description: "Target physical synthesizer partner pool" },
      { name: "nucleotide_data", type: "TEXT", constraints: "NOT NULL", description: "The core sequence payload data string" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT now()", description: "Insertion calendar stamp" }
    ]
  },
  {
    name: "provider_synthesis_jobs",
    description: "Monitors real-time physical synthesis state queues for third-party laboratory partners.",
    columns: [
      { name: "job_id", type: "VARCHAR(100)", constraints: "PRIMARY KEY", description: "Unique tracking token" },
      { name: "archive_id", type: "VARCHAR(100)", constraints: "FOREIGN KEY REFERENCES dna_archives", description: "Source digital molecular archive" },
      { name: "provider_id", type: "VARCHAR(100)", constraints: "NOT NULL", description: "Twist Bioscience, GenScript, etc." },
      { name: "sequence_length", type: "INT", constraints: "NOT NULL", description: "Base length of synthesized molecule" },
      { name: "cost_usd", type: "DECIMAL(12,2)", constraints: "NOT NULL", description: "Physical lab synthesis fee routed" },
      { name: "status", type: "VARCHAR(50)", constraints: "Check(PENDING_BIOSECURITY, SYNTHESIZING, QUALITY_CONTROL, SHIPPED_TO_FACILITY, COMPLETED, FAILED)", description: "State of chemical manufacturing cycle" },
      { name: "biosecurity_pass", type: "BOOLEAN", constraints: "DEFAULT TRUE", description: "Lethal pathogen clearance certificate" },
      { name: "tracking_number", type: "VARCHAR(100)", constraints: "NULLABLE", description: "UPS/Molecular capsule courier number" }
    ]
  },
  {
    name: "provider_marketplace_listings",
    description: "Manages catalog listings for the future Phase 3 DNA Storage Marketplace network.",
    columns: [
      { name: "id", type: "VARCHAR(100)", constraints: "PRIMARY KEY", description: "Marketplace unique listing token" },
      { name: "provider_id", type: "VARCHAR(50)", constraints: "UNIQUE NOT NULL", description: "Partner provider identifier reference key" },
      { name: "display_name", type: "VARCHAR(255)", constraints: "NOT NULL", description: "User-facing brand title" },
      { name: "description", type: "TEXT", constraints: "NOT NULL", description: "Technical capability overview" },
      { name: "rating_average", type: "DECIMAL(3,2)", constraints: "DEFAULT 5.0", description: "Customer aggregated rating stars" },
      { name: "is_verified", type: "BOOLEAN", constraints: "DEFAULT FALSE", description: "Biosecurity and HIPAA screening cleared" },
      { name: "throughput_gb_per_day", type: "DECIMAL(10,2)", constraints: "NOT NULL", description: "Molecular syntheses capacity constraints" }
    ]
  }
];

export const DIRECTORY_STRUCTURE = {
  name: "helix-vault-workspace",
  type: "directory",
  children: [
    { name: ".env.example", type: "file", desc: "Defines required server environmental pointers (e.g., GEMINI_API_KEY, APP_URL)" },
    { name: "metadata.json", type: "file", desc: "Configures application metadata, framing permissions and premium features" },
    { name: "package.json", type: "file", desc: "Maintains npm runtime dependency declarations and build routines" },
    { name: "server.ts", type: "file", desc: "Fullstack Express controller; serves JSON APIs & boots Vite client-facing assets" },
    { name: "vite.config.ts", type: "file", desc: "Maintains bundling and routing configurations for our SPA framework" },
    {
      name: "src",
      type: "directory",
      children: [
        { name: "main.tsx", type: "file", desc: "React SPA root entry file and global stylesheet injector" },
        { name: "index.css", type: "file", desc: "Global Tailwind directives and premium typography font configurations" },
        { name: "types.ts", type: "file", desc: "Maintains strict typing for DNA codecs, metrics, plans, and invoices" },
        { name: "dnaEngine.ts", type: "file", desc: "Proprietary biological coding and optimal GC-balancing engines" },
        { name: "dbMock.ts", type: "file", desc: "High-integrity relational state simulation and seed ledger" },
        { name: "systemSpecData.ts", type: "file", desc: "System specifications metadata and ERD data representations" },
        { name: "App.tsx", type: "file", desc: "Primary user control UI, live graphs, simulations, and lab tools" }
      ]
    }
  ]
};

export const COMPLIANCE_LISTING = [
  {
    id: "comp_1",
    name: "Biosecurity path screening DNA draft v2",
    description: "In accordance with the international biosecurity standards, all encoded sequence outputs must be screened against hazardous pathogen markers prior to physical synthesizer queue assignment.",
    status: "COMPLIANT" as const,
    lastCheckedDate: "June 19, 2026",
    evidenceLink: "Biosecurity Screening compliant: Hazard-91 cleared"
  },
  {
    id: "comp_2",
    name: "SOC 2 Type II data archival encryption standards",
    description: "SaaS pipeline encryption wrapped in cold room transport levels. Database contains fully structured AES-256GCM hashes for metadata, with original files shredded outside molecular segments.",
    status: "COMPLIANT" as const,
    lastCheckedDate: "May 28, 2026",
    evidenceLink: "SOC2 Compliance Seal #29013"
  },
  {
    id: "comp_3",
    name: "HIPAA pharmaceutical storage certification",
    description: "Restricted HIPAA compliance covering personal health genetics storage inside molecular capsules, shielding direct patient IDs via molecular cryptographic separation schemas.",
    status: "COMPLIANT" as const,
    lastCheckedDate: "June 10, 2026",
    evidenceLink: "HIPAA Ledger Certificate #9102-H"
  },
  {
    id: "comp_4",
    name: "Illumina & Twist molecular API protocols alignment",
    description: "Standard JSON adapters configuration compatibility tests. Verifies real-time Webhook tracking loops for sequencing facilities and molecular capsule state retrieval.",
    status: "COMPLIANT" as const,
    lastCheckedDate: "June 18, 2026",
    evidenceLink: "Adapter Schema: API-v2 Compliant"
  }
];
