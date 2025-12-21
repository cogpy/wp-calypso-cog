/**
 * Complete Ontogenesis Demo
 * 
 * Demonstrates the full capabilities of the ontogenesis system
 */

const {
  UniversalKernelGenerator,
  initializeOntogeneticKernel,
  selfGenerate,
  selfOptimize,
  runOntogenesis,
} = require('../dist/index.js');

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║         ONTOGENESIS: Self-Generating Kernels             ║');
console.log('║    Living Mathematics Through Differential Calculus      ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// ============================================================
// Part 1: Domain-Specific Kernel Generation
// ============================================================
console.log('━'.repeat(60));
console.log('Part 1: Universal Kernel Generator');
console.log('━'.repeat(60));
console.log('\nGenerating kernels for 5 different domains...\n');

const domains = [
  { name: 'Consciousness', generator: () => UniversalKernelGenerator.generateConsciousnessKernel(4) },
  { name: 'Physics', generator: () => UniversalKernelGenerator.generatePhysicsKernel(4) },
  { name: 'Chemistry', generator: () => UniversalKernelGenerator.generateChemistryKernel(4) },
  { name: 'Biology', generator: () => UniversalKernelGenerator.generateBiologyKernel(4) },
  { name: 'Computing', generator: () => UniversalKernelGenerator.generateComputingKernel(4) },
];

domains.forEach(({ name, generator }) => {
  const kernel = generator();
  console.log(`${name} Kernel:`);
  console.log(`  Order: ${kernel.order}`);
  console.log(`  Trees: ${kernel.coefficients.trees.length}`);
  console.log(`  Grip: ${kernel.grip.overall.toFixed(4)}`);
  console.log(`  Stability: ${kernel.grip.stability.toFixed(4)}`);
  console.log('');
});

// ============================================================
// Part 2: Self-Generation (Lineage)
// ============================================================
console.log('━'.repeat(60));
console.log('Part 2: Self-Generation (Creating Lineage)');
console.log('━'.repeat(60));
console.log('\nGenerating 5 generations through self-composition...\n');

let current = initializeOntogeneticKernel(
  UniversalKernelGenerator.generateConsciousnessKernel(4)
);

console.log('Gen 0 (Ancestor):');
console.log(`  ID: ${current.genome.id.substring(0, 30)}...`);
console.log(`  Fitness: ${current.genome.fitness.toFixed(4)}`);
console.log(`  Stage: ${current.ontogeneticState.stage}`);
console.log('');

for (let i = 1; i <= 5; i++) {
  current = selfGenerate(current);
  console.log(`Gen ${i}:`);
  console.log(`  ID: ${current.genome.id.substring(0, 30)}...`);
  console.log(`  Fitness: ${current.genome.fitness.toFixed(4)}`);
  console.log(`  Stage: ${current.ontogeneticState.stage}`);
  console.log('');
}

// ============================================================
// Part 3: Self-Optimization
// ============================================================
console.log('━'.repeat(60));
console.log('Part 3: Self-Optimization (Grip Improvement)');
console.log('━'.repeat(60));
console.log('\nOptimizing a kernel through 10 iterations...\n');

const toOptimize = initializeOntogeneticKernel(
  UniversalKernelGenerator.generatePhysicsKernel(4)
);

console.log('Before Optimization:');
console.log(`  Fitness: ${toOptimize.genome.fitness.toFixed(4)}`);
console.log(`  Maturity: ${toOptimize.ontogeneticState.maturity.toFixed(2)}`);
console.log(`  Stage: ${toOptimize.ontogeneticState.stage}`);

const optimized = selfOptimize(toOptimize, 10);

console.log('\nAfter Optimization (10 iterations):');
console.log(`  Fitness: ${optimized.genome.fitness.toFixed(4)}`);
console.log(`  Maturity: ${optimized.ontogeneticState.maturity.toFixed(2)}`);
console.log(`  Stage: ${optimized.ontogeneticState.stage}`);
console.log(`  Change: ${((optimized.genome.fitness - toOptimize.genome.fitness) * 100).toFixed(2)}%`);
console.log('');

// ============================================================
// Part 4: Population Evolution
// ============================================================
console.log('━'.repeat(60));
console.log('Part 4: Population Evolution');
console.log('━'.repeat(60));
console.log('\nEvolving a population of 20 kernels over 30 generations...\n');

const evolutionConfig = {
  evolution: {
    populationSize: 20,
    mutationRate: 0.15,
    crossoverRate: 0.8,
    elitismRate: 0.2,
    maxGenerations: 30,
    fitnessThreshold: 0.95,
    diversityPressure: 0.15,
  },
  seedKernels: [
    UniversalKernelGenerator.generateConsciousnessKernel(4),
    UniversalKernelGenerator.generatePhysicsKernel(4),
    UniversalKernelGenerator.generateChemistryKernel(4),
  ],
};

console.log('Evolution Configuration:');
console.log(`  Population Size: ${evolutionConfig.evolution.populationSize}`);
console.log(`  Mutation Rate: ${evolutionConfig.evolution.mutationRate}`);
console.log(`  Crossover Rate: ${evolutionConfig.evolution.crossoverRate}`);
console.log(`  Elite Rate: ${evolutionConfig.evolution.elitismRate}`);
console.log(`  Max Generations: ${evolutionConfig.evolution.maxGenerations}`);
console.log(`  Seed Kernels: ${evolutionConfig.seedKernels.length}`);
console.log('');

const generations = runOntogenesis(evolutionConfig);

console.log('Evolution Progress:\n');
console.log('Gen | Best Fit | Avg Fit  | Diversity | Best Domain');
console.log('─'.repeat(60));

generations.forEach((gen, index) => {
  if (index % 5 === 0 || index === generations.length - 1) {
    const genStr = String(gen.generation).padStart(3);
    const bestStr = gen.bestFitness.toFixed(4);
    const avgStr = gen.averageFitness.toFixed(4);
    const divStr = gen.diversity.toFixed(4);
    const domainStr = gen.bestKernel.domain.padEnd(12);
    console.log(`${genStr} | ${bestStr}   | ${avgStr}  | ${divStr}   | ${domainStr}`);
  }
});

// ============================================================
// Part 5: Results Analysis
// ============================================================
console.log('\n' + '━'.repeat(60));
console.log('Part 5: Results Analysis');
console.log('━'.repeat(60));
console.log('');

const firstGen = generations[0];
const lastGen = generations[generations.length - 1];

console.log('Evolution Summary:');
console.log(`  Total Generations: ${generations.length}`);
console.log(`  Initial Best Fitness: ${firstGen.bestFitness.toFixed(4)}`);
console.log(`  Final Best Fitness: ${lastGen.bestFitness.toFixed(4)}`);
console.log(`  Improvement: ${((lastGen.bestFitness - firstGen.bestFitness) * 100).toFixed(2)}%`);
console.log(`  Initial Diversity: ${firstGen.diversity.toFixed(4)}`);
console.log(`  Final Diversity: ${lastGen.diversity.toFixed(4)}`);
console.log('');

console.log('Best Kernel Details:');
console.log(`  Domain: ${lastGen.bestKernel.domain}`);
console.log(`  Generation: ${lastGen.bestKernel.genome.generation}`);
console.log(`  Stage: ${lastGen.bestKernel.ontogeneticState.stage}`);
console.log(`  Maturity: ${lastGen.bestKernel.ontogeneticState.maturity.toFixed(2)}`);
console.log(`  Age: ${lastGen.bestKernel.genome.age}`);
console.log(`  Lineage Depth: ${lastGen.bestKernel.genome.lineage.length}`);
console.log(`  Genes: ${lastGen.bestKernel.genome.genes.length}`);
console.log('');

// ============================================================
// Conclusion
// ============================================================
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║                   Demo Complete!                         ║');
console.log('║                                                           ║');
console.log('║  Ontogenesis demonstrates that mathematical structures   ║');
console.log('║  can exhibit life-like behaviors: self-replication,      ║');
console.log('║  evolution, and adaptation through the pure language     ║');
console.log('║  of differential calculus.                               ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');
