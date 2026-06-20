/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { 
  Dna, ShieldCheck, Archive, Database, Activity, TrendingUp, 
  Coins, Cpu, Globe, Plus, Trash2, Star, CheckCircle, 
  AlertTriangle, FileText, Terminal, ArrowRight, Clock, 
  ArrowUpRight, Download, RefreshCw, Sliders, PlusCircle, 
  Lock, Settings, Layers, Info, Check, Sparkles, User, RefreshCcw,
  LogOut, LogIn, BookOpen, ExternalLink, HelpCircle, Users, Heart
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, BarChart, Bar, Cell, Legend, CartesianGrid 
} from 'recharts';

import { DNAArchive, RetrievalSimulationLog, ProviderSynthesisJob, MarketplaceProviderListing, ProviderRating, BillingInvoice, SaaSMetrics, SubscriptionTier } from './types';
import { DATABASE_ERD_SPEC, DIRECTORY_STRUCTURE, COMPLIANCE_LISTING } from './systemSpecData';
import { REGISTERED_DNA_PROVIDERS } from './dnaEngine';
import { TEAM_MEMBERS, CORE_VALUES, ROADMAP, STORAGE_PRESETS, MARKETING_FAQS } from './publicContent';

export default function App() {
  // STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  
  // Custom public interactive calculators state
  const [customStorageTB, setCustomStorageTB] = useState<number>(120);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(1);
  const [authEmail, setAuthEmail] = useState<string>('moatazsalmin@gmail.com');
  const [authPassword, setAuthPassword] = useState<string>('sequencer-pass-2026');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [mfaChallengeCode, setMfaChallengeCode] = useState<string>('192026');
  const [mfaCheckbox, setMfaCheckbox] = useState<boolean>(true);
  
  // Data State loaded from REST API
  const [archives, setArchives] = useState<DNAArchive[]>([]);
  const [jobs, setJobs] = useState<ProviderSynthesisJob[]>([]);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [listings, setListings] = useState<MarketplaceProviderListing[]>([]);
  const [ratings, setRatings] = useState<ProviderRating[]>([]);
  const [retrievalLogs, setRetrievalLogs] = useState<RetrievalSimulationLog[]>([]);
  const [metrics, setMetrics] = useState<SaaSMetrics | null>(null);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('PROFESSIONAL');
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Loading & Action states
  const [loading, setLoading] = useState<boolean>(true);
  const [encodingProgress, setEncodingProgress] = useState<boolean>(false);
  const [decodingProgress, setDecodingProgress] = useState<boolean>(false);
  
  // Forms State - Digital Encoder
  const [fileName, setFileName] = useState<string>('sequencing_proposal_draft.md');
  const [fileText, setFileText] = useState<string>('# Stanford Genetics Proposal\n\nThis document synthesizes clinical research parameters for long-term secure archival. DNA-encoded memory provides optimal resilience against EM fields, requiring zero cooling overhead.');
  const [encryptionStandard, setEncryptionStandard] = useState<string>('AES-256GCM + Molecular parity check');
  const [targetProviderId, setTargetProviderId] = useState<string>('twist-bioscience');
  
  // Last encoded outcome
  const [lastEncodeResult, setLastEncodeResult] = useState<any>(null);
  const [geminiReport, setGeminiReport] = useState<string>('');
  const [loadingGemini, setLoadingGemini] = useState<boolean>(false);

  // Decay simulation state
  const [selectedDecayArchiveId, setSelectedDecayArchiveId] = useState<string>('');
  const [decayRate, setDecayRate] = useState<number>(5); // percent
  const [decayResult, setDecayResult] = useState<any>(null);
  
  // Marketplace inputs
  const [onboardProviderId, setOnboardProviderId] = useState<string>('oxford-nanopore');
  const [onboardDisplayName, setOnboardDisplayName] = useState<string>('Oxford Nanopore Sequencer Pool');
  const [onboardDesc, setOnboardDesc] = useState<string>('Direct real-time nanopore sequencing flowcells with live parity streaming.');
  const [onboardCapacity, setOnboardCapacity] = useState<number>(12.5);
  const [onboardCountry, setOnboardCountry] = useState<string>('United Kingdom');
  
  // Rating form
  const [ratingTargetProviderId, setRatingTargetProviderId] = useState<string>('twist-bioscience');
  const [newRatingStars, setNewRatingStars] = useState<number>(5);
  const [newRatingComment, setNewRatingComment] = useState<string>('Flawless integration with our automated synthesis pipeline!');

  // Trigger load on startup
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchWithRetry = async (url: string, retries: number = 3, delay: number = 500): Promise<Response> => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) return response;
        throw new Error(`HTTP error! status: ${response.status}`);
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
    throw new Error('All retries failed');
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      
      // Fetch archives
      const arcRes = await fetchWithRetry('/api/archives');
      const arcData = await arcRes.json();
      if (arcData.success) {
        setArchives(arcData.data);
        if (arcData.data.length > 0) {
          setSelectedDecayArchiveId(arcData.data[0].id);
        }
      }

      // Fetch jobs
      const jobRes = await fetchWithRetry('/api/synthesis/jobs');
      const jobData = await jobRes.json();
      if (jobData.success) setJobs(jobData.jobs);

      // Fetch listings & ratings
      const provRes = await fetchWithRetry('/api/providers');
      const provData = await provRes.json();
      if (provData.success) {
        setListings(provData.listings);
        setRatings(provData.ratings);
      }

      // Fetch billing Invoices
      const billRes = await fetchWithRetry('/api/billing/invoices');
      const billData = await billRes.json();
      if (billData.success) {
        setInvoices(billData.invoices);
        setCurrentTier(billData.currentTier);
      }

      // Fetch retrieval audit logs
      const logRes = await fetchWithRetry('/api/logs');
      const logData = await logRes.json();
      if (logData.success) setRetrievalLogs(logData.logs);

      // Fetch SaaS metrics
      const metricRes = await fetchWithRetry('/api/analytics/metrics');
      const metricData = await metricRes.json();
      if (metricData.success) setMetrics(metricData.metrics);

    } catch (e: any) {
      console.error("Failed fetching HelixVault state:", e);
      setFetchError(e.message || "Failed to establish a network connection to HelixVault API.");
    } finally {
      setLoading(false);
    }
  };

  // HANDLERS
  const handleEncodeDNA = async () => {
    try {
      setEncodingProgress(true);
      setLastEncodeResult(null);
      setGeminiReport('');
      
      const response = await fetch('/api/archives/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fileName,
          text: fileText,
          encryptionStandard,
          providerId: targetProviderId
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setLastEncodeResult(resData);
        // Add to archives array
        setArchives(prev => [resData.archive, ...prev]);
        setJobs(prev => [resData.job, ...prev]);
        setSelectedDecayArchiveId(resData.archive.id);
        
        // Refresh metrics
        triggerMetricsReload();

        // Automatically trigger Gemini Optimization Advisory Analysis!
        fetchGeminiAdvisory(resData.archive.name, resData.archive.nucleotideData, resData.report);
      } else {
        alert("Encoding failed: " + resData.error);
      }
    } catch (e: any) {
      alert("Encryption pipeline error: " + e.message);
    } finally {
      setEncodingProgress(false);
    }
  };

  const fetchGeminiAdvisory = async (seqName: string, seqStr: string, report: any) => {
    try {
      setLoadingGemini(true);
      const response = await fetch('/api/gemini/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequenceName: seqName,
          rawSequence: seqStr,
          gcContent: report.gcContent,
          homopolymerRun: report.homopolymerMaxRun
        })
      });
      const data = await response.json();
      if (data.success) {
        setGeminiReport(data.analysisText);
      }
    } catch (e) {
      console.error("Gemini failed:", e);
    } finally {
      setLoadingGemini(false);
    }
  };

  const handleSimulateDecayRetrieval = async () => {
    if (!selectedDecayArchiveId) return;
    try {
      setDecodingProgress(true);
      setDecayResult(null);

      const response = await fetch('/api/archives/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDecayArchiveId,
          decayRate
        })
      });

      const data = await response.json();
      if (data.success) {
        setDecayResult(data);
        // Refresh archives with mutated/restoring states
        fetchInitialData();
      }
    } catch (e: any) {
      alert("Decay simulation failed: " + e.message);
    } finally {
      setDecodingProgress(false);
    }
  };

  const handleDeleteArchive = async (id: string) => {
    if (!confirm("Are you sure you want to remove this digital DNA archive from long-term storage?")) return;
    try {
      const response = await fetch(`/api/archives/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setArchives(prev => prev.filter(a => a.id !== id));
        triggerMetricsReload();
      }
    } catch (e: any) {
      alert("Deletion error: " + e.message);
    }
  };

  const handleDispatchSynthesisJob = async (jobId: string) => {
    try {
      const response = await fetch('/api/synthesis/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      const data = await response.json();
      if (data.success) {
        setJobs(prev => prev.map(j => j.jobId === jobId ? { ...j, status: data.status, updatedAt: new Date().toISOString() } : j));
        triggerMetricsReload();
      }
    } catch (e: any) {
      alert("Job transition error: " + e.message);
    }
  };

  const handleOnboardListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/providers/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: onboardProviderId,
          displayName: onboardDisplayName,
          description: onboardDesc,
          locationCountry: onboardCountry,
          throughputCapacityGbPerDay: onboardCapacity,
          tags: ['Onboarded', 'Custom Adapter API'],
          complianceCertifications: ['SOC2', 'ISO-13485'],
        }),
      });
      const data = await response.json();
      if (data.success) {
        setListings(prev => [...prev, data.listing]);
        alert("Success! Partner provider added to marketplace schema. Custom SDK initialized.");
        setOnboardDisplayName('');
        setOnboardDesc('');
      } else {
        alert("Onboarding failed: " + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert("Onboarding failed: " + err.message);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/providers/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: ratingTargetProviderId,
          rating: newRatingStars,
          comment: newRatingComment
        })
      });
      const data = await response.json();
      if (data.success) {
        setRatings(prev => [data.rating, ...prev]);
        alert("Review published! Synced with biological marketplace feedback engine.");
        setNewRatingComment('');
        // Reload provider list to update rated stars
        const pRes = await fetch('/api/providers');
        const pData = await pRes.json();
        if (pData.success) {
          setListings(pData.listings);
        }
      }
    } catch (err: any) {
      alert("Rating failed: " + err.message);
    }
  };

  const handleStripeSubscribe = async (tier: SubscriptionTier) => {
    try {
      setLoading(true);
      const response = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });
      const data = await response.json();
      if (data.success) {
        setCurrentTier(data.currentTier);
        setInvoices(prev => [data.invoice, ...prev]);
        triggerMetricsReload();
        alert(`Stripe Simulated Checkout Successful! Upgraded workspace to: ${tier}. Invoice ${data.invoice.invoiceNumber} paid.`);
      }
    } catch (e: any) {
      alert("Billing gateway error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerMetricsReload = async () => {
    const metricRes = await fetch('/api/analytics/metrics');
    const metricData = await metricRes.json();
    if (metricData.success) setMetrics(metricData.metrics);
  };

  // CHARTS DATA PREPARATION
  const mrrData = [
    { name: 'Jan', value: (metrics?.mrr || 14800) - 4000 },
    { name: 'Feb', value: (metrics?.mrr || 14800) - 2500 },
    { name: 'Mar', value: (metrics?.mrr || 14800) - 1800 },
    { name: 'Apr', value: (metrics?.mrr || 14800) - 800 },
    { name: 'May', value: (metrics?.mrr || 14800) - 300 },
    { name: 'Jun (Now)', value: (metrics?.mrr || 14800) }
  ];

  const synthesisCostsChart = REGISTERED_DNA_PROVIDERS
    .filter(p => p.synthesisCostPerBaseUSD > 0)
    .map(p => ({
      name: p.name,
      cost: p.synthesisCostPerBaseUSD * 100 // cents per base
    }));

  // PUBLIC AUTHENTICATION HANDLERS
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      setAuthError("Email address is required.");
      return;
    }
    if (authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }
    setAuthError(null);
    setAuthSuccessMsg("Biometric MFA Handshake verified. Bootstrapping molecular databases...");
    
    // Simulate short network delay
    setTimeout(() => {
      setUserLoggedIn(true);
      setActiveTab('dashboard');
      setAuthSuccessMsg(null);
    }, 1100);
  };

  const handleLogout = () => {
    setUserLoggedIn(false);
    setActiveTab('landing');
  };

  // IF USER IS NOT LOGGED IN, RENDER THE GORGEOUS, METRIC-DRIVEN SAAS MARKETING SITE
  if (!userLoggedIn) {
    const currentPreset = STORAGE_PRESETS[selectedPresetIndex];
    
    // Calculate estimate for custom slider
    // Standard rule: 1 GB digital data translates to ~2.5 million synthesized bases depending on codon alignment
    const estimatedBasePairsNeededGb = customStorageTB * 1000 * 2.5; // billions
    const estimatedMonthlyBaseSynthesisUSD = Math.round(customStorageTB * 1.85 * 100) / 100;
    
    // Recommended Tier matcher
    let recommendedTier = 'STARTER';
    let recommendedPrice = '$49';
    if (customStorageTB > 500) {
      recommendedTier = 'ENTERPRISE';
      recommendedPrice = '$2,499';
    } else if (customStorageTB > 150) {
      recommendedTier = 'BUSINESS';
      recommendedPrice = '$799';
    } else if (customStorageTB > 10) {
      recommendedTier = 'PROFESSIONAL';
      recommendedPrice = '$249';
    }

    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans flex flex-col justify-between selection:bg-blue-500/30 selection:text-white">
        
        {/* PUBLIC NAVIGATION HEADER */}
        <header className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold">
                <Dna className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-sans font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  HelixVault <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono font-bold tracking-normal uppercase">SaaS</span>
                </h1>
                <p className="text-[8px] text-blue-400 font-mono tracking-widest uppercase">THE STRIPE OF DNA STORAGE</p>
              </div>
            </div>

            {/* NAV LINKS */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold">
              <button 
                onClick={() => setActiveTab('landing')}
                className={`transition-colors hover:text-white cursor-pointer ${activeTab === 'landing' ? 'text-blue-450 text-blue-400 font-bold' : 'text-slate-400'}`}
              >
                Product Summary
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`transition-colors hover:text-white cursor-pointer ${activeTab === 'about' ? 'text-blue-450 text-blue-400 font-bold' : 'text-slate-400'}`}
              >
                About DNA Labs
              </button>
              <button 
                onClick={() => setActiveTab('pricing')}
                className={`transition-colors hover:text-white cursor-pointer ${activeTab === 'pricing' ? 'text-blue-450 text-blue-400 font-bold' : 'text-slate-400'}`}
              >
                Stripe Pricing Plans
              </button>
              <a 
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('landing');
                  setTimeout(() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-slate-400 transition-colors hover:text-white"
              >
                How It Works
              </a>
            </nav>

            {/* ACTION DIRECT CTAS */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('login')}
                className="hidden sm:inline-block text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button 
                onClick={() => setActiveTab('login')}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-xs text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Launch Console</span>
              </button>
            </div>
          </div>
        </header>

        {/* PUBLIC ROUTED BODY */}
        <main className="flex-1 pb-16">
          
          {/* TAB 1: LANDING PAGE */}
          {activeTab === 'landing' && (
            <div className="space-y-20 animate-fadeIn">
              
              {/* HERO SEGMENT */}
              <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-xs text-blue-400 font-mono font-bold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>SECURE COLD-STORAGE COMPLIANCE FOR DECADES</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                    Universal API Adapter Layer for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Biological DNA Storage</span>
                  </h1>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl text-pretty">
                    HelixVault operates as the software abstraction layer bridging traditional enterprise databases with synthetic biopolymer architectures. We streamline chemical synthesis dispatching, file packaging, and sequence parity error recovery.
                  </p>
                  
                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setActiveTab('login')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs py-3 px-6 transition-all shadow-lg shadow-blue-500/15 flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                    >
                      Start Free Trial Workspace
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('pricing')}
                      className="bg-slate-805 bg-slate-900 border border-slate-750 hover:bg-slate-800 hover:border-slate-700 text-slate-200 font-semibold rounded-lg text-xs py-3 px-6 transition-all text-center cursor-pointer"
                    >
                      Explore ROI Tape Savings
                    </button>
                  </div>

                  {/* MINI BADGES LEDGER */}
                  <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-x-8 gap-y-3 text-slate-400 text-xs">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-blue-500" />
                      <span>Zero-Trust Parity Encryption</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-blue-500" />
                      <span>Multiple Chemical Providers Ready</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>SOC2 Compliant Audits</span>
                    </div>
                  </div>
                </div>

                {/* VISUAL TECH GLIMPSE GRAPH */}
                <div className="lg:col-span-5 p-6 bg-slate-950 rounded-2xl border border-slate-800/80 shadow-2xl relative">
                  <div className="absolute -top-3 -left-3 bg-blue-650 bg-blue-600 text-white font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Core Router Terminal
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="h-4 w-4 text-blue-400" />
                        <span className="font-mono text-xs text-slate-300 font-bold">digital_to_base_transcoding.py</span>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                    </div>

                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 font-mono text-[10px] text-blue-400 leading-relaxed overflow-x-auto whitespace-pre">
{`# Coding binary matrix to codon vectors
def transcode_to_bases(binary_stream):
    codons = { "00": "A", "01": "C", "10": "G", "11": "T" }
    genomic_seq = []
    for chunk in chunkify(binary_stream, 2):
        genomic_seq.append(codons[chunk])
    # Apply chemical GC balancing filter
    balanced_seq = apply_gc_filter(genomic_seq)
    return balanced_seq

# Output payload for synthesis
[✓] SEQUENCE READY: 1,450 base pairs
[✓] GC COMPLIANCE RATIO: 48.2%
[✓] HOMOPOLYMERS: CLEARED (Max run 2)`}
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between text-[11px]">
                      <span className="text-blue-300 font-sans">Estimated physical longevity (hermetic)</span>
                      <strong className="text-white">1,500 + Years</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* CORE VALUES BENTO */}
              <section className="bg-slate-950/40 border-y border-slate-900 py-16 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                  <div className="text-center space-y-3 max-w-xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-extrabold font-sans text-white tracking-tight">
                      Why Double-Helix Molecular Storage?
                    </h2>
                    <p className="text-slate-400 text-xs md:text-sm">
                      Overcome technical physical limitations of traditional tape storage datacenters while dropping continuous operational energy consumption to zero.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {CORE_VALUES.map((val, idx) => (
                      <div key={idx} className="p-6 bg-slate-900 border border-slate-800/60 rounded-xl space-y-3.5 shadow-sm">
                        <div className="h-10 w-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                          {idx === 0 && <ShieldCheck className="h-5 w-5" />}
                          {idx === 1 && <Dna className="h-5 w-5" />}
                          {idx === 2 && <Cpu className="h-5 w-5" />}
                        </div>
                        <h3 className="font-bold font-sans text-sm text-white">{val.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed text-pretty">{val.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 3: INTERACTIVE EXPONENTROI RETENTION COMPARATOR */}
              <section id="retention-roi" className="px-6 max-w-7xl mx-auto space-y-8">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">Longevity Cost Modifying Tools</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold font-sans text-white mt-1 tracking-tight">
                    Programmatic DNA vs Silicon Tape ROI Presets
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a cold archival business preset below to see the modeled cost curve differences over 50 years, factoring magnetic tape hardware replacement cycles and vault climate cost.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* PRESET MENU TABS (4 COLS) */}
                  <div className="lg:col-span-4 space-y-3">
                    {STORAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPresetIndex(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                          selectedPresetIndex === idx 
                          ? 'bg-blue-600 border-transparent text-white shadow-md font-semibold' 
                          : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="font-sans font-bold text-slate-200 group-hover:text-white uppercase tracking-wider text-[10px] mb-1">
                          PRESET {idx + 1}
                        </span>
                        <strong className={`font-sans text-[13px] ${selectedPresetIndex === idx ? 'text-white' : 'text-slate-200'}`}>
                          {preset.label}
                        </strong>
                        <div className="mt-3 flex justify-between items-center text-[11px] opacity-90 font-mono">
                          <span>Capacity: <strong>{preset.sizeTB} TB</strong></span>
                          <span>CO2 Net Saved: <strong>+{preset.co2SavingsTons}t</strong></span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* COST COMPARATOR PANEL BAR GRAPH (8 COLS) */}
                  <div className="lg:col-span-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex flex-col justify-between space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                      <div>
                        <h4 className="font-sans font-bold text-slate-200 text-sm">
                          Archival Preservation Lifecycle Expense Estimate (50-Year Cost)
                        </h4>
                        <p className="text-[10px] text-blue-400 font-mono mt-0.5">Preset: {currentPreset.label}</p>
                      </div>
                      <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 border border-blue-500/20 rounded font-mono font-bold">
                        50Y Savings: ~{(((currentPreset.tapeCost50Y - currentPreset.dnaCost50Y) / currentPreset.tapeCost50Y) * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
                      {/* SILICON MAGNETIC TAPE */}
                      <div className="p-4 bg-slate-950 rounded-xl border border-red-500/10 space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">Silicon Tape Archives</span>
                          <span className="bg-red-500/10 border border-red-500/30 text-red-400 font-bold px-2 py-0.5 rounded text-[10px]">
                            LTO-9 Cycle
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-500">Continuous HVAC overhead, device swaps & drive decay</p>
                          <p className="text-2xl font-black text-red-400 font-sans">
                            ${currentPreset.tapeCost50Y.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">Requires continuous grid energy to avoid magnetic decay</p>
                      </div>

                      {/* HELIXVAULT BIO-DS STORAGE */}
                      <div className="p-4 bg-blue-600/10 rounded-xl border border-blue-500/30 space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-blue-300">Dry Synthetic DNA (HelixVault)</span>
                          <span className="bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold px-2 py-0.5 rounded text-[10px]">
                            Ambient Vault
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-blue-300">One-time sequence synthesis write, zero grid power needed</p>
                          <p className="text-2xl font-black text-blue-400 font-sans">
                            ${currentPreset.dnaCost50Y.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(currentPreset.dnaCost50Y / currentPreset.tapeCost50Y) * 100}%` }}></div>
                        </div>
                        <p className="text-[10px] text-blue-300 font-mono font-bold block">Net Environmental Footprint: ~0 Wh/day</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* HOW IT WORKS SECTION */}
              <section id="how-it-works" className="px-6 max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-3 max-w-xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-extrabold font-sans text-white tracking-tight">
                    How HelixVault Abstraction Works
                  </h2>
                  <p className="text-slate-400 text-xs md:text-sm">
                    A three-layered programmatic pipeline delivering extreme stability without wet lab biological expertise.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 bg-slate-900/60 rounded-xl space-y-4 relative border border-slate-800">
                    <span className="absolute top-4 right-4 text-3xl font-black text-slate-800">01</span>
                    <h3 className="font-bold text-sm text-white">Transcoding & Encryption</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Digital files uploaded via REST/gRPC are mapped using zero-homopolymer run algorithms and stabilized into G, C, A, T codon signatures.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-900/60 rounded-xl space-y-4 relative border border-slate-800">
                    <span className="absolute top-4 right-4 text-3xl font-black text-slate-800">02</span>
                    <h3 className="font-bold text-sm text-white">Consortium Synthesis Dispatch</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      HelixVault balances base sequences, maps client orders, and dispatches API synthesis batches to vetted hardware groups like Twist Bioscience or IDT.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-900/60 rounded-xl space-y-4 relative border border-slate-800">
                    <span className="absolute top-4 right-4 text-3xl font-black text-slate-800">03</span>
                    <h3 className="font-bold text-sm text-white">Encapsulation & Archival</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Synthesized double-helix strands are dry-vacuum-sealed into hermetic micro-capsules, creating an un-hackable backup requiring no utility cooling.
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQS SECTION */}
              <section className="px-6 max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <HelpCircle className="h-8 w-8 text-blue-500 mx-auto" />
                  <h2 className="text-2xl font-bold font-sans text-white">SaaS FAQ Diagnostics</h2>
                  <p className="text-xs text-slate-400">Answers to frequent molecular engineering and platform developer questions.</p>
                </div>

                <div className="space-y-4">
                  {MARKETING_FAQS.map((faq, idx) => (
                    <div key={idx} className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="font-bold text-xs text-slate-200 font-sans flex items-start gap-2">
                        <span className="text-blue-500 font-mono font-black shrink-0">Q:</span>
                        <span>{faq.q}</span>
                      </h4>
                      <p className="text-xs text-slate-450 text-slate-450 text-slate-400 pl-4 border-l border-slate-800 leading-relaxed text-pretty">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* CALL TO ACTION ACCREDITED */}
              <section className="p-8 md:p-12 bg-gradient-to-r from-blue-700 to-indigo-800 bg-blue-600 rounded-3xl max-w-7xl mx-6 xl:mx-auto relative overflow-hidden shadow-2xl space-y-6 text-center">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-radial from-white/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                  <h3 className="text-3xl font-extrabold tracking-tight text-white font-sans">
                    Launch Your Corporate DNA Vault Workspace Today
                  </h3>
                  <p className="text-blue-100 text-xs md:text-sm leading-relaxed text-pretty">
                    Create a sandbox or register an enterprise synthesis queue. Use our preloaded tenant credentials inside the login form to evaluate standard dashboard capabilities in under 10 seconds.
                  </p>
                  <div className="pt-2 flex justify-center">
                    <button 
                      onClick={() => setActiveTab('login')}
                      className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg text-xs transition-colors hover:bg-slate-100 cursor-pointer shadow-lg flex items-center gap-1.5"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Authenticate and Launch console</span>
                    </button>
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* TAB 2: ABOUT US */}
          {activeTab === 'about' && (
            <div className="max-w-4xl mx-auto px-6 pt-12 space-y-12 animate-fadeIn">
              
              <div className="border-b border-slate-800 pb-4 space-y-2 text-center">
                <Users className="h-10 w-10 text-blue-500 mx-auto" />
                <h2 className="text-3xl font-sans font-bold text-white tracking-tight">The HelixVault Scientific Core</h2>
                <p className="text-xs text-slate-400 max-w-xl mx-auto mt-1 leading-relaxed">
                  HelixVault was founded to merge deep biochemistry breakthroughs with classical silicon database systems. Meet our founding science engineers and view compliance roadmaps.
                </p>
              </div>

              {/* TEAM BIOGRAPHYS */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-sans text-white border-b border-slate-850 pb-2">Founding Board & Sequence Codon Pioneers</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {TEAM_MEMBERS.map((member, idx) => (
                    <div key={idx} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 text-xs font-bold font-sans rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
                            {member.initials}
                          </div>
                          <div>
                            <h4 className="font-sans font-bold text-sm text-slate-100">{member.name}</h4>
                            <p className="text-[10px] text-blue-400 font-bold uppercase mt-0.5">{member.role}</p>
                          </div>
                        </div>
                        <span className="inline-block text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-350 font-mono font-bold">
                          {member.credentials}
                        </span>
                        <p className="text-xs text-slate-400 leading-relaxed text-pretty">
                          {member.bio}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-850 flex items-center text-[10px] text-slate-500 justify-between font-mono">
                        <span>Direct verify:</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> VERIFIED GENOMICS
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPLIANCE RIGOR & ETHICS */}
              <div className="p-6 bg-slate-950 rounded-xl border border-slate-850 space-y-4">
                <h4 className="font-sans font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-blue-400" />
                  <span>SaaS Biosecurity Screening Rules Alignment</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  HelixVault treats biosecurity as an absolute paradigm. In lockstep with the <strong>International Gene Synthesis Consortium (IGSC)</strong>, every digital client sequence uploaded to HelixVault is programmatically checked against certified bio-hazard pathogen models before any rest synthesis orders are scheduled. This sequence checking ensures there is zero risk of constructing dangerous genetic compounds.
                </p>
                <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono text-slate-500">
                  <span>✓ IGSC Pathogen Filter Activated</span>
                  <span>✓ USDA Biological Compliance Standard</span>
                  <span>✓ Dual-Use Sequencing Guard</span>
                </div>
              </div>

              {/* TIMELINE ROADMAP */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-sans text-white border-b border-slate-850 pb-2">Technical Delivery Roadmap</h3>
                
                <div className="space-y-4">
                  {ROADMAP.map((mile, idx) => (
                    <div key={idx} className="p-5 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {mile.status === "COMPLETED" && (
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                      )}
                      {mile.status === "IN_PROGRESS" && (
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 animate-pulse"></div>
                      )}
                      
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-blue-400">{mile.period}</span>
                          <span className={`text-[9px] font-bold font-sans px-2 rounded-full uppercase tracking-wider py-0.2 ${
                            mile.status === "COMPLETED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            mile.status === "IN_PROGRESS" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-slate-800 text-slate-500"
                          }`}>
                            {mile.status}
                          </span>
                        </div>
                        <h4 className="font-sans font-bold text-sm text-slate-100">{mile.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{mile.description}</p>
                      </div>
                      <div className="shrink-0 text-right opacity-60">
                        <Database className="h-6 w-6 text-slate-600 hidden md:block" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MISSION HEARTS COMMENT */}
              <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-center gap-4 text-xs text-slate-450 leading-relaxed text-slate-400">
                <Heart className="h-8 w-8 text-rose-500 shrink-0" />
                <p>
                  <strong>Sustainability Note:</strong> By storing the world’s cold data in double-helix biosensors instead of heavy high-voltage tape machines, we significantly reduce greenhouse emissions. We model offsets over the coming century.
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: STRIPE PRICING & DISCOUNTS SLIDER */}
          {activeTab === 'pricing' && (
            <div className="max-w-6xl mx-auto px-6 pt-12 space-y-12 animate-fadeIn">
              
              <div className="border-b border-slate-800 pb-4 space-y-2 text-center">
                <Coins className="h-10 w-10 text-blue-500 mx-auto" />
                <h2 className="text-3xl font-sans font-bold text-white tracking-tight">Vetted SaaS Pricing & Simulated Stripe Invoicing</h2>
                <p className="text-xs text-slate-400 max-w-xl mx-auto mt-1 leading-relaxed">
                  HelixVault integrates directly with simulated Stripe Checkout endpoints. Drag our physical volume slider below to estimate molecular codon requirements, synthesize quotes instantly, and pick your active subscription tier.
                </p>
              </div>

              {/* SLIDER SPECIFIC ESTIMATOR TOOL */}
              <div className="p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
                <div className="space-y-2 border-b border-slate-850 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-sans font-bold text-white text-md tracking-tight flex items-center gap-1.5">
                      <Sliders className="h-5 w-5 text-blue-400" />
                      <span>Live Quote Volumetric Estimator</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Drag to modify your target data cold retention archive size.</p>
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 font-mono px-2.5 py-0.5 border border-blue-500/20 rounded font-bold uppercase">
                    1 TB = ~3 Million Base Pairs Codon Block
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* ESTIMATOR SLIDER BLOCK (7 COLS) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-350">
                      <span>Minimum archive: <strong>5 Terabytes</strong></span>
                      <span className="text-white bg-blue-600 px-3 py-1 font-bold rounded-lg font-sans text-xs">
                        Target Capacity: {customStorageTB} TB
                      </span>
                      <span>Maximum: <strong>1,000 TB (1 PT)</strong></span>
                    </div>

                    <div className="space-y-4">
                      <input 
                        type="range"
                        min={5}
                        max={1000}
                        step={5}
                        value={customStorageTB}
                        onChange={(e) => setCustomStorageTB(parseInt(e.target.value))}
                        className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                        id="quote-capacity-slider"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-center">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Consortium Base Pairs Needed</span>
                        <strong className="text-sm font-mono text-blue-400 tracking-tight block mt-1">
                          {estimatedBasePairsNeededGb.toLocaleString()} Billion Bases
                        </strong>
                      </div>
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-center">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Chemical Synthesis Cost (Est.)</span>
                        <strong className="text-sm font-mono text-emerald-400 tracking-tight block mt-1">
                          ${estimatedMonthlyBaseSynthesisUSD.toLocaleString()} / mo
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* RECOMMENDATION ACTION BOX (5 COLS) */}
                  <div className="lg:col-span-5 p-5 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[9px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase">
                        HelixVault Direct Suggestion
                      </span>
                      <h4 className="font-sans font-bold text-white text-sm">Recommended Subscription Contract</h4>
                      <p className="text-xs text-slate-450 text-slate-400 leading-relaxed text-pretty">
                        Based on your requirement of <strong className="text-white">{customStorageTB} Terabytes</strong> coordinates, we suggest entering the <strong className="text-white">{recommendedTier} Tier</strong> layout.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-850 flex items-baseline justify-between">
                      <span className="text-xs text-slate-500">Plan monthly cost start:</span>
                      <strong className="text-xl font-bold font-sans text-white">{recommendedPrice}<span className="text-xs text-slate-500 font-mono"> / mo</span></strong>
                    </div>

                    <button
                      onClick={() => setActiveTab('login')}
                      className="w-full bg-blue-605 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer text-center block mt-1 shadow-sm"
                    >
                      Authenticate to Claim pricing Quote
                    </button>
                  </div>

                </div>
              </div>

              {/* CORE STRIPE TIERS BOX MATRIX */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-sans text-white border-b border-slate-850 pb-2">HelixVault Strategic Subscription Tiers</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* TIER 1 - STARTER */}
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 font-mono px-2 py-0.5 rounded font-bold uppercase">STARTER</span>
                      <h4 className="font-sans font-extrabold text-[#F8FAFC]">Lab Starter</h4>
                      <div className="flex items-baseline space-x-1 pt-1">
                        <span className="text-2xl font-black text-white">$49</span>
                        <span className="text-xs text-slate-500 font-sans">/ mo</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Excellent for academic biological labs verifying GC parity thresholds.</p>
                      <ul className="space-y-1.5 text-[10px] text-slate-400 leading-normal pt-3 border-t border-slate-850">
                        <li>• Up to 10 sequence conversions</li>
                        <li>• Regular GC-balancing audits</li>
                        <li>• FASTA sequence file downloads</li>
                        <li>• Simulated Stripe checkout</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => setActiveTab('login')}
                      className="w-full text-center py-2.5 border border-slate-750 hover:border-slate-600 hover:bg-slate-800 text-slate-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Choose Starter
                    </button>
                  </div>

                  {/* TIER 2 - RECOMMENDED PROFESSIONAL */}
                  <div className="p-5 bg-slate-900 border-2 border-blue-500 rounded-xl flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/40 font-mono px-2 py-0.5 rounded font-bold uppercase">RECOMMENDED</span>
                      </div>
                      <h4 className="font-sans font-extrabold text-white">Biotech Pro</h4>
                      <div className="flex items-baseline space-x-1 pt-1">
                        <span className="text-3xl font-black text-white">$249</span>
                        <span className="text-xs text-slate-400 font-sans">/ mo</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Tailored for corporate medicine vaults with active sequence dispatch grids.</p>
                      <ul className="space-y-1.5 text-[10px] text-slate-400 leading-normal pt-3 border-t border-slate-850">
                        <li>• Unlimited sequence conversions</li>
                        <li>• Homopolymer run balancing</li>
                        <li>• Dedicated active provider routing</li>
                        <li>• High-density biological retention</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => setActiveTab('login')}
                      className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      Get Pro Access
                    </button>
                  </div>

                  {/* TIER 3 - BUSINESS */}
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 font-mono px-2 py-0.5 rounded font-bold uppercase">SCALE</span>
                      <h4 className="font-sans font-extrabold text-[#F8FAFC]">Enterprise Scale</h4>
                      <div className="flex items-baseline space-x-1 pt-1">
                        <span className="text-2xl font-black text-white">$799</span>
                        <span className="text-xs text-slate-500 font-sans">/ mo</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Optimized for regional sequencing hubs and clinical trial databases.</p>
                      <ul className="space-y-1.5 text-[10px] text-slate-400 leading-normal pt-3 border-t border-slate-850">
                        <li>• Custom codons mapping schemas</li>
                        <li>• Pre-negotiated lab rates</li>
                        <li>• Automated pathogen scanners</li>
                        <li>• gRPC molecular stream access</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => setActiveTab('login')}
                      className="w-full text-center py-2.5 border border-slate-750 hover:border-slate-600 hover:bg-slate-800 text-slate-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Choose Scale
                    </button>
                  </div>

                  {/* TIER 4 - ENTERPRISE Gov-consortium */}
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 font-mono px-2 py-0.5 rounded font-bold uppercase">SECURE</span>
                      <h4 className="font-sans font-extrabold text-[#F8FAFC]">Gov-Consortium</h4>
                      <div className="flex items-baseline space-x-1 pt-1">
                        <span className="text-2xl font-black text-white">$2,499</span>
                        <span className="text-xs text-slate-500 font-sans">/ mo</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Bespoke national security double-helix cold storage databases.</p>
                      <ul className="space-y-1.5 text-[10px] text-slate-400 leading-normal pt-3 border-t border-slate-850">
                        <li>• Air-gapped ambient dry preservation</li>
                        <li>• Multi-signature approval layers</li>
                        <li>• Biosecurity pathogen logs</li>
                        <li>• Custom chemical base SLA</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => setActiveTab('login')}
                      className="w-full text-center py-2.5 border border-slate-750 hover:border-slate-600 hover:bg-slate-800 text-slate-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Inquire Custom Code
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SECURE WEB SIGN IN PORTAL */}
          {activeTab === 'login' && (
            <div className="max-w-md mx-auto px-6 pt-16 md:pt-24 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                {/* HEAD DETAILS */}
                <div className="text-center space-y-1">
                  <div className="h-10 w-10 rounded-xl bg-blue-605 bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3 shadow shadow-blue-500/20">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-sans font-bold text-white tracking-tight">Access HelixVault Console</h3>
                  <p className="text-xs text-slate-400">Secure biochemical storage workspace login</p>
                </div>

                {/* LOGIN ERROR / SUCCESS BANNERS */}
                {authError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {authSuccessMsg && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs flex items-center gap-2 animate-pulse">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
                    <span>{authSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* EMAIL INPUT */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 font-sans block">Client Account E-Mail</label>
                    <div className="relative">
                      <input 
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full text-xs p-3 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:border-blue-500 text-slate-100"
                        placeholder="moatazsalmin@gmail.com"
                      />
                    </div>
                  </div>

                  {/* PARITY ENCRYPTED PASSWORD */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-400 font-sans block">Workspace Password</label>
                      <span className="text-[10px] text-blue-400 hover:underline cursor-pointer">Forgot Key?</span>
                    </div>
                    <input 
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:border-blue-500 text-slate-100 font-mono text-slate-300"
                      placeholder="••••••••••••••"
                    />
                  </div>

                  {/* BIO-METRIC MFA CHECK */}
                  <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-850 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        id="mfa-checkbox-node"
                        checked={mfaCheckbox}
                        onChange={(e) => setMfaCheckbox(e.target.checked)}
                        className="h-4 w-4 bg-[#0F172A] border-slate-800 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="mfa-checkbox-node" className="text-[11px] font-bold text-slate-300 font-sans cursor-pointer flex items-center gap-1.5">
                        <Lock className="h-3 w-3 text-blue-400" />
                        <span>Force Simulated Cryptographic MFA Handshake</span>
                      </label>
                    </div>

                    {mfaCheckbox && (
                      <div className="space-y-1.5 pt-1.5 border-t border-slate-900">
                        <p className="text-[10px] text-slate-450 text-slate-500 leading-normal">
                          We’ve simulated sending an OTP challenge code to your authenticated biosecurity mobile terminal.
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500">MFA Challenge:</span>
                          <input 
                            type="text"
                            required={mfaCheckbox}
                            className="bg-slate-900 border border-slate-800 rounded font-mono text-xs px-2 py-0.5 text-blue-400 w-20 text-center font-bold focus:outline-none focus:border-blue-500"
                            value={mfaChallengeCode}
                            onChange={(e) => setMfaChallengeCode(e.target.value)}
                          />
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 rounded font-mono">CODE READY</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SUBMISSIVE LAUNCH CONTROLLER BUTTON */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-xs py-3 font-bold text-white rounded-lg transition-all shadow-md shadow-blue-500/15 cursor-pointer block text-center mt-3"
                  >
                    Authenticate and Launch DNA Console
                  </button>
                </form>

                {/* TEST CREDENTIAL INFO */}
                <div className="p-3.5 bg-blue-500/5 rounded-xl border border-blue-500/15 text-[10px] text-slate-400 leading-normal">
                  <p className="font-sans font-bold text-blue-400 mb-1 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" /> Quick Demo Credentials Info:
                  </p>
                  No configuration is required. We preloaded the tenant secrets above so you can test secure operations immediately. Simply press <strong>Authenticate</strong> to unpack.
                </div>
              </div>
            </div>
          )}

        </main>

        {/* PUBLIC FOOTER */}
        <footer className="border-t border-slate-900 bg-slate-950/70 p-8 text-xs text-slate-500 font-sans mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2.5">
              <Dna className="h-4.5 w-4.5 text-blue-500" />
              <span>© {new Date().getFullYear()} HelixVault Inc. • Molecular Data Archival Protocols Standards</span>
            </div>
            
            <div className="flex items-center gap-6 text-[11px]">
              <button onClick={() => { setActiveTab('landing'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-white transition-colors cursor-pointer">Product</button>
              <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors cursor-pointer">About DNA Labs</button>
              <button onClick={() => setActiveTab('pricing')} className="hover:text-white transition-colors cursor-pointer">Stripe Pricing</button>
              <span className="text-slate-700">|</span>
              <span className="text-[10px] font-mono text-slate-600">SOC2 compliant • HIPAA ready • IGSC biosecurity screening</span>
            </div>
          </div>
        </footer>

      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#0F172A] text-slate-100 flex flex-col justify-between border-r border-slate-850 shrink-0">
        <div className="flex flex-col overflow-y-auto">
          {/* LOGO BOX */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3 bg-slate-900/40">
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-500/20">
              <Dna className="h-4.5 w-4.5 text-white stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-lg tracking-tight leading-none text-white">HelixVault</h1>
              <p className="text-[9px] text-blue-400 font-mono tracking-widest mt-1">THE STRIPE OF DNA</p>
            </div>
          </div>

          {/* ACTIVE TENANT PROFILE */}
          <div className="p-4 mx-4 my-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <User className="h-4 w-4 text-blue-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-slate-500 font-mono leading-none">WORKSPACE</p>
                <p className="text-xs font-semibold text-white truncate mt-1">moatazsalmin@gmail.com</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-bold">PLAN:</span>
              <span className="font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-bold uppercase text-[9px]">
                {currentTier}
              </span>
            </div>
          </div>

          {/* MENUS */}
          <nav className="px-3 space-y-1 mt-2">
            <p className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Main Operations</p>
            
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-left transition-all ${activeTab === 'dashboard' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
            >
              <span className="flex items-center space-x-2.5">
                <Activity className="h-4 w-4" />
                <span>Dashboard</span>
              </span>
              <ArrowUpRight className={`h-3 w-3 opacity-60 ${activeTab === 'dashboard' ? 'text-blue-400' : 'text-slate-500'}`} />
            </button>

            <button 
              onClick={() => setActiveTab('encoder')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-left transition-all ${activeTab === 'encoder' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
            >
              <span className="flex items-center space-x-2.5">
                <Cpu className="h-4 w-4" />
                <span>Sequence Forge</span>
              </span>
              <span className="text-[9px] bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded font-mono">LAB</span>
            </button>

            <button 
              onClick={() => setActiveTab('vault')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-left transition-all ${activeTab === 'vault' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
            >
              <span className="flex items-center space-x-2.5">
                <Archive className="h-4 w-4" />
                <span>Archive Explorer</span>
              </span>
              <span className="text-[10px] font-mono text-slate-550">{archives.length} files</span>
            </button>

            <p className="px-3 py-1 pt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Infrastructure</p>

            <button 
              onClick={() => setActiveTab('adapters')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-left transition-all ${activeTab === 'adapters' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
            >
              <span className="flex items-center space-x-2.5">
                <Layers className="h-4 w-4" />
                <span>Provider Layer</span>
              </span>
              <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1 py-0.5 rounded font-mono">SDK</span>
            </button>

            <button 
              onClick={() => setActiveTab('marketplace')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-left transition-all ${activeTab === 'marketplace' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
            >
              <span className="flex items-center space-x-2.5">
                <Globe className="h-4 w-4" />
                <span>Marketplace</span>
              </span>
              <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">PHASE 3</span>
            </button>

            <button 
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-left transition-all ${activeTab === 'billing' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
            >
              <span className="flex items-center space-x-2.5">
                <Coins className="h-4 w-4" />
                <span>Billing & Invoices</span>
              </span>
              <CheckCircle className="h-3.5 w-3.5 text-blue-400" />
            </button>

            <button 
              onClick={() => setActiveTab('specs')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-left transition-all ${activeTab === 'specs' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
            >
              <span className="flex items-center space-x-2.5">
                <Database className="h-4 w-4" />
                <span>API Gateway (Specs)</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">ERD</span>
            </button>
          </nav>
        </div>

        {/* SYSTEM STATUS FOOTER */}
        <div className="p-4 border-t border-slate-850 bg-slate-950/40 space-y-3">
          
          <button 
            onClick={handleLogout}
            className="w-full h-8 flex items-center justify-center space-x-2 py-1.5 px-3 bg-red-950/30 hover:bg-red-900/35 border border-red-900/30 text-red-400 hover:text-red-300 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out of Console</span>
          </button>

          <div className="text-[10px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-sans font-semibold uppercase tracking-wider text-slate-500">Core Engine Online</span>
              <span className="flex items-center text-blue-400 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping mr-1.5"></span>
                LIVE ACTIVE
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Server Band</span>
              <span className="font-mono text-slate-400">0.0.0.0:3000</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Rigor Compliance</span>
              <span className="font-mono text-blue-500 font-bold">SOC2 / ISO-27001</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
        
        {/* TOP BAR INFORMATION */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <span>Project Genesis</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">DNA Archive hlv_7s29d</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Core Engine Online</span>
            </div>
            <button 
              onClick={() => setActiveTab('encoder')}
              className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
            >
              New Sequence
            </button>
          </div>
        </header>

        {/* CONTAINER SCROLL BAR */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {fetchError && (
            <div className="p-6 bg-red-50 rounded-xl border border-red-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans font-bold text-red-950 text-sm tracking-tight">HelixVault Gateway Unreachable</h4>
                  <p className="text-xs text-red-750 mt-1 leading-relaxed">
                    Could not load DNA databases. The API service is currently offline or restarting: <code className="bg-red-100/70 border border-red-250/20 px-1.5 py-0.5 rounded text-[10px] font-mono text-red-800">{fetchError}</code>
                  </p>
                </div>
              </div>
              <button
                onClick={fetchInitialData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-center space-y-4">
                <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin mx-auto" />
                <div>
                  <p className="font-sans font-semibold text-slate-800">Synchronizing with Molecular Storage APIs...</p>
                  <p className="text-xs text-slate-400 font-mono mt-1">Downloading archives, tracking jobs, compiling investor reporting metrics</p>
                </div>
              </div>
            </div>
          )}

          {!loading && (
            <>
              {/* TARGET VISIBLE TAB CONTROLLERS */}

              {/* TAB 1: EXECUTIVE DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* BENNER CARD */}
                  <div className="p-8 bg-slate-900 rounded-xl relative overflow-hidden border border-slate-800 text-white shadow-xl shadow-slate-950/20">
                    <div className="absolute top-0 right-0 h-full w-2/3 bg-radial from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>
                    <div className="relative z-10 max-w-2xl space-y-3">
                      <div className="inline-flex items-center space-x-2 bg-blue-550/10 border border-blue-500/35 px-3 py-1 rounded-full text-xs text-blue-400 font-mono font-bold">
                        <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
                        <span>VENTURE PARTNERS BRIEFING (Andreessen / Sequoia Ready)</span>
                      </div>
                      <h2 className="font-sans font-bold text-3xl tracking-tight leading-tight text-white md:text-4xl text-pretty">
                        Molecular SaaS DNA Preservation Engine
                      </h2>
                      <p className="text-slate-300 text-sm leading-relaxed max-w-xl text-pretty">
                        HelixVault is the standard integration framework transforming digital file streams into durable, un-hackable, high-density biological sequences. We configure the standard client-provider routing layer, shielding databases from hardware lock-in.
                      </p>
                      <div className="pt-4 flex items-center space-x-3">
                        <button 
                          onClick={() => setActiveTab('encoder')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white font-semibold rounded-lg text-xs transition-all shadow-md shadow-blue-500/10 flex items-center cursor-pointer"
                        >
                          Launch Encoder Lab <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => setActiveTab('specs')}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-lg text-xs transition-all cursor-pointer"
                        >
                          Inspect Database Schema (ERD)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BENTO GRID VC METRICS PANEL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-slate-400 text-[10px] font-sans font-bold tracking-widest uppercase">
                          <span>ANNUAL RUN RATE (ARR)</span>
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-sans font-bold text-slate-900 mt-2">
                          ${((metrics?.arr || 214500) / 1000).toFixed(1)}k
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-105 flex items-center justify-between text-[11px] text-slate-400">
                        <span>MRR base: <strong className="text-slate-700 font-mono">${metrics?.mrr.toLocaleString()}</strong></span>
                        <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full font-mono">+8.4% MoM</span>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-slate-400 text-[10px] font-sans font-bold tracking-widest uppercase">
                          <span>MOLECULAR ENCODED</span>
                          <Dna className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-sans font-bold text-slate-900 mt-2">
                          {metrics?.totalNucleotidesSynthesized.toLocaleString()} bases
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-105 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Equivalent weight:</span>
                        <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                          {metrics?.totalDataEncodedGb} GB
                        </span>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-slate-400 text-[10px] font-sans font-bold tracking-widest uppercase">
                          <span>UNIT ECONOMICS (LTV:CAC)</span>
                          <Coins className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-sans font-bold text-slate-900 mt-2">
                          {((metrics?.ltvUSD || 14500) / (metrics?.cacUSD || 3100)).toFixed(1)}x ratio
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-105 flex items-center justify-between text-[11px] text-slate-400">
                        <span>LTV: <strong className="text-slate-700 font-mono">${(metrics?.ltvUSD || 14500).toLocaleString()}</strong></span>
                        <span>CAC: <strong className="text-slate-700 font-mono">${(metrics?.cacUSD || 3100).toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-slate-400 text-[10px] font-sans font-bold tracking-widest uppercase">
                          <span>MARKETPLACE MARGINS</span>
                          <Globe className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-sans font-bold text-slate-900 mt-2">
                          {metrics?.unitEconomicsProfitMargin}% gross
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-105 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Take-rate fee:</span>
                        <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                          {metrics?.marketplaceTakeRatePercent}% commission
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* ACTIVE SYNTHESIS PIPELINES & ARR GRAPH */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* CHART AREA */}
                    <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <h3 className="font-sans font-bold text-slate-800 text-sm tracking-tight">Monthly Recurring Revenue Runway</h3>
                        <p className="text-xs text-slate-450 mt-1">Accumulated subscriptions and marketplace sequence commission routing fees</p>
                      </div>
                      <div className="h-60 mt-6 font-mono text-[11px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={mrrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <defs>
                               <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                                 <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontStyle="italic"/>
                             <YAxis stroke="#94a3b8" fontSize={11}/>
                             <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                             <Tooltip formatter={(value) => [`$${value}`, 'MRR ($)']} />
                             <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMRR)" />
                           </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* DYNAMIC TRACKING JOBS */}
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="font-sans font-bold text-slate-800 text-sm tracking-tight">Active Synthesis Jobs</h3>
                          <p className="text-xs text-slate-400 mt-0.5 font-sans">Physical laboratory tracking</p>
                        </div>
                        <span className="text-xs bg-slate-100 border border-slate-200 font-mono px-2 py-0.5 rounded text-slate-600">
                          {jobs.length} jobs
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto max-h-60 space-y-3 mt-4 pr-1">
                        {jobs.length === 0 ? (
                          <div className="text-center py-8 text-xs text-slate-400 font-mono">
                            No synthesis jobs active. Generate a sequence to dispatch one.
                          </div>
                        ) : (
                          jobs.map(job => (
                            <div key={job.jobId} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2 text-xs">
                              <div className="flex items-center justify-between font-mono">
                                <span className="font-bold text-slate-700">{job.jobId}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                                  job.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800 animate-pulse'
                                }`}>
                                  {job.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                                <span>Provider: <strong className="text-slate-600">{job.providerId}</strong></span>
                                <span>Bases: <strong className="text-slate-600 font-mono">{job.sequenceLength}</strong></span>
                              </div>
                              <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[10px]">
                                <span className="font-mono text-slate-500">Route fee: ${job.costUSD}</span>
                                {job.status !== 'COMPLETED' && job.status !== 'FAILED' && (
                                  <button 
                                    onClick={() => handleDispatchSynthesisJob(job.jobId)}
                                    className="px-2 py-0.5 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-700 font-semibold rounded text-[9px] transition-all flex items-center cursor-pointer"
                                  >
                                    Progress Step <ArrowRight className="h-2 w-2 ml-1" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: PROPRIETARY DNA ENCODER LAB */}
              {activeTab === 'encoder' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="font-sans font-bold text-xl text-slate-900 tracking-tight">DNA Compression & Encoding Laboratory</h2>
                    <p className="text-xs text-slate-500 mt-1">Transform any message or digital payload into stabilized, GC-balanced biological genetic sequence formats.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* INPUT FORM (5 COLS) */}
                    <div className="lg:col-span-5 p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-slate-800 font-semibold border-b border-slate-100 pb-3">
                          <Cpu className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-sans font-bold leading-none">Define Payload Parameters</span>
                        </div>

                        <div className="space-y-1.5ClassName">
                          <label className="text-xs font-bold text-slate-600 font-sans block">File Name Archive Label</label>
                          <input 
                            type="text" 
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g. data_points.txt"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 font-sans block">Original Text / Binary String Contents</label>
                          <textarea 
                            value={fileText}
                            onChange={(e) => setFileText(e.target.value)}
                            rows={6}
                            className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                            placeholder="Input contents..."
                          />
                          <p className="text-[10px] text-slate-400 font-mono text-right">{fileText.length} characters</p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 font-sans block">Pre-Cryptographic Cipher Wrapping</label>
                          <select 
                            value={encryptionStandard}
                            onChange={(e) => setEncryptionStandard(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="AES-256GCM + Molecular parity check">AES-256GCM + Molecular parity check</option>
                            <option value="ChaCha20-Poly1305 + alternate rotation">ChaCha20-Poly1305 + alternate rotation</option>
                            <option value="Plaintext + Reed-Solomon Direct">Plaintext + Reed-Solomon Direct</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 font-sans block">Target Physical Provider (Fee & Delivery Predictor)</label>
                          <select 
                            value={targetProviderId}
                            onChange={(e) => setTargetProviderId(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {REGISTERED_DNA_PROVIDERS.filter(p => p.synthesisCostPerBaseUSD > 0).map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} (${p.synthesisCostPerBaseUSD}/base, {p.turnaroundTimeDays}d delivery)
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button 
                        onClick={handleEncodeDNA}
                        disabled={encodingProgress}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer mt-4"
                      >
                        {encodingProgress ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin text-white" />
                            <span>ENCODING & BALANCING NUCLEOTIDES...</span>
                          </>
                        ) : (
                          <>
                            <Dna className="h-4 w-4 text-white" />
                            <span>ENCODE TO STABILIZED DNA</span>
                          </>
                        )}
                      </button>

                    </div>

                    {/* PIPELINE OUTPUT (7 COLS) */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {!lastEncodeResult ? (
                        <div className="p-12 bg-white rounded-xl border border-slate-200 shadow-xs text-center text-slate-400 space-y-3">
                          <Dna className="h-10 w-10 text-slate-300 mx-auto stroke-[1.5]" />
                          <div>
                            <p className="text-sm font-semibold text-slate-700">Encoding pipeline idle</p>
                            <p className="text-xs font-sans max-w-sm mx-auto mt-1">Submit a file payload to trigger compression, GC balancing, biosecurity screening, and FASTA creation.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6 animate-fadeIn">
                          
                          {/* METRICS SUMMARY CARD */}
                          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <span className="text-[10px] bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded font-sans font-semibold flex items-center">
                                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-blue-600" />
                                Biosecurity Screen Pass: Registered Threat Hazards 0
                              </span>
                              <span className="text-xs text-slate-400 font-mono">Processed in {lastEncodeResult.report.durationMs}ms</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                                <p className="text-[10px] text-slate-400 font-mono">NUCLEOTIDES</p>
                                <p className="text-base font-sans font-bold text-slate-800 mt-1">{lastEncodeResult.report.nucleotideCount}</p>
                              </div>
                              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                                <p className="text-[10px] text-slate-400 font-mono">GC-CONTENT</p>
                                <p className="text-base font-sans font-bold text-slate-800 mt-1">{lastEncodeResult.report.gcContent}%</p>
                              </div>
                              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                                <p className="text-[10px] text-slate-400 font-mono">STABILITY SCORE</p>
                                <p className="text-base font-sans font-bold text-blue-650 mt-1">{lastEncodeResult.report.integrityScore}/100</p>
                              </div>
                              <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                                <p className="text-[10px] text-slate-400 font-mono">HOMOPOLYMER CUT</p>
                                <p className="text-base font-sans font-bold text-slate-800 mt-1">{lastEncodeResult.optReplacements}</p>
                              </div>
                            </div>

                            <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-2">
                              <span>Estimated partner routing dispatch fee:</span>
                              <strong className="text-slate-800 font-sans text-xs">${lastEncodeResult.job.costUSD} USD @ {targetProviderId}</strong>
                            </div>
                          </div>

                          {/* FASTA FILE PREVIEW */}
                          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg font-mono text-xs text-slate-100 flex flex-col justify-between">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                              <span className="flex items-center text-blue-400 font-bold space-x-1.5 font-sans">
                                <FileText className="h-4 w-4" />
                                <span>Bioinformatics FastA Representation</span>
                              </span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(lastEncodeResult.archive.fastaString);
                                }}
                                className="px-2.5 py-1 bg-slate-800 border border-slate-700 hover:bg-slate-705 text-slate-300 font-semibold rounded text-[10px] transition-all flex items-center space-x-1 cursor-pointer"
                              >
                                <Download className="h-3 w-3" />
                                <span>Copy FastA</span>
                              </button>
                            </div>
                            <div className="max-h-36 overflow-y-auto bg-slate-950 p-3 rounded-lg border border-slate-800/80 select-all font-mono text-[11px] text-slate-300 leading-snug whitespace-pre-wrap sequence-scrollbar">
                              {lastEncodeResult.archive.fastaString}
                            </div>
                          </div>

                          {/* PROPRIETARY CHUNKING & INDEXING STREAMS */}
                          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
                            <div className="pb-3 border-b border-slate-100">
                              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide font-sans">Fragmented Oligonucleotide Packets ({lastEncodeResult.oligos.length} chains)</h4>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Headers contain binary base indexes, with trailing parity nucleotide validation.</p>
                            </div>
                            <div className="max-h-40 overflow-y-auto space-y-2 mt-4 pr-1">
                              {lastEncodeResult.oligos.map((ol: any) => (
                                <div key={ol.index} className="flex items-center space-x-2 text-[10px] font-mono p-2 bg-slate-50 border border-slate-100 rounded-lg">
                                  <span className="text-[9px] bg-blue-50 border border-blue-200 text-blue-700 px-1.5 rounded uppercase leading-none py-1 font-bold">Oligo {ol.index}</span>
                                  <span className="text-slate-450">Idx: <strong className="text-slate-700">{ol.header}</strong></span>
                                  <span className="text-blue-620 bg-blue-50/50 px-2 py-0.5 rounded flex-1 select-all font-semibold tracking-wider font-mono">{ol.sequence}</span>
                                  <span className="text-slate-400">Parity: <strong className="text-slate-700">{ol.parity}</strong></span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* GEMINI ADVISORY BOARD ACCORDION */}
                          <div className="p-5 bg-emerald-950 text-emerald-100 rounded-2xl border border-emerald-800 flex flex-col justify-between shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 h-32 w-32 bg-radial from-emerald-400/20 to-transparent pointer-events-none"></div>
                            <div className="relative z-10 border-b border-emerald-800 pb-3 mb-3 flex items-center justify-between">
                              <span className="flex items-center text-sm font-semibold space-x-2">
                                <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                                <span>Gemini In-Silico Synthesizability Advisory</span>
                              </span>
                              <span className="text-[9px] bg-emerald-400/20 text-emerald-300 font-mono border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                                Model: gemini-3.5-flash
                              </span>
                            </div>
                            
                            {loadingGemini ? (
                              <div className="flex items-center justify-center py-6 space-x-3 text-emerald-300">
                                <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                                <span className="text-xs font-mono">Generative biosynthesizer advisory computing...</span>
                              </div>
                            ) : (
                              <div className="text-xs text-pretty leading-relaxed text-emerald-200 select-all font-sans whitespace-pre-wrap max-h-52 overflow-y-auto pr-1 select-text">
                                {geminiReport || "Pipeline advisory pending. Submit sequence to optimize."}
                              </div>
                            )}
                          </div>

                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 3: DIGITAL DNA VAULT & SIMULATED DECAY */}
              {activeTab === 'vault' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="font-sans font-bold text-xl text-slate-900 tracking-tight">Digital Molecular Archival Vault & Retrieval</h2>
                    <p className="text-xs text-slate-500 mt-1">Browse archives. Safely simulate molecular genetic damage caused by centuries of extreme heat or decay, and restore data bit-perfectly via Parity recovery checking.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* ARCHIVE COLLECTION (7 COLS) */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div className="border-b border-slate-100 pb-3 mb-4">
                          <h3 className="font-sans font-bold text-slate-800 text-sm tracking-tight">Long-Term Storage Repositories</h3>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">Encapsulated biological vectors</p>
                        </div>

                        {archives.length === 0 ? (
                          <div className="text-center py-12 text-slate-400 space-y-2">
                            <Archive className="h-8 w-8 text-slate-300 mx-auto" />
                            <p className="text-xs font-mono">No files archived yet. Visit the Encoder Lab.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {archives.map(arc => (
                              <div key={arc.id} className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 ${
                                selectedDecayArchiveId === arc.id ? 'bg-[#0f172a] text-white border-slate-800 shadow' : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                              }`}>
                                <div 
                                  onClick={() => setSelectedDecayArchiveId(arc.id)}
                                  className="cursor-pointer space-y-1.5 flex-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <FileText className={`h-4.5 w-4.5 ${selectedDecayArchiveId === arc.id ? 'text-blue-450' : 'text-slate-500'}`} />
                                    <h4 className="font-sans font-bold text-sm tracking-tight">{arc.name}</h4>
                                  </div>
                                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                                    <span>id: <strong className={selectedDecayArchiveId === arc.id ? 'text-slate-200':'text-slate-600'}>{arc.id}</strong></span>
                                    <span>•</span>
                                    <span>Size: <strong className={selectedDecayArchiveId === arc.id ? 'text-slate-200':'text-slate-600'}>{arc.originalSizeBytes} bytes</strong></span>
                                    <span>•</span>
                                    <span>Length: <strong className={selectedDecayArchiveId === arc.id ? 'text-blue-400':'text-blue-600'}>{arc.nucleotideLength} bases</strong></span>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3 text-xs md:shrink-0">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                                    arc.status === 'SAFE' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                    arc.status === 'DEGRADED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                    'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                                  }`}>
                                    {arc.status}
                                  </span>

                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteArchive(arc.id);
                                    }}
                                    className="p-1 px-2 border border-slate-200/25 hover:border-red-400/40 hover:bg-red-500 hover:text-white rounded text-slate-400 transition-all cursor-pointer"
                                    title="Wipe archival"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* SIMULATION AUDIT LOGS HISTORY */}
                      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div className="border-b border-slate-100 pb-3 mb-4">
                          <h3 className="font-sans font-semibold text-slate-800 text-sm tracking-tight">Historical Retrieval & Error-Correction Audits</h3>
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-1 font-mono text-[11px]">
                          {retrievalLogs.length === 0 ? (
                            <div className="text-center py-6 text-slate-400">No audits executed. Simulate decay on the right.</div>
                          ) : (
                            retrievalLogs.map(log => {
                              const related = archives.find(a => a.id === log.archiveId);
                              return (
                                <div key={log.id} className="p-2.5 bg-slate-50 block border border-slate-200/60 rounded-lg space-y-1">
                                  <div className="flex items-center justify-between text-slate-700 font-sans font-semibold">
                                    <span className="font-bold">AUDIT: {log.id}</span>
                                    <span className="text-[9px] text-slate-450 font-normal font-sans">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 text-sans">Target archive: <strong className="text-slate-600">{related?.name || log.archiveId}</strong></p>
                                  <div className="grid grid-cols-3 gap-1 pt-1 text-[9px] text-slate-500 font-sans">
                                    <span>Decay rate: <strong className="text-red-500 font-mono">{log.simulatedDecayRate}%</strong></span>
                                    <span>Mutated: <strong className="text-slate-600 font-mono">{log.mutationsDetected} bases</strong></span>
                                    <span>Corrected: <strong className="text-blue-600 font-bold">Bit-Perfect ({log.mutationsCorrected})</strong></span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                    </div>

                    {/* INTERACTIVE CHEMICAL RETRIEVAL EXPERIMENT (5 COLS) */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
                        <div className="flex items-center space-x-2 text-slate-800 font-bold border-b border-slate-150 pb-3">
                          <Sliders className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-sans font-bold leading-none">Molecular Simulation</span>
                        </div>

                        {!selectedDecayArchiveId ? (
                          <div className="text-center py-12 text-slate-400 font-sans text-xs">
                            Select an archive from the list on the left to begin chemical test.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            
                            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                              <span className="text-[10px] text-blue-400 font-mono block tracking-wider font-bold">CURRENT ACTIVE DNA SEQUENCE</span>
                              <div className="font-mono text-[10px] bg-slate-950 p-2.5 text-blue-500 leading-snug rounded select-all break-all overflow-y-auto max-h-24 sequence-scrollbar">
                                {archives.find(a => a.id === selectedDecayArchiveId)?.nucleotideData}
                              </div>
                            </div>

                            <div className="space-y-2 pt-2">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-700 font-sans">
                                <span>Simulate Physical Decay Rate</span>
                                <span className="font-mono text-red-550">{decayRate}% mutant rate</span>
                              </div>
                              <input 
                                type="range" 
                                min={1} 
                                max={40} 
                                value={decayRate}
                                onChange={(e) => setDecayRate(Number(e.target.value))}
                                className="w-full bg-slate-200 h-1.5 rounded-full cursor-pointer accent-blue-600"
                              />
                              <p className="text-[10px] text-slate-450 leading-relaxed font-sans mt-1">
                                Higher rates simulate prolonged centuries of heat/radiation. The integrity algorithm uses integrated check-blocks to track mutated sequence segments.
                              </p>
                            </div>

                            <button 
                              onClick={handleSimulateDecayRetrieval}
                              disabled={decodingProgress}
                              className="w-full py-3 border border-blue-200 hover:border-blue-600 hover:bg-blue-50 text-blue-700 font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer mt-2"
                            >
                              {decodingProgress ? (
                                <>
                                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                                  <span>MUTATING & ERROR CORRECTING...</span>
                                </>
                              ) : (
                                <>
                                  <Sliders className="h-4 w-4 text-blue-600 animate-pulse" />
                                  <span>SIMULATE DEGRADED RETRIEVAL</span>
                                </>
                              )}
                            </button>

                          </div>
                        )}
                        
                      </div>

                      {/* DECAY DECISION ENGINE RESULTS BOARD */}
                      {decayResult && (
                        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4 animate-fadeIn">
                          <div className="pb-2 border-b border-slate-105 flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>RECONSTRUCTION SUCCESS</span>
                            <Check className="h-4 w-4 text-blue-500 font-bold" />
                          </div>

                          <div className="space-y-1 font-mono text-[11px] text-slate-500 leading-relaxed">
                            <div className="flex justify-between">
                              <span>Mutated bases detected:</span>
                              <strong className="text-red-500">{decayResult.log.mutationsDetected} bases</strong>
                            </div>
                            <div className="flex justify-between border-b border-slate-105 pb-1 mb-1">
                              <span>Errors corrected mod-parity:</span>
                              <strong className="text-blue-650">All ({decayResult.log.mutationsCorrected})</strong>
                            </div>
                            <div className="pt-1.5">
                              <span className="text-[10px] text-slate-400 leading-snug block mb-1 uppercase font-bold text-slate-600 font-sans">Retrieved Decrypted Original:</span>
                              <div className="p-3 bg-slate-50 border border-slate-200/85 rounded-lg text-slate-800 text-[11px] font-mono leading-relaxed select-text select-all overflow-y-auto max-h-32">
                                {decayResult.restoredData}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 4: PARTNER PROVIDERS SDK ADAPTERS */}
              {activeTab === 'adapters' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="font-sans font-bold text-xl text-slate-900 tracking-tight font-sans">Provider Abstraction Middleware SDK</h2>
                    <p className="text-xs text-slate-500 mt-1">Design schema interface and boilerplate SDK adapters to stream sequence payloads into third-party synthesis hardware platforms dynamically.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* ADAPTER CONTRACT EXPLORER */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 shadow-sm pb-5">
                        <div className="border-b border-slate-800 pb-4 mb-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Terminal className="h-5 w-5 text-blue-400 stroke-[2.5]" />
                            <span className="font-bold text-sm text-white">HelixVault SDK REST API Contract</span>
                          </div>
                          <span className="text-[10px] bg-slate-800 text-slate-400 font-mono border border-slate-750 px-2 py-0.5 rounded font-bold">v2.4.1</span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          Our pipeline exports digital objects into biochemical sequences, subsequent to dispatching structured REST orders to authorized DNA providers (e.g., Twist Bioscience / IDT) securely. Use this JSON signature to construct programmatic client endpoints.
                        </p>

                        <div className="font-mono text-[10px] bg-slate-950 p-4 rounded-xl border border-slate-800 leading-normal text-blue-400 overflow-x-auto whitespace-pre">
{`{
  "api_version": "2026-06-19",
  "client_id": "hlv_tenant_moatazsalmin",
  "biosecurity_credentials": {
    "hhs_compliance_token": "HHS-BIO-910D-CLIA",
    "screening_hash": "hs_9fb289aacd12410a0"
  },
  "sequence_specification": {
    "target_molecule_name": "sequencing_proposal_draft.md",
    "strand_type": "ssDNA_oligonucleotides",
    "total_nucleotide_bases": 312,
    "oligo_fragments_count": 16,
    "oligos": [
      {
        "index": 0,
        "index_header": "AAAA",
        "bases_payload": "CTTTATGCATGCATGCATGC",
        "parity_nucleotide_check": "C"
      }
    ]
  },
  "destination_storage_vial_vessel": "Twist-standard-96-well-microplate"
}`}
                        </div>
                      </div>

                    </div>

                    {/* SDK FEATURES ADAPTER ACTIONS (5 COLS) */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                        <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                          <h4 className="font-sans font-bold text-slate-800 text-sm">Supported APIs Middleware Adapters</h4>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] border border-blue-200 font-bold rounded-full">Phase 2 Specs</span>
                        </div>

                        <div className="space-y-4 text-xs text-slate-500 leading-normal">
                          <p>
                            To route synthesized assets without altering database tables, we integrate the following adapters aligned with international partner standards:
                          </p>

                          <div className="space-y-2 font-mono text-[11px]">
                            
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between font-sans">
                              <div>
                                <span className="font-bold text-slate-800 text-xs">Twist Bioscience</span>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">POST https://api.twist.com/v2/synthesis</p>
                              </div>
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 rounded-full font-bold">READY</span>
                            </div>

                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between font-sans">
                              <div>
                                <span className="font-bold text-slate-800 text-xs">Integrated DNA (IDT)</span>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">POST /idt-gateway/synthesize</p>
                              </div>
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 rounded-full font-bold">READY</span>
                            </div>

                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between font-sans">
                              <div>
                                <span className="font-bold text-slate-800 text-xs">Biomemory Preservation</span>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">POST /biomemory/card-issue</p>
                              </div>
                              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 rounded-full font-bold">ACTIVE</span>
                            </div>

                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 5: STORAGE MARKETPLACE PLATFORM */}
              {activeTab === 'marketplace' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="font-sans font-bold text-xl text-slate-900 tracking-tight">DNA Storage Marketplace Network</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage partner verify certificates, price-caps, on-demand dispatch routing, and client ratings in the decentralized molecular platform.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* B2B LISTINGS DISPLAY (7 COLS) */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                          <h3 className="font-sans font-bold text-slate-800 text-sm tracking-tight">Verified Physical Providers Pool</h3>
                        </div>

                        <div className="space-y-4">
                          {listings.map(lst => {
                            const config = REGISTERED_DNA_PROVIDERS.find(p => p.id === lst.providerId);
                            return (
                              <div key={lst.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-sans font-bold text-sm text-slate-800">{lst.displayName}</h4>
                                    {lst.isVerified && (
                                      <CheckCircle className="h-4 w-4 text-blue-600" title="Security Verified" />
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-600">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                                    <span>{lst.ratingAverage}</span>
                                    <span className="text-slate-400">({lst.ratingCount} reviews)</span>
                                  </div>
                                </div>

                                <p className="text-xs text-slate-650 leading-relaxed text-pretty">{lst.description}</p>

                                <div className="flex flex-wrap gap-2 text-[10px] font-mono items-center">
                                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-sans font-bold">{lst.locationCountry}</span>
                                  {lst.complianceCertifications.map(c => (
                                    <span key={c} className="bg-blue-50 text-blue-700 border border-blue-200/50 px-1.5 py-0.5 rounded font-sans font-bold">{c}</span>
                                  ))}
                                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded ml-auto font-sans">Cap: {lst.throughputCapacityGbPerDay} Gb/day</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* ACTIONS FORM (5 COLS) */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* ONBOARD NEW LAB ADAPTER */}
                      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div className="pb-3 border-b border-slate-100 mb-4">
                          <h4 className="font-sans font-bold text-slate-800 text-sm tracking-tight">Onboard Laboratory Partner</h4>
                        </div>

                        <form onSubmit={handleOnboardListing} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 font-sans block">Select Hardware Spec Adapter</label>
                            <select 
                              value={onboardProviderId}
                              onChange={(e) => setOnboardProviderId(e.target.value)}
                              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
                            >
                              <option value="oxford-nanopore">Oxford Nanopore Sequencer Port</option>
                              <option value="illumina">IlluminaNova Bench adapter</option>
                              <option value="atlas-data">Atlas Data capsule facility</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 font-sans block">Display Brand Name</label>
                            <input 
                              type="text" 
                              required
                              value={onboardDisplayName}
                              onChange={(e) => setOnboardDisplayName(e.target.value)}
                              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              placeholder="e.g. Nanopore-UK Sequencing pools"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 font-sans block">Brand Capability Overview</label>
                            <textarea 
                              required
                              value={onboardDesc}
                              onChange={(e) => setOnboardDesc(e.target.value)}
                              rows={2}
                              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                              placeholder="Describe custom features..."
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-blue-500/10"
                          >
                            <PlusCircle className="h-4 w-4" />
                            <span>ONBOARD ACTIVE LAB</span>
                          </button>
                        </form>
                      </div>

                      {/* CLIENT RATING FEEDBACK MODULE */}
                      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div className="pb-3 border-b border-slate-100 mb-4">
                          <h4 className="font-sans font-bold text-slate-800 text-sm tracking-tight">Post Biochemical Feedback Review</h4>
                        </div>

                        <form onSubmit={handleSubmitRating} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 block">Rate Target</label>
                              <select 
                                value={ratingTargetProviderId}
                                onChange={(e) => setRatingTargetProviderId(e.target.value)}
                                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                              >
                                {listings.map(l => (
                                  <option key={l.id} value={l.providerId}>{l.displayName}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 block">Rating score</label>
                              <select 
                                value={newRatingStars}
                                onChange={(e) => setNewRatingStars(Number(e.target.value))}
                                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                              >
                                <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                                <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                                <option value={3}>⭐⭐⭐ (3/5)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 block">Comment Description</label>
                            <input 
                              type="text" 
                              required
                              value={newRatingComment}
                              onChange={(e) => setNewRatingComment(e.target.value)}
                              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                              placeholder="Review pipeline execution..."
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-2.5 border border-blue-200 hover:border-blue-600 hover:bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Publish Feedbacks
                          </button>
                        </form>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 6: SUBSCRIPTION PLANS & STRIPE BILLING */}
              {activeTab === 'billing' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="font-sans font-bold text-xl text-slate-900 tracking-tight">HelixVault Subscription Plans & Stripe Billing</h2>
                    <p className="text-xs text-slate-500 mt-1">Simulate Stripe Checkout experiences to upgrade active molecular workspace limits and download detailed invoice declarations.</p>
                  </div>

                  {/* subscription CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <div className={`p-6 bg-white rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                      currentTier === 'STARTER' ? 'ring-2 ring-blue-600 border-transparent shadow-lg shadow-blue-500/5' : 'border-slate-200 shadow-xs'
                    }`}>
                      <div className="space-y-2">
                        <span className="text-[10px] bg-slate-100 text-slate-500 border font-mono px-2 py-0.5 rounded font-bold">STARTER</span>
                        <h4 className="font-sans font-bold text-base text-slate-800">Academic Starter</h4>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-3xl font-sans font-extrabold text-slate-900">$49</span>
                          <span className="text-xs text-slate-400 font-sans">/ month</span>
                        </div>
                        <ul className="space-y-2 text-[11px] text-slate-500 leading-normal pt-2 border-t border-slate-100">
                          <li>• 10 sequence conversions</li>
                          <li>• Basic GC-balancing audit</li>
                          <li>• FASTA formatting downloads</li>
                        </ul>
                      </div>
                      <button 
                        onClick={() => handleStripeSubscribe('STARTER')}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentTier === 'STARTER' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {currentTier === 'STARTER' ? 'Active Tier' : 'Checkout Plan'}
                      </button>
                    </div>

                    <div className={`p-6 bg-white rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                      currentTier === 'PROFESSIONAL' ? 'ring-2 ring-blue-600 border-transparent shadow-lg shadow-blue-500/5' : 'border-slate-200 shadow-xs'
                    }`}>
                      <div className="space-y-2">
                        <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-mono px-2 py-0.5 rounded font-bold">RECOMMENDED</span>
                        <h4 className="font-sans font-bold text-base text-slate-800">Biotech Professional</h4>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-3xl font-sans font-extrabold text-slate-900">$249</span>
                          <span className="text-xs text-slate-400 font-sans">/ month</span>
                        </div>
                        <ul className="space-y-2 text-[11px] text-slate-500 leading-normal pt-2 border-t border-slate-100">
                          <li>• Unlimited conversions</li>
                          <li>• Homopolymer runs mitigations</li>
                          <li>• Dynamic Partner API simulator</li>
                        </ul>
                      </div>
                      <button 
                        onClick={() => handleStripeSubscribe('PROFESSIONAL')}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentTier === 'PROFESSIONAL' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {currentTier === 'PROFESSIONAL' ? 'Active Tier' : 'Checkout Plan'}
                      </button>
                    </div>

                    <div className={`p-6 bg-white rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                      currentTier === 'BUSINESS' ? 'ring-2 ring-blue-600 border-transparent shadow-lg shadow-blue-500/5' : 'border-slate-200 shadow-xs'
                    }`}>
                      <div className="space-y-2">
                        <span className="text-[10px] bg-slate-100 text-slate-500 border font-mono px-2 py-0.5 rounded font-bold">SCALE</span>
                        <h4 className="font-sans font-bold text-base text-slate-800">Enterprise Vault</h4>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-3xl font-sans font-extrabold text-slate-900">$799</span>
                          <span className="text-xs text-slate-400 font-sans">/ month</span>
                        </div>
                        <ul className="space-y-2 text-[11px] text-slate-500 leading-normal pt-2 border-t border-slate-100">
                          <li>• Custom encryption parameters</li>
                          <li>• Pre-negotiated provider discounts</li>
                          <li>• Automated biosecurity filters</li>
                        </ul>
                      </div>
                      <button 
                        onClick={() => handleStripeSubscribe('BUSINESS')}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentTier === 'BUSINESS' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {currentTier === 'BUSINESS' ? 'Active Tier' : 'Checkout Plan'}
                      </button>
                    </div>

                    <div className={`p-6 bg-white rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                      currentTier === 'ENTERPRISE' ? 'ring-2 ring-blue-600 border-transparent shadow-lg shadow-blue-500/5' : 'border-slate-200 shadow-xs'
                    }`}>
                      <div className="space-y-2">
                        <span className="text-[10px] bg-slate-900 text-blue-400 border border-slate-800 font-mono px-2 py-0.5 rounded font-bold">CUSTOM</span>
                        <h4 className="font-sans font-bold text-base text-slate-800">Gov-Consortium</h4>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-3xl font-sans font-extrabold text-slate-900">$2499</span>
                          <span className="text-xs text-slate-400 font-sans">/ month</span>
                        </div>
                        <ul className="space-y-2 text-[11px] text-slate-500 leading-normal pt-2 border-t border-slate-100">
                          <li>• Bespoke encoding algorithms</li>
                          <li>• Dedicated biosecurity screen</li>
                          <li>• Direct B2B settlement ledger</li>
                        </ul>
                      </div>
                      <button 
                        onClick={() => handleStripeSubscribe('ENTERPRISE')}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentTier === 'ENTERPRISE' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {currentTier === 'ENTERPRISE' ? 'Active Tier' : 'Checkout Plan'}
                      </button>
                    </div>

                  </div>

                  {/* DOWNLOAD INVOICES LIST (7 COLS VALUE PROPOSITION CARD) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div className="lg:col-span-8 p-6 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                      <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                        <h3 className="font-sans font-bold text-slate-850 text-sm tracking-tight">Stripe Itemized Invoices</h3>
                        <span className="text-xs text-slate-400 font-mono font-bold">{invoices.length} invoices paid</span>
                      </div>

                      <div className="space-y-3">
                        {invoices.map(inv => (
                          <div key={inv.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 text-xs font-mono">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-slate-400" />
                                <strong className="text-slate-700">{inv.invoiceNumber}</strong>
                                <span className="bg-blue-50 text-blue-700 border border-blue-200/50 text-[10px] px-1.5 py-0.2 rounded font-bold">PAID</span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-none">Date: {new Date(inv.date).toLocaleDateString()} • email: {inv.userEmail}</p>
                            </div>

                            <div className="flex items-center space-x-4 md:shrink-0 font-sans">
                              <span className="font-mono text-slate-800 font-bold">${inv.total.toFixed(2)}</span>
                              <button 
                                onClick={() => {
                                  alert(`Successfully requested itemized invoice download for: ${inv.invoiceNumber}. PDF stored standard.`);
                                }}
                                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs transition-colors flex items-center shadow-xs cursor-pointer"
                              >
                                <Download className="h-3.5 w-3.5 mr-1" />
                                <span>PDF Invoice</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DYNAMIC STRIPE REVENUE MODEL BOXES */}
                    <div className="lg:col-span-4 p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-xs text-slate-100 space-y-4">
                      <h4 className="font-sans font-bold text-sm text-white">Stripe Settlement Ledger</h4>
                      <p className="text-xs text-slate-350 leading-relaxed text-pretty">
                        HelixVault wraps standard Stripe Billing API callbacks. Accounts are automatically reconciled on-chain during every sequence conversion or parity verification decay execution. No physical synthesis order requires storage capital.
                      </p>

                      <div className="space-y-1 pt-2 font-mono text-[10px]">
                        <div className="flex justify-between">
                          <span>Stripe Status:</span>
                          <strong className="text-blue-400">OPERATIONAL</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Gateway Webhooks:</span>
                          <strong className="text-slate-300">ACTIVE (v2026)</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>PCI-Compliance:</span>
                          <strong className="text-blue-400">LEVEL 1 SECURE</strong>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 7: TECH SPECIFICATIONS & DATABASE ERD BOARD */}
              {activeTab === 'specs' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="font-sans font-bold text-xl text-slate-900 tracking-tight">Technical specifications & Database Schema (ERD)</h2>
                    <p className="text-xs text-slate-500 mt-1">Review the fully specified folder model architecture, relational databases, and compliance standards ledger representing our Venture-Ready platform.</p>
                  </div>

                  {/* ACTIVE DIRECTORY & ARCHITECTURE */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* FOLDER STRUCTURE GRAPH (5 COLS) */}
                    <div className="lg:col-span-5 p-6 bg-slate-950 rounded-xl border border-slate-850 text-slate-200 font-mono text-xs shadow-md">
                      <div className="border-b border-slate-800 pb-3 mb-4 flex items-center space-x-2">
                        <Terminal className="h-4.5 w-4.5 text-blue-400" />
                        <span className="font-sans font-semibold text-white">Application Files Hierarchy</span>
                      </div>
                      
                      <div className="space-y-2 max-h-[35rem] overflow-y-auto pr-1">
                        <div>
                          <span className="text-blue-400">/ (workspace root)</span>
                          <div className="pl-4 space-y-2.5 mt-2 border-l border-slate-800/80">
                            {DIRECTORY_STRUCTURE.children.map(ch => (
                              <div key={ch.name}>
                                {ch.type === 'directory' ? (
                                  <div className="space-y-1.5">
                                    <span className="text-amber-300">📂 {ch.name}/</span>
                                    <div className="pl-4 space-y-1.5 border-l border-slate-850 mt-1">
                                      {ch.children?.map(sub => (
                                        <div key={sub.name} className="group">
                                          <span className="text-slate-100">📄 {sub.name}</span>
                                          <p className="text-[10px] text-slate-500 italic mt-0.5 leading-normal">{sub.desc}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-slate-100">📄 {ch.name}</span>
                                    <p className="text-[10px] text-slate-500 italic mt-0.5 leading-normal">{ch.desc}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* COMPLIANCE AUDIT COLS */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* RELATIONAL DATABASE ERD SCHEMAS */}
                      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
                        <div className="border-b border-slate-100 pb-3">
                          <h3 className="font-sans font-bold text-slate-800 text-sm tracking-tight">Relational Database Entity Relationship Schema (PostgreSQL)</h3>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">Physical tables declared in Helix Database</p>
                        </div>

                        <div className="space-y-6 max-h-96 overflow-y-auto pr-1">
                          {DATABASE_ERD_SPEC.map(table => (
                            <div key={table.name} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 font-mono text-xs">
                              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                <strong className="text-slate-800 text-sm">Table: {table.name}</strong>
                                <span className="text-[10px] text-slate-400 font-normal">Relation Table</span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-normal">{table.description}</p>
                              
                              <div className="space-y-2 pt-2">
                                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Columns:</span>
                                <div className="space-y-1.5">
                                  {table.columns.map(col => (
                                    <div key={col.name} className="flex flex-col md:flex-row md:items-start md:justify-between text-[11px] bg-white border border-slate-150 p-2 rounded-lg">
                                      <div className="space-y-0.5">
                                        <span className="font-bold text-slate-700">{col.name}</span>
                                        <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded font-semibold ml-2 inline-block">{col.type}</span>
                                        {col.constraints && (
                                          <span className="text-[9px] bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.2 rounded font-bold ml-2 inline-block">{col.constraints}</span>
                                        )}
                                      </div>
                                      <span className="text-slate-400 mt-1 md:mt-0 leading-normal text-right max-w-xs">{col.description}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* COMPLIANCE RIGOR DISPLAY */}
                      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
                        <div className="border-b border-slate-100 pb-3 mb-4">
                          <h3 className="font-sans font-bold text-slate-800 text-sm tracking-tight">Compliance Ledgers & Accreditations Registry</h3>
                        </div>

                        <div className="space-y-3 font-mono text-[11px]">
                          {COMPLIANCE_LISTING.map(c => (
                            <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between space-x-3">
                              <div className="space-y-1 select-text">
                                <strong className="font-sans text-slate-800 block text-xs">{c.name}</strong>
                                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{c.description}</p>
                                <span className="text-[9px] text-blue-750 bg-blue-50 border border-blue-200/40 px-2 py-0.5 rounded leading-none font-bold block mt-1.5 inline-block">{c.evidenceLink}</span>
                              </div>
                              <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold font-sans text-[9px] rounded-full shrink-0">
                                {c.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

            </>
          )}

        </div>

      </main>

    </div>
  );
}
