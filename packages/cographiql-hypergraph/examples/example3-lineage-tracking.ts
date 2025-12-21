/**
 * Example 3: Lineage Tracking
 * 
 * Demonstrates tracking kernel lineage across multiple generations
 */

import {
  UniversalKernelGenerator,
  initializeOntogeneticKernel,
  selfGenerate,
} from '../src';

export function example3LineageTracking() {
  console.log('=== Example 3: Lineage Tracking ===\n');

  // Create ancestor
  const ancestor = UniversalKernelGenerator.generateConsciousnessKernel(4);
  let current = initializeOntogeneticKernel(ancestor);
  const lineage = [current];

  console.log('Generating 10 generations...\n');

  // Generate 10 generations
  for (let i = 0; i < 10; i++) {
    current = selfGenerate(current);
    lineage.push(current);
  }

  // Trace lineage
  console.log('Lineage Trace:');
  console.log('─'.repeat(60));

  lineage.forEach((kernel, gen) => {
    console.log(`Generation ${gen}:`);
    console.log(`  ID: ${kernel.genome.id.substring(0, 20)}...`);
    console.log(`  Fitness: ${kernel.genome.fitness.toFixed(4)}`);
    console.log(`  Stage: ${kernel.ontogeneticState.stage}`);
    console.log(`  Maturity: ${kernel.ontogeneticState.maturity.toFixed(2)}`);
    console.log(`  Age: ${kernel.genome.age}`);
    console.log(`  Events: ${kernel.ontogeneticState.developmentHistory.length}`);

    if (kernel.genome.lineage.length > 0) {
      console.log(`  Parent: ${kernel.genome.lineage[0].substring(0, 20)}...`);
    }

    console.log('');
  });

  // Analyze fitness progression
  const fitnessProgression = lineage.map((k) => k.genome.fitness);
  const initialFitness = fitnessProgression[0];
  const finalFitness = fitnessProgression[fitnessProgression.length - 1];
  const maxFitness = Math.max(...fitnessProgression);
  const minFitness = Math.min(...fitnessProgression);

  console.log('Fitness Analysis:');
  console.log(`  Initial: ${initialFitness.toFixed(4)}`);
  console.log(`  Final: ${finalFitness.toFixed(4)}`);
  console.log(`  Max: ${maxFitness.toFixed(4)}`);
  console.log(`  Min: ${minFitness.toFixed(4)}`);
  console.log(`  Change: ${((finalFitness - initialFitness) * 100).toFixed(2)}%`);

  return lineage;
}

// Run if executed directly
if (require.main === module) {
  example3LineageTracking();
}
