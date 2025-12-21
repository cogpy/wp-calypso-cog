/**
 * Evolution system: Population-based evolution with genetic algorithms
 */

import type {
  OntogeneticKernel,
  OntogenesisConfig,
  GenerationStats,
  EvolutionConfig,
} from '../types';
import { calculateNovelty, shuffle } from '../utils';
import { initializeOntogeneticKernel, updateDevelopmentStage } from './initialization';
import { selfOptimize } from './optimization';
import { crossover, mutate } from './reproduction';

/**
 * Run the ontogenesis evolution process
 */
export function runOntogenesis(config: OntogenesisConfig): GenerationStats[] {
  // Initialize population from seed kernels
  let population = config.seedKernels.map((kernel) => initializeOntogeneticKernel(kernel));

  // Expand to target population size with mutations
  while (population.length < config.evolution.populationSize) {
    const parent = population[Math.floor(Math.random() * population.length)];
    const offspring = mutate(parent, 0.2);
    population.push(offspring);
  }

  const generations: GenerationStats[] = [];

  // Evolution loop
  for (let gen = 0; gen < config.evolution.maxGenerations; gen++) {
    // Evaluate fitness
    evaluatePopulationFitness(population, config);

    // Record generation stats
    const stats = calculateGenerationStats(gen, population);
    generations.push(stats);

    // Check if threshold reached
    if (stats.bestFitness >= config.evolution.fitnessThreshold) {
      console.log(`Fitness threshold reached at generation ${gen}`);
      break;
    }

    // Create next generation
    population = createNextGeneration(population, config.evolution);

    // Update development stages
    population.forEach((kernel) => {
      kernel.genome.age++;
      updateDevelopmentStage(kernel, config.developmentSchedule);
    });
  }

  return generations;
}

/**
 * Evaluate fitness for entire population
 */
function evaluatePopulationFitness(
  population: OntogeneticKernel[],
  config: OntogenesisConfig
): void {
  population.forEach((kernel) => {
    if (config.fitnessFunction) {
      kernel.genome.fitness = config.fitnessFunction(kernel);
    } else {
      kernel.genome.fitness = defaultFitnessFunction(kernel, population, config);
    }
  });
}

/**
 * Default fitness function combining grip, stability, efficiency, novelty, and symmetry
 */
function defaultFitnessFunction(
  kernel: OntogeneticKernel,
  population: OntogeneticKernel[],
  config: OntogenesisConfig
): number {
  const grip = kernel.grip.overall;
  const stability = kernel.grip.stability;
  const efficiency = kernel.grip.efficiency;
  const novelty = calculateNovelty(kernel, population);

  // Symmetry preservation (check immutable genes)
  const symmetryGenes = kernel.genome.genes.filter((g) => g.type === 'symmetry');
  const symmetry = symmetryGenes.length > 0 ? symmetryGenes[0].value : 1.0;

  // Weighted combination
  const fitness =
    grip * 0.4 +
    stability * 0.2 +
    efficiency * 0.2 +
    novelty * config.evolution.diversityPressure +
    symmetry * 0.1;

  return fitness;
}

/**
 * Calculate statistics for current generation
 */
function calculateGenerationStats(
  generation: number,
  population: OntogeneticKernel[]
): GenerationStats {
  const fitnesses = population.map((k) => k.genome.fitness);
  const bestFitness = Math.max(...fitnesses);
  const averageFitness = fitnesses.reduce((sum, f) => sum + f, 0) / fitnesses.length;

  // Calculate diversity as average pairwise distance
  let totalDistance = 0;
  let pairs = 0;
  for (let i = 0; i < population.length; i++) {
    for (let j = i + 1; j < population.length; j++) {
      totalDistance += calculateNovelty(population[i], [population[j]]);
      pairs++;
    }
  }
  const diversity = pairs > 0 ? totalDistance / pairs : 0;

  const bestIndex = fitnesses.indexOf(bestFitness);
  const bestKernel = population[bestIndex];

  return {
    generation,
    population: population.map((k) => ({ ...k })), // Clone for immutability
    bestFitness,
    averageFitness,
    diversity,
    bestKernel,
  };
}

/**
 * Create next generation through selection, crossover, and mutation
 */
function createNextGeneration(
  population: OntogeneticKernel[],
  config: EvolutionConfig
): OntogeneticKernel[] {
  const nextGen: OntogeneticKernel[] = [];

  // Elite preservation
  const eliteCount = Math.floor(config.populationSize * config.elitismRate);
  const sorted = [...population].sort((a, b) => b.genome.fitness - a.genome.fitness);
  nextGen.push(...sorted.slice(0, eliteCount).map((k) => ({ ...k })));

  // Fill rest with offspring
  while (nextGen.length < config.populationSize) {
    // Tournament selection
    const parent1 = tournamentSelection(population, 3);
    const parent2 = tournamentSelection(population, 3);

    // Crossover
    if (Math.random() < config.crossoverRate) {
      const offspring = crossover(parent1, parent2);
      nextGen.push(...offspring.slice(0, config.populationSize - nextGen.length));
    } else {
      // Just copy parents
      nextGen.push({ ...parent1 });
      if (nextGen.length < config.populationSize) {
        nextGen.push({ ...parent2 });
      }
    }
  }

  // Apply mutations
  const mutated = nextGen.map((kernel) => mutate(kernel, config.mutationRate));

  // Trim to exact size
  return mutated.slice(0, config.populationSize);
}

/**
 * Tournament selection: randomly select k individuals and return the best
 */
function tournamentSelection(
  population: OntogeneticKernel[],
  tournamentSize: number = 3
): OntogeneticKernel {
  const shuffled = shuffle(population);
  const tournament = shuffled.slice(0, Math.min(tournamentSize, population.length));

  return tournament.reduce((best, current) =>
    current.genome.fitness > best.genome.fitness ? current : best
  );
}
