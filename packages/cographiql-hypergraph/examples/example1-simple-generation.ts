/**
 * Example 1: Simple Self-Generation
 * 
 * Demonstrates basic kernel generation and self-generation
 */

import {
  UniversalKernelGenerator,
  initializeOntogeneticKernel,
  selfGenerate,
} from '../src';

export function example1SimpleGeneration() {
  console.log('=== Example 1: Simple Self-Generation ===\n');

  // Create parent kernel
  const parent = UniversalKernelGenerator.generateConsciousnessKernel(4);
  const ontoParent = initializeOntogeneticKernel(parent);

  console.log('Parent Kernel:');
  console.log(`  ID: ${ontoParent.genome.id}`);
  console.log(`  Domain: ${ontoParent.domain}`);
  console.log(`  Order: ${ontoParent.order}`);
  console.log(`  Fitness: ${ontoParent.genome.fitness.toFixed(4)}`);
  console.log(`  Stage: ${ontoParent.ontogeneticState.stage}`);

  // Generate offspring
  const offspring = selfGenerate(ontoParent);

  console.log('\nOffspring Kernel:');
  console.log(`  ID: ${offspring.genome.id}`);
  console.log(`  Generation: ${offspring.genome.generation}`);
  console.log(`  Fitness: ${offspring.genome.fitness.toFixed(4)}`);
  console.log(`  Stage: ${offspring.ontogeneticState.stage}`);
  console.log(`  Parent: ${offspring.genome.lineage[0]}`);

  return { parent: ontoParent, offspring };
}

// Run if executed directly
if (require.main === module) {
  example1SimpleGeneration();
}
