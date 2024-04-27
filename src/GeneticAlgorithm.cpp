#include <iostream>
#include <algorithm>
#include <vector>
#include <string>
#include <random>
#include <emscripten.h>

using namespace std;

const int GENERATIONS = 1000;
const int POPULATION = 100;
const int KEY_COUNT = 30;

double calculateValue(const string &keyboard, int keyNum) {
    double value = 0;
    for (int i = 0; i < keyNum; i++) {
        value += i * keyboard[i];
    }
    return value;
}

void mutateKeyboard(string &keyboard) {
    int numMutations = rand() % 5;
    for (int i = 0; i < numMutations; ++i) {
        int idx1 = rand() % keyboard.size();
        int idx2 = rand() % keyboard.size();
        swap(keyboard[idx1], keyboard[idx2]);
    }
}

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void runOptimization() {
        vector<string> keyboards(POPULATION, "abcdefghijklmnopqrstuvwxyz;',.");
        string bestKeyboard = keyboards[0];
        double bestValue = calculateValue(bestKeyboard, KEY_COUNT);
        bool newBest;

        for (int gen = 0; gen < GENERATIONS; gen++) {
            newBest = false;
            for (int i = 0; i < POPULATION; i++) {
                mutateKeyboard(keyboards[i]);
                double value = calculateValue(keyboards[i], KEY_COUNT);

                if (value > bestValue) {
                    bestValue = value;
                    bestKeyboard = keyboards[i];
                    newBest = true;
                }
            }

            if (newBest) {
                EM_ASM({
                    updateUI($0, $1, UTF8ToString($2));
                }, gen, bestValue, bestKeyboard.c_str());
            }
        }
    }
}

