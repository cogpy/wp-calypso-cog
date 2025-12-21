/**
 * Self-optimization operation: Kernels optimize their own grip
 */

import type { OntogeneticKernel } from '../types';
import { clamp } from '../utils';
import { recordDevelopmentEvent, updateDevelopmentStage } from './initialization';

/**
 * Optimize a kernel through iterative grip improvement
 */
export function selfOptimize(
  kernel: OntogeneticKernel,
  iterations: number = 10
): OntogeneticKernel {
  const optimized = { ...kernel };

  for (let i = 0; i < iterations; i++) {
    // Optimize grip coefficients
    optimizeGripCoefficients(optimized);

    // Increase maturity
    optimized.ontogeneticState.maturity = clamp(
      optimized.ontogeneticState.maturity + 1.0 / iterations,
      0,
      1
    );

    // Update development stage
    updateDevelopmentStage(optimized);

    // Record progress
    if (i === 0 || i === iterations - 1) {
      recordDevelopmentEvent(optimized, 'optimization_step', {
        iteration: i,
        fitness: optimized.genome.fitness,
        maturity: optimized.ontogeneticState.maturity,
      });
    }
  }

  return optimized;
}

/**
 * Optimize grip coefficients using gradient ascent
 */
function optimizeGripCoefficients(kernel: OntogeneticKernel): void {
  const learningRate = 0.01;

  // Update each mutable coefficient gene
  kernel.genome.genes.forEach((gene) => {
    if (gene.mutable && gene.type === 'coefficient') {
      // Calculate gradient (simplified - proper implementation would
      // compute actual gradient of grip function)
      const gradient = estimateGradient(kernel, gene.locus);

      // Gradient ascent step
      gene.value += learningRate * gradient;

      // Clamp to reasonable range
      gene.value = clamp(gene.value, -10, 10);
    }
  });

  // Update B-series coefficients from genes
  updateCoefficientsFromGenes(kernel);

  // Recalculate fitness and grip
  recalculateFitness(kernel);
}

/**
 * Estimate gradient of grip function with respect to coefficient
 */
function estimateGradient(kernel: OntogeneticKernel, locus: number): number {
  const epsilon = 0.001;
  const originalValue = kernel.genome.genes[locus].value;

  // Calculate grip at current value
  const currentGrip = kernel.grip.overall;

  // Calculate grip at value + epsilon
  kernel.genome.genes[locus].value = originalValue + epsilon;
  const perturbedGrip = evaluateGrip(kernel);

  // Restore original value
  kernel.genome.genes[locus].value = originalValue;

  // Numerical gradient
  return (perturbedGrip - currentGrip) / epsilon;
}

/**
 * Evaluate grip for current coefficients
 */
function evaluateGrip(kernel: OntogeneticKernel): number {
  // Simplified grip evaluation
  // Proper implementation would analyze domain topology

  const coeffs = kernel.coefficients.coefficients;

  // Contact: magnitude of coefficients
  const contact = coeffs.reduce((sum, c) => sum + Math.abs(c), 0) / coeffs.length;

  // Coverage: distribution across coefficients
  const mean = coeffs.reduce((sum, c) => sum + c, 0) / coeffs.length;
  const variance =
    coeffs.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / coeffs.length;
  const coverage = 1.0 / (1.0 + variance);

  // Efficiency: inverse of complexity
  const efficiency = 1.0 / (1.0 + coeffs.length);

  // Stability: smoothness of coefficients
  let smoothness = 0;
  for (let i = 1; i < coeffs.length; i++) {
    smoothness += Math.abs(coeffs[i] - coeffs[i - 1]);
  }
  const stability = 1.0 / (1.0 + smoothness);

  // Combined grip
  return contact * 0.4 + coverage * 0.2 + efficiency * 0.2 + stability * 0.2;
}

/**
 * Update B-series coefficients from genes
 */
function updateCoefficientsFromGenes(kernel: OntogeneticKernel): void {
  const coeffGenes = kernel.genome.genes.filter((g) => g.type === 'coefficient');

  kernel.coefficients.coefficients = coeffGenes.map((gene) => gene.value);
}

/**
 * Recalculate fitness based on current grip
 */
function recalculateFitness(kernel: OntogeneticKernel): void {
  const grip = evaluateGrip(kernel);

  // Update grip metrics
  kernel.grip.overall = grip;
  kernel.grip.contact = grip * 0.4;
  kernel.grip.coverage = grip * 0.2;
  kernel.grip.efficiency = grip * 0.2;
  kernel.grip.stability = grip * 0.2;

  // Update fitness in genome
  kernel.genome.fitness = grip;
}

/**
 * Batch optimize a population of kernels
 */
export function optimizePopulation(
  population: OntogeneticKernel[],
  iterations: number = 5
): OntogeneticKernel[] {
  return population.map((kernel) => selfOptimize(kernel, iterations));
}
