/**
 * Self-generation operation: Kernels generate offspring through recursive composition
 */

import type { OntogeneticKernel, BSeriesCoefficients, RootedTree } from '../types';
import { generateKernelId, getRootedTreeCount } from '../utils';
import { initializeOntogeneticKernel, recordDevelopmentEvent } from './initialization';

/**
 * Generate offspring from a parent kernel using chain rule
 * Applies: (f∘f)' = f'(f(x)) · f'(x)
 */
export function selfGenerate(parent: OntogeneticKernel): OntogeneticKernel {
  // Apply chain rule to generate new coefficients
  const newCoefficients = applyChainRule(parent.coefficients);

  // Create offspring kernel
  const offspring: OntogeneticKernel = {
    id: generateKernelId(),
    domain: parent.domain,
    order: parent.order,
    coefficients: newCoefficients,
    grip: {
      ...parent.grip,
      overall: parent.grip.overall * 0.95, // Slight degradation initially
    },
    genome: {
      ...parent.genome,
      id: `${parent.genome.id}-offspring`,
      generation: parent.genome.generation + 1,
      lineage: [parent.genome.id],
      genes: parent.genome.genes.map((gene) => ({
        ...gene,
        // Apply slight variation to mutable genes
        value: gene.mutable ? gene.value * (0.95 + Math.random() * 0.1) : gene.value,
      })),
      fitness: parent.grip.overall * 0.95,
      age: 0,
    },
    ontogeneticState: {
      stage: 'embryonic',
      maturity: 0.0,
      developmentHistory: [
        {
          generation: parent.genome.generation + 1,
          event: 'self_generation',
          timestamp: Date.now(),
          details: {
            parentId: parent.genome.id,
            method: 'chain_rule',
          },
        },
      ],
    },
  };

  recordDevelopmentEvent(parent, 'generated_offspring', {
    offspringId: offspring.genome.id,
  });

  return offspring;
}

/**
 * Apply chain rule to B-series coefficients
 * (f∘f)' = f'(f(x)) · f'(x)
 */
function applyChainRule(coeffs: BSeriesCoefficients): BSeriesCoefficients {
  const order = coeffs.order;
  const newCoefficients: number[] = [];
  const newTrees: RootedTree[] = [];

  // For each tree in the original series
  coeffs.trees.forEach((tree, i) => {
    const coeff = coeffs.coefficients[i];

    // Chain rule: multiply by derivative
    // This is a simplified version - proper implementation would
    // compose the tree structures
    const chainedCoeff = coeff * coeff; // f'(f) * f'

    newCoefficients.push(chainedCoeff);
    newTrees.push({
      ...tree,
      id: `${tree.id}-chained`,
      order: Math.min(tree.order + 1, order),
    });
  });

  // Normalize coefficients
  const sum = newCoefficients.reduce((acc, c) => acc + Math.abs(c), 0);
  const normalized = sum > 0 ? newCoefficients.map((c) => c / sum) : newCoefficients;

  return {
    order,
    coefficients: normalized,
    trees: newTrees,
  };
}

/**
 * Apply product rule to combine two kernels
 * (f·g)' = f'·g + f·g'
 */
export function applyProductRule(
  kernel1: OntogeneticKernel,
  kernel2: OntogeneticKernel
): OntogeneticKernel {
  const newCoefficients: number[] = [];
  const maxLength = Math.max(
    kernel1.coefficients.coefficients.length,
    kernel2.coefficients.coefficients.length
  );

  // Product rule: f'·g + f·g'
  for (let i = 0; i < maxLength; i++) {
    const c1 = kernel1.coefficients.coefficients[i] || 0;
    const c2 = kernel2.coefficients.coefficients[i] || 0;

    // Simplified: (c1 * c2) + (c1 * c2) = 2 * c1 * c2
    newCoefficients.push(2 * c1 * c2);
  }

  // Combine trees
  const newTrees: RootedTree[] = [
    ...kernel1.coefficients.trees,
    ...kernel2.coefficients.trees,
  ];

  return initializeOntogeneticKernel(
    {
      id: generateKernelId(),
      domain: `${kernel1.domain}-${kernel2.domain}`,
      order: Math.max(kernel1.order, kernel2.order),
      coefficients: {
        order: Math.max(kernel1.order, kernel2.order),
        coefficients: newCoefficients,
        trees: newTrees,
      },
      grip: {
        contact: (kernel1.grip.contact + kernel2.grip.contact) / 2,
        coverage: (kernel1.grip.coverage + kernel2.grip.coverage) / 2,
        efficiency: (kernel1.grip.efficiency + kernel2.grip.efficiency) / 2,
        stability: (kernel1.grip.stability + kernel2.grip.stability) / 2,
        overall: (kernel1.grip.overall + kernel2.grip.overall) / 2,
      },
    },
    [kernel1.genome.id, kernel2.genome.id]
  );
}
