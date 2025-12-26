/**
 * Self-reproduction operations: Genetic crossover, mutation, and cloning
 */

import type {
  OntogeneticKernel,
  ReproductionMethod,
  ReproductionResult,
  KernelGene,
} from '../types';
import { generateKernelId, clamp } from '../utils';
import { initializeOntogeneticKernel } from './initialization';

/**
 * Two kernels combine to create offspring
 */
export function selfReproduce(
  parent1: OntogeneticKernel,
  parent2: OntogeneticKernel,
  method: ReproductionMethod = 'crossover'
): ReproductionResult {
  let offspring: OntogeneticKernel[];

  switch (method) {
    case 'crossover':
      offspring = performCrossover(parent1, parent2);
      break;
    case 'mutation':
      offspring = [performMutation(parent1)];
      break;
    case 'cloning':
      offspring = [performCloning(parent1)];
      break;
    default:
      throw new Error(`Unknown reproduction method: ${method}`);
  }

  return {
    offspring,
    method,
    parents: [parent1.genome.id, parent2.genome.id],
  };
}

/**
 * Single-point crossover on coefficient arrays
 */
function performCrossover(
  parent1: OntogeneticKernel,
  parent2: OntogeneticKernel
): OntogeneticKernel[] {
  const genes1 = parent1.genome.genes.filter((g) => g.mutable);
  const genes2 = parent2.genome.genes.filter((g) => g.mutable);

  const minLength = Math.min(genes1.length, genes2.length);
  if (minLength === 0) {
    // Can't crossover, just clone
    return [performCloning(parent1), performCloning(parent2)];
  }

  // Random crossover point
  const crossoverPoint = Math.floor(Math.random() * minLength);

  // Create offspring genes
  const offspring1Genes = createOffspringGenes(genes1, genes2, crossoverPoint, parent1);
  const offspring2Genes = createOffspringGenes(genes2, genes1, crossoverPoint, parent2);

  // Create offspring kernels
  const offspring1 = createOffspringKernel(parent1, parent2, offspring1Genes);
  const offspring2 = createOffspringKernel(parent2, parent1, offspring2Genes);

  return [offspring1, offspring2];
}

/**
 * Create offspring genes from parents with crossover point
 */
function createOffspringGenes(
  genes1: KernelGene[],
  genes2: KernelGene[],
  crossoverPoint: number,
  template: OntogeneticKernel
): KernelGene[] {
  const allGenes = template.genome.genes.map((gene, index) => {
    if (!gene.mutable) {
      // Immutable genes pass unchanged
      return { ...gene };
    }

    // Find corresponding mutable gene
    const mutableIndex = template.genome.genes
      .slice(0, index)
      .filter((g) => g.mutable).length;

    if (mutableIndex < crossoverPoint) {
      return { ...genes1[mutableIndex] };
    } else if (mutableIndex < genes2.length) {
      return { ...genes2[mutableIndex] };
    } else {
      return { ...genes1[mutableIndex] || gene };
    }
  });

  return allGenes;
}

/**
 * Random mutation of coefficients
 */
function performMutation(parent: OntogeneticKernel): OntogeneticKernel {
  const mutatedGenes = parent.genome.genes.map((gene) => {
    if (!gene.mutable) {
      return { ...gene };
    }

    // ±10% mutation
    const mutation = (Math.random() - 0.5) * 0.2;
    return {
      ...gene,
      value: gene.value * (1 + mutation),
    };
  });

  return createOffspringKernel(parent, parent, mutatedGenes);
}

/**
 * Direct copy (cloning)
 */
function performCloning(parent: OntogeneticKernel): OntogeneticKernel {
  const clonedGenes = parent.genome.genes.map((gene) => ({ ...gene }));
  return createOffspringKernel(parent, parent, clonedGenes);
}

/**
 * Create offspring kernel from parent templates and genes
 */
function createOffspringKernel(
  parent1: OntogeneticKernel,
  parent2: OntogeneticKernel,
  genes: KernelGene[]
): OntogeneticKernel {
  // Extract coefficient values from genes
  const coeffGenes = genes.filter((g) => g.type === 'coefficient');
  const newCoefficients = coeffGenes.map((g) => g.value);

  // Calculate average grip from parents
  const avgGrip = {
    contact: (parent1.grip.contact + parent2.grip.contact) / 2,
    coverage: (parent1.grip.coverage + parent2.grip.coverage) / 2,
    efficiency: (parent1.grip.efficiency + parent2.grip.efficiency) / 2,
    stability: (parent1.grip.stability + parent2.grip.stability) / 2,
    overall: (parent1.grip.overall + parent2.grip.overall) / 2,
  };

  // Create offspring
  const offspring = initializeOntogeneticKernel(
    {
      id: generateKernelId(),
      domain: parent1.domain,
      order: parent1.order,
      coefficients: {
        order: parent1.coefficients.order,
        coefficients: newCoefficients,
        trees: parent1.coefficients.trees.map((t) => ({ ...t })),
      },
      grip: avgGrip,
    },
    [parent1.genome.id, parent2.genome.id]
  );

  // Copy genes
  offspring.genome.genes = genes;

  return offspring;
}

/**
 * Apply mutation to a single kernel
 */
export function mutate(
  kernel: OntogeneticKernel,
  mutationRate: number = 0.1
): OntogeneticKernel {
  if (Math.random() > mutationRate) {
    return kernel; // No mutation
  }

  return performMutation(kernel);
}

/**
 * Crossover two kernels
 */
export function crossover(
  parent1: OntogeneticKernel,
  parent2: OntogeneticKernel
): OntogeneticKernel[] {
  return performCrossover(parent1, parent2);
}
