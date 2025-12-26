# cographiql-hypergraph

Self-generating, evolving kernels through recursive application of differential operators.

## Overview

This package implements the **Ontogenesis** system - a framework for self-generating, self-optimizing, and evolving mathematical kernels based on B-series expansions and differential calculus. It enables kernels to:

1. **Self-Generate**: Create offspring through recursive composition
2. **Self-Optimize**: Improve their own grip through iterative optimization
3. **Self-Reproduce**: Combine genetic material via crossover and mutation
4. **Evolve**: Develop over generations through natural selection

## Installation

```bash
yarn add cographiql-hypergraph
```

## Quick Start

### Example 1: Simple Self-Generation

```typescript
import { 
  UniversalKernelGenerator, 
  initializeOntogeneticKernel, 
  selfGenerate 
} from 'cographiql-hypergraph';

// Create parent kernel
const parent = UniversalKernelGenerator.generateConsciousnessKernel(4);
const ontoParent = initializeOntogeneticKernel(parent);

// Generate offspring
const offspring = selfGenerate(ontoParent);

console.log('Parent:', ontoParent.genome.id);
console.log('Offspring:', offspring.genome.id);
console.log('Generation:', offspring.genome.generation);
```

### Example 2: Multi-Generation Evolution

```typescript
import { UniversalKernelGenerator, runOntogenesis } from 'cographiql-hypergraph';

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

const generations = runOntogenesis(config);

// Analyze results
generations.forEach(gen => {
  console.log(`Gen ${gen.generation}:`);
  console.log(`  Best: ${gen.bestFitness.toFixed(4)}`);
  console.log(`  Avg: ${gen.averageFitness.toFixed(4)}`);
  console.log(`  Diversity: ${gen.diversity.toFixed(4)}`);
});
```

## Core Concepts

### Ontogenetic Kernel

An enhanced kernel with genetic capabilities:

```typescript
interface OntogeneticKernel extends GeneratedKernel {
  genome: KernelGenome;           // Genetic information
  ontogeneticState: OntogeneticState;  // Development state
}
```

### Kernel Genome

The "DNA" of a kernel:

```typescript
interface KernelGenome {
  id: string;                     // Unique identifier
  generation: number;             // Generation number
  lineage: string[];              // Parent IDs
  genes: KernelGene[];            // Genetic information
  fitness: number;                // Overall fitness
  age: number;                    // Age in generations
}
```

### Development Stages

Kernels progress through life stages:
- **Embryonic**: Just generated, basic structure
- **Juvenile**: Developing, optimizing
- **Mature**: Fully developed, capable of reproduction
- **Senescent**: Declining, ready for replacement

## Key Operations

### initializeOntogeneticKernel

Initialize an ontogenetic kernel from a generated kernel:

```typescript
const ontoKernel = initializeOntogeneticKernel(generatedKernel);
```

### selfGenerate

Generate offspring through recursive self-composition (chain rule):

```typescript
const offspring = selfGenerate(parentKernel);
```

### selfOptimize

Optimize kernel through iterative grip improvement:

```typescript
const optimized = selfOptimize(kernel, iterations);
```

### selfReproduce

Combine two kernels to create offspring:

```typescript
const result = selfReproduce(parent1, parent2, 'crossover');
// Methods: 'crossover', 'mutation', 'cloning'
```

### runOntogenesis

Run population-based evolution:

```typescript
const generations = runOntogenesis(config);
```

## Domain-Specific Kernels

The Universal Kernel Generator provides five domain-specific kernels:

### 1. Consciousness Kernel
```typescript
const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
// Uses echo trees for memory and self-reference
```

### 2. Physics Kernel
```typescript
const kernel = UniversalKernelGenerator.generatePhysicsKernel(4);
// Uses Hamiltonian trees for energy conservation
```

### 3. Chemistry Kernel
```typescript
const kernel = UniversalKernelGenerator.generateChemistryKernel(4);
// Uses reaction trees for mass conservation
```

### 4. Biology Kernel
```typescript
const kernel = UniversalKernelGenerator.generateBiologyKernel(4);
// Uses metabolic trees for homeostasis
```

### 5. Computing Kernel
```typescript
const kernel = UniversalKernelGenerator.generateComputingKernel(4);
// Uses recursion trees for type preservation
```

## Mathematical Foundation

### B-Series as Genetic Code

The B-series expansion serves as the genetic code:
```
y_n+1 = y_n + h * Σ b_i * Φ_i(f, y_n)
```

Where:
- `b_i` are the coefficient genes
- `Φ_i` are elementary differentials (rooted trees)
- Trees follow A000081 sequence: 1, 1, 2, 4, 9, 20, 48, 115, ...

### Differential Operators as Reproduction

Kernels reproduce through differential operators:

1. **Chain Rule** (Self-Composition):
   ```
   (f∘g)' = f'(g(x)) · g'(x)
   ```

2. **Product Rule** (Combination):
   ```
   (f·g)' = f'·g + f·g'
   ```

### Grip as Fitness Function

Grip measures how well the kernel's differential structure matches the domain:
```
fitness = 
  grip * 0.4 +          // Quality of domain fit
  stability * 0.2 +     // Numerical stability
  efficiency * 0.2 +    // Computational efficiency
  novelty * 0.1 +       // Genetic diversity
  symmetry * 0.1        // Symmetry preservation
```

## API Reference

### Types

- `OntogeneticKernel` - Kernel with genetic capabilities
- `KernelGenome` - Genetic information
- `OntogeneticState` - Development state
- `GenerationStats` - Statistics for a generation
- `OntogenesisConfig` - Evolution configuration

### Functions

- `initializeOntogeneticKernel(kernel)` - Initialize ontogenetic kernel
- `selfGenerate(kernel)` - Generate offspring
- `selfOptimize(kernel, iterations)` - Optimize kernel
- `selfReproduce(parent1, parent2, method)` - Reproduce kernels
- `runOntogenesis(config)` - Run evolution
- `UniversalKernelGenerator.generate*Kernel(order)` - Generate domain kernels

## Examples

See the `/examples` directory for complete working examples:
- `example1-simple-generation.ts` - Basic kernel generation
- `example2-evolution.ts` - Multi-generation evolution
- `example3-lineage-tracking.ts` - Tracking kernel lineage

## Testing

Run the smoke test:

```bash
npm run build
node test/smoke-test.js
```

## Performance

- **Initialization**: O(n) where n = coefficient count
- **Self-Generation**: O(n²) (operator application)
- **Evolution**: O(g·p·n) where g = generations, p = population
- **Memory**: ~1KB per kernel, 500KB max history

## Documentation

See [ONTOGENESIS.md](../../.github/agents/ONTOGENESIS.md) for detailed documentation including:
- Complete architecture overview
- Mathematical foundations
- Advanced features
- Philosophical implications

## License

MIT

---

**Ontogenesis**: Where mathematics becomes life, and kernels evolve themselves through the pure language of differential calculus.
