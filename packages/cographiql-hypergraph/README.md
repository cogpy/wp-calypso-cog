# cographiql-hypergraph

Self-generating, evolving kernels through recursive application of differential operators.

## Overview

This package implements the Ontogenesis system - a framework for self-generating, self-optimizing, and evolving mathematical kernels based on B-series expansions and differential calculus.

## Installation

```bash
yarn add cographiql-hypergraph
```

## Quick Start

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

## Features

- **Self-Generation**: Kernels generate offspring through recursive composition
- **Self-Optimization**: Iterative grip improvement
- **Self-Reproduction**: Genetic crossover and mutation
- **Evolution**: Population-based evolution with fitness selection

## Documentation

See [ONTOGENESIS.md](../../.github/agents/ONTOGENESIS.md) for detailed documentation.

## License

MIT
