/**
 * Basic smoke test for the ontogenesis system
 */

const {
  UniversalKernelGenerator,
  initializeOntogeneticKernel,
  selfGenerate,
  selfOptimize,
  selfReproduce,
  runOntogenesis,
} = require('../dist/index.js');

// Test 1: Kernel Generation
console.log('Test 1: Kernel Generation');
const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
console.log(`✓ Generated kernel: ${kernel.id}`);
console.log(`  Domain: ${kernel.domain}`);
console.log(`  Order: ${kernel.order}`);
console.log(`  Grip: ${kernel.grip.overall.toFixed(4)}`);
console.log('');

// Test 2: Ontogenetic Initialization
console.log('Test 2: Ontogenetic Initialization');
const ontoKernel = initializeOntogeneticKernel(kernel);
console.log(`✓ Initialized ontogenetic kernel`);
console.log(`  Genome ID: ${ontoKernel.genome.id}`);
console.log(`  Generation: ${ontoKernel.genome.generation}`);
console.log(`  Stage: ${ontoKernel.ontogeneticState.stage}`);
console.log(`  Genes: ${ontoKernel.genome.genes.length}`);
console.log('');

// Test 3: Self-Generation
console.log('Test 3: Self-Generation');
const offspring = selfGenerate(ontoKernel);
console.log(`✓ Generated offspring`);
console.log(`  Offspring Generation: ${offspring.genome.generation}`);
console.log(`  Parent ID: ${offspring.genome.lineage[0]}`);
console.log('');

// Test 4: Self-Optimization
console.log('Test 4: Self-Optimization');
const optimized = selfOptimize(offspring, 5);
console.log(`✓ Optimized kernel`);
console.log(`  Initial Fitness: ${offspring.genome.fitness.toFixed(4)}`);
console.log(`  Optimized Fitness: ${optimized.genome.fitness.toFixed(4)}`);
console.log(`  Maturity: ${optimized.ontogeneticState.maturity.toFixed(2)}`);
console.log('');

// Test 5: Self-Reproduction
console.log('Test 5: Self-Reproduction');
const kernel2 = UniversalKernelGenerator.generatePhysicsKernel(4);
const ontoKernel2 = initializeOntogeneticKernel(kernel2);
const reproResult = selfReproduce(ontoKernel, ontoKernel2, 'crossover');
console.log(`✓ Reproduced kernels`);
console.log(`  Method: ${reproResult.method}`);
console.log(`  Offspring count: ${reproResult.offspring.length}`);
console.log('');

// Test 6: Evolution (short run)
console.log('Test 6: Evolution (5 generations)');
const config = {
  evolution: {
    populationSize: 10,
    mutationRate: 0.15,
    crossoverRate: 0.8,
    elitismRate: 0.2,
    maxGenerations: 5,
    fitnessThreshold: 0.95,
    diversityPressure: 0.1,
  },
  seedKernels: [
    UniversalKernelGenerator.generateConsciousnessKernel(4),
    UniversalKernelGenerator.generatePhysicsKernel(4),
  ],
};

const generations = runOntogenesis(config);
console.log(`✓ Completed evolution`);
console.log(`  Generations: ${generations.length}`);
console.log(`  Initial best fitness: ${generations[0].bestFitness.toFixed(4)}`);
console.log(`  Final best fitness: ${generations[generations.length - 1].bestFitness.toFixed(4)}`);
console.log('');

// Test 7: All domain kernels
console.log('Test 7: All Domain Kernels');
const domains = [
  ['Consciousness', UniversalKernelGenerator.generateConsciousnessKernel(4)],
  ['Physics', UniversalKernelGenerator.generatePhysicsKernel(4)],
  ['Chemistry', UniversalKernelGenerator.generateChemistryKernel(4)],
  ['Biology', UniversalKernelGenerator.generateBiologyKernel(4)],
  ['Computing', UniversalKernelGenerator.generateComputingKernel(4)],
];

domains.forEach(([name, k]) => {
  console.log(`  ${name}: grip=${k.grip.overall.toFixed(4)}, trees=${k.coefficients.trees.length}`);
});
console.log('');

console.log('═'.repeat(60));
console.log('All tests passed! ✓');
console.log('═'.repeat(60));
