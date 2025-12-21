/**
 * Utility functions for the Ontogenesis system
 */

/**
 * Generate a unique ID for a kernel
 */
export function generateKernelId(): string {
  return `kernel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique ID for a genome
 */
export function generateGenomeId(): string {
  return `genome-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * A000081 sequence: Number of rooted trees with n nodes
 * Values for n=1 to 10: 1, 1, 2, 4, 9, 20, 48, 115, 286, 719
 */
export const A000081_SEQUENCE: number[] = [
  0, // n=0 (placeholder)
  1, // n=1
  1, // n=2
  2, // n=3
  4, // n=4
  9, // n=5
  20, // n=6
  48, // n=7
  115, // n=8
  286, // n=9
  719, // n=10
];

/**
 * Get the number of rooted trees for a given order
 */
export function getRootedTreeCount(order: number): number {
  if (order < 0 || order >= A000081_SEQUENCE.length) {
    throw new Error(`Order ${order} out of range for A000081 sequence`);
  }
  return A000081_SEQUENCE[order];
}

/**
 * Calculate genetic distance between two kernels
 * Based on Hamming distance of coefficient genes
 */
export function calculateGeneticDistance(
  genome1: { genes: Array<{ value: number }> },
  genome2: { genes: Array<{ value: number }> }
): number {
  const len = Math.min(genome1.genes.length, genome2.genes.length);
  let distance = 0;

  for (let i = 0; i < len; i++) {
    distance += Math.abs(genome1.genes[i].value - genome2.genes[i].value);
  }

  // Normalize by length
  return len > 0 ? distance / len : 0;
}

/**
 * Calculate average distance from a kernel to a population
 */
export function calculateNovelty(
  kernel: { genome: { genes: Array<{ value: number }> } },
  population: Array<{ genome: { genes: Array<{ value: number }> } }>
): number {
  if (population.length === 0) return 1.0;

  const distances = population.map((other) =>
    calculateGeneticDistance(kernel.genome, other.genome)
  );

  const sum = distances.reduce((acc, d) => acc + d, 0);
  return sum / distances.length;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Random number between min and max
 */
export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Select a random element from an array
 */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
