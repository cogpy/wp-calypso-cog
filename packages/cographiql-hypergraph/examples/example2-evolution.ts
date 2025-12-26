/**
 * Example 2: Multi-Generation Evolution
 * 
 * Demonstrates population-based evolution over multiple generations
 */

import { UniversalKernelGenerator, runOntogenesis } from '../src';

export function example2Evolution() {
  console.log('=== Example 2: Multi-Generation Evolution ===\n');

  const config = {
    evolution: {
      populationSize: 20,
      mutationRate: 0.15,
      crossoverRate: 0.8,
      elitismRate: 0.1,
      maxGenerations: 50,
      fitnessThreshold: 0.9,
      diversityPressure: 0.2,
    },
    seedKernels: [
      UniversalKernelGenerator.generateConsciousnessKernel(4),
      UniversalKernelGenerator.generatePhysicsKernel(4),
    ],
  };

  console.log('Configuration:');
  console.log(`  Population Size: ${config.evolution.populationSize}`);
  console.log(`  Mutation Rate: ${config.evolution.mutationRate}`);
  console.log(`  Crossover Rate: ${config.evolution.crossoverRate}`);
  console.log(`  Max Generations: ${config.evolution.maxGenerations}`);
  console.log(`  Seed Kernels: ${config.seedKernels.length}`);

  console.log('\nRunning evolution...\n');

  const generations = runOntogenesis(config);

  // Display results
  console.log('Evolution Results:');
  console.log('─'.repeat(60));

  generations.forEach((gen, index) => {
    if (index % 10 === 0 || index === generations.length - 1) {
      console.log(`Generation ${gen.generation}:`);
      console.log(`  Best Fitness: ${gen.bestFitness.toFixed(4)}`);
      console.log(`  Avg Fitness:  ${gen.averageFitness.toFixed(4)}`);
      console.log(`  Diversity:    ${gen.diversity.toFixed(4)}`);
      console.log(`  Best Domain:  ${gen.bestKernel.domain}`);
      console.log(`  Best Stage:   ${gen.bestKernel.ontogeneticState.stage}`);
      console.log('');
    }
  });

  const finalGen = generations[generations.length - 1];
  console.log('Final Statistics:');
  console.log(`  Total Generations: ${generations.length}`);
  console.log(`  Final Best Fitness: ${finalGen.bestFitness.toFixed(4)}`);
  console.log(`  Final Avg Fitness: ${finalGen.averageFitness.toFixed(4)}`);
  console.log(`  Final Diversity: ${finalGen.diversity.toFixed(4)}`);

  return generations;
}

// Run if executed directly
if (require.main === module) {
  example2Evolution();
}
