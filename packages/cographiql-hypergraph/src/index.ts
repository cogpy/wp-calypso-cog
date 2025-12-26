/**
 * cographiql-hypergraph: Self-generating, evolving kernels
 * 
 * Main entry point for the Ontogenesis system
 */

// Type exports
export type {
  DevelopmentStage,
  GeneType,
  ReproductionMethod,
  KernelGene,
  KernelGenome,
  OntogeneticState,
  DevelopmentEvent,
  BSeriesCoefficients,
  RootedTree,
  GripMetrics,
  GeneratedKernel,
  OntogeneticKernel,
  DevelopmentSchedule,
  EvolutionConfig,
  OntogenesisConfig,
  ReproductionResult,
  GenerationStats,
  DifferentialOperator,
  DifferentialOperation,
} from './types';

// Initialization exports
export {
  initializeOntogeneticKernel,
  recordDevelopmentEvent,
  updateDevelopmentStage,
} from './operations/initialization';

// Generation exports
export { selfGenerate, applyProductRule } from './operations/generation';

// Optimization exports
export { selfOptimize, optimizePopulation } from './operations/optimization';

// Reproduction exports
export { selfReproduce, mutate, crossover } from './operations/reproduction';

// Evolution exports
export { runOntogenesis } from './evolution/ontogenesis';

// Generator exports
export { UniversalKernelGenerator } from './generators/UniversalKernelGenerator';

// Utility exports
export {
  generateKernelId,
  generateGenomeId,
  getRootedTreeCount,
  calculateGeneticDistance,
  calculateNovelty,
  A000081_SEQUENCE,
} from './utils';
