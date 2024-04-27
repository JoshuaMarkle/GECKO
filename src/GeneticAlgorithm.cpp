// Filename: GeneticAlgorithm.cpp
#include <vector>
#include <cstdlib>
#include <ctime>
#include <cmath>
#include <emscripten.h>

// Simple fitness function: f(x) = x^2
float fitnessFunction(int x) {
    return pow(x, 2);
}

// Generate initial population
std::vector<int> generatePopulation(int size) {
    std::vector<int> population(size);
    for (int i = 0; i < size; i++) {
        population[i] = rand() % 100; // Random integers between 0 and 99
    }
    return population;
}

// Simple selection and crossover function
int crossover(int x, int y) {
    return (x + y) / 2;
}

// Mutation function
int mutate(int x) {
    return x + (rand() % 20 - 10); // Randomly increase or decrease by up to 10
}

// Genetic algorithm implementation
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    int runGA(int iterations, int populationSize) {
        srand(time(NULL));
        auto population = generatePopulation(populationSize);
        int best = 0;

        for (int i = 0; i < iterations; i++) {
            for (int j = 0; j < populationSize; j++) {
                int k = rand() % populationSize;
                int l = rand() % populationSize;
                int offspring = crossover(population[k], population[l]);
                offspring = mutate(offspring);
                float currentFitness = fitnessFunction(population[j]);
                float offspringFitness = fitnessFunction(offspring);

                if (offspringFitness > currentFitness) {
                    population[j] = offspring;
                }

                if (fitnessFunction(population[j]) > fitnessFunction(best)) {
                    best = population[j];
                }

                // Call JavaScript to update UI
                EM_ASM({
                    updateUI($0, $1);
                }, i, best);
            }
        }

        return best;
    }
}
