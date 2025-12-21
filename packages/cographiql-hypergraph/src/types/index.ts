/**
 * Core type definitions for the Ontogenesis system
 */

/**
 * Development stages a kernel progresses through
 */
export type DevelopmentStage = 'embryonic' | 'juvenile' | 'mature' | 'senescent';

/**
 * Types of genes in a kernel
 */
export type GeneType = 'coefficient' | 'operator' | 'symmetry' | 'preservation';

/**
 * Reproduction methods
 */
export type ReproductionMethod = 'crossover' | 'mutation' | 'cloning';

/**
 * A single gene in the kernel's genome
 */
export interface KernelGene {
  type: GeneType;
  value: number;
  mutable: boolean;
  locus: number; // Position in the genome
}

/**
 * The genetic information of a kernel
 */
export interface KernelGenome {
  id: string;
  generation: number;
  lineage: string[]; // Parent IDs
  genes: KernelGene[];
  fitness: number;
  age: number;
}

/**
 * The ontogenetic state tracking development
 */
export interface OntogeneticState {
  stage: DevelopmentStage;
  maturity: number; // 0-1
  developmentHistory: DevelopmentEvent[];
}

/**
 * Events during kernel development
 */
export interface DevelopmentEvent {
  generation: number;
  event: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

/**
 * B-series coefficients for the kernel
 */
export interface BSeriesCoefficients {
  order: number;
  coefficients: number[];
  trees: RootedTree[];
}

/**
 * A rooted tree representing an elementary differential
 */
export interface RootedTree {
  id: string;
  order: number;
  nodes: number;
  structure: string; // Tree structure representation
}

/**
 * Grip metrics measuring kernel-domain fit
 */
export interface GripMetrics {
  contact: number; // How well kernel touches domain
  coverage: number; // Completeness of span
  efficiency: number; // Computational cost
  stability: number; // Numerical properties
  overall: number; // Combined grip score
}

/**
 * A generated kernel with B-series expansion
 */
export interface GeneratedKernel {
  id: string;
  domain: string;
  order: number;
  coefficients: BSeriesCoefficients;
  grip: GripMetrics;
  metadata?: Record<string, unknown>;
}

/**
 * An ontogenetic kernel with genetic capabilities
 */
export interface OntogeneticKernel extends GeneratedKernel {
  genome: KernelGenome;
  ontogeneticState: OntogeneticState;
}

/**
 * Configuration for the development schedule
 */
export interface DevelopmentSchedule {
  embryonicDuration: number; // Generations
  juvenileDuration: number; // Generations
  matureDuration: number; // Generations
  maturityThreshold: number; // Fitness threshold
}

/**
 * Configuration for evolution parameters
 */
export interface EvolutionConfig {
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  elitismRate: number;
  maxGenerations: number;
  fitnessThreshold: number;
  diversityPressure: number;
}

/**
 * Main configuration for ontogenesis
 */
export interface OntogenesisConfig {
  evolution: EvolutionConfig;
  developmentSchedule?: DevelopmentSchedule;
  seedKernels: GeneratedKernel[];
  fitnessFunction?: (kernel: OntogeneticKernel) => number;
}

/**
 * Result of a reproduction operation
 */
export interface ReproductionResult {
  offspring: OntogeneticKernel[];
  method: ReproductionMethod;
  parents: string[]; // Parent IDs
}

/**
 * Statistics for a generation
 */
export interface GenerationStats {
  generation: number;
  population: OntogeneticKernel[];
  bestFitness: number;
  averageFitness: number;
  diversity: number;
  bestKernel: OntogeneticKernel;
}

/**
 * Differential operator types
 */
export type DifferentialOperator = 'chain' | 'product' | 'quotient';

/**
 * A differential operation descriptor
 */
export interface DifferentialOperation {
  operator: DifferentialOperator;
  operands: string[]; // Kernel IDs
  result?: OntogeneticKernel;
}
