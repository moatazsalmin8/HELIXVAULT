import { describe, it, expect } from 'vitest';
import { BiosecurityScreening, DNACodecEngine } from './dnaEngine';

describe('DNACodecEngine', () => {
  it('round-trips text through binary compression', () => {
    const text = 'HelixVault DNA storage test payload.';
    const binary = DNACodecEngine.compressTextToBinary(text);
    expect(DNACodecEngine.decompressBinaryToText(binary)).toBe(text);
  });

  it('round-trips binary through nucleotide encoding', () => {
    const binary = '001100110010';
    const nucleotides = DNACodecEngine.binaryToNucleotides(binary);
    expect(DNACodecEngine.nucleotidesToBinary(nucleotides)).toBe(binary);
  });

  it('creates oligos with headers and parity', () => {
    const sequence = 'ACGT'.repeat(10);
    const oligos = DNACodecEngine.createOligos(sequence, 8);
    expect(oligos.length).toBeGreaterThan(0);
    expect(oligos[0].header).toHaveLength(4);
    expect(oligos[0].parity).toMatch(/^[ACGT]$/);
  });

  it('analyzes sequence integrity metrics', () => {
    const sequence = 'ACGTACGTACGTACGT';
    const oligos = DNACodecEngine.createOligos(sequence);
    const report = DNACodecEngine.analyzeSequence('test-seq', 64, sequence, oligos, 12);
    expect(report.integrityScore).toBeGreaterThan(0);
    expect(report.nucleotideCount).toBe(sequence.length);
  });

  it('restores original text when sourceBinary is provided', () => {
    const text = 'Archive retrieval simulation payload.';
    const binary = DNACodecEngine.compressTextToBinary(text);
    const nucleotides = DNACodecEngine.binaryToNucleotides(binary);
    const oligos = DNACodecEngine.createOligos(nucleotides);
    const { decayedSequence } = DNACodecEngine.simulateChemicalDecay(nucleotides, 10);

    const result = DNACodecEngine.reconstructAndRestore(decayedSequence, oligos, binary);
    expect(result.success).toBe(true);
    expect(result.restoredData).toBe(text);
  });
});

describe('BiosecurityScreening', () => {
  it('blocks known dangerous marker sequences', () => {
    const result = BiosecurityScreening.screenSequence('AAAAAGGGGGTTTTTCCCCC');
    expect(result.passes).toBe(false);
    expect(result.matchedThreat).toBeTruthy();
  });

  it('allows safe sequences', () => {
    const result = BiosecurityScreening.screenSequence('ACGTACGTACGT');
    expect(result.passes).toBe(true);
  });
});
