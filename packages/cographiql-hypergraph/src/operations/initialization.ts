/**
 * Initialization functions for ontogenetic kernels
 */

import type {
  GeneratedKernel,
  OntogeneticKernel,
  KernelGenome,
  KernelGene,
  OntogeneticState,
} from '../types';
import { generateGenomeId } from '../utils';

/**
 * Initialize an ontogenetic kernel from a generated kernel
 */
export function initializeOntogeneticKernel(
  kernel: GeneratedKernel,
  parentIds: string[] = []
): OntogeneticKernel {
  const genome = createInitialGenome(kernel, parentIds);
  const ontogeneticState = createInitialState();

  return {
    ...kernel,
    genome,
    ontogeneticState,
  };
}

/**
 * Create initial genome from kernel coefficients
 */
function createInitialGenome(
  kernel: GeneratedKernel,
  parentIds: string[]
): KernelGenome {
  const genes: KernelGene[] = [];

  // Create coefficient genes (mutable)
  kernel.coefficients.coefficients.forEach((coeff, index) => {
    genes.push({
      type: 'coefficient',
      value: coeff,
      mutable: true,
      locus: index,
    });
  });

  // Add operator genes (mutable) - one per tree
  kernel.coefficients.trees.forEach((tree, index) => {
    genes.push({
      type: 'operator',
      value: tree.order,
      mutable: true,
      locus: genes.length,
    });
  });

  // Add symmetry genes (immutable) - based on domain
  genes.push({
    type: 'symmetry',
    value: 1.0, // Symmetry preservation factor
    mutable: false,
    locus: genes.length,
  });

  // Add preservation genes (immutable) - conserved quantities
  genes.push({
    type: 'preservation',
    value: 1.0, // Conservation factor
    mutable: false,
    locus: genes.length,
  });

  return {
    id: generateGenomeId(),
    generation: parentIds.length > 0 ? 1 : 0,
    lineage: parentIds,
    genes,
    fitness: kernel.grip.overall,
    age: 0,
  };
}

/**
 * Create initial ontogenetic state
 */
function createInitialState(): OntogeneticState {
  return {
    stage: 'embryonic',
    maturity: 0.0,
    developmentHistory: [
      {
        generation: 0,
        event: 'initialization',
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Record a development event
 */
export function recordDevelopmentEvent(
  kernel: OntogeneticKernel,
  event: string,
  details?: Record<string, unknown>
): void {
  kernel.ontogeneticState.developmentHistory.push({
    generation: kernel.genome.generation,
    event,
    timestamp: Date.now(),
    details,
  });
}

/**
 * Update development stage based on age and maturity
 */
export function updateDevelopmentStage(
  kernel: OntogeneticKernel,
  schedule?: {
    embryonicDuration: number;
    juvenileDuration: number;
    matureDuration: number;
    maturityThreshold: number;
  }
): void {
  const defaultSchedule = {
    embryonicDuration: 2,
    juvenileDuration: 5,
    matureDuration: 10,
    maturityThreshold: 0.8,
  };

  const sched = schedule || defaultSchedule;
  const age = kernel.genome.age;
  const maturity = kernel.ontogeneticState.maturity;

  let newStage = kernel.ontogeneticState.stage;

  if (age >= sched.embryonicDuration + sched.juvenileDuration + sched.matureDuration) {
    newStage = 'senescent';
  } else if (
    age >= sched.embryonicDuration + sched.juvenileDuration ||
    maturity >= sched.maturityThreshold
  ) {
    newStage = 'mature';
  } else if (age >= sched.embryonicDuration) {
    newStage = 'juvenile';
  }

  if (newStage !== kernel.ontogeneticState.stage) {
    kernel.ontogeneticState.stage = newStage;
    recordDevelopmentEvent(kernel, `stage_transition_to_${newStage}`);
  }
}
