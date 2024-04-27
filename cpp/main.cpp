#include <iostream>
#include <algorithm>
#include <random>
#include <vector>
#include <string>
#include <iomanip>
#include <chrono>

using namespace std;

const int GENERATIONS = 1000;
const int POPULATION = 100;
const int KEY_COUNT = 30;

double calculateValue(const string &keyboard, int keyNum);
void mutateKeyboard(string &keyboard);

int main() {
	// Initialize Vars
	vector<string> keyboards(POPULATION, "abcdefghijklmnopqrstuvwxyz;',.");
	string bestKeyboard = keyboards[0];
	double bestValue = calculateValue(bestKeyboard, KEY_COUNT);
	bool newBest;
	
	// Start Optimizing
	for (int gen = 1; gen < GENERATIONS; gen++) {
		newBest = false;
		for (int i = 0; i < POPULATION; i++) {
			// Randomly shuffle the keyboard and check the value
			unsigned seed = chrono::system_clock::now().time_since_epoch().count();
			mutateKeyboard(keyboards[i]);
			double value = calculateValue(keyboards[i], KEY_COUNT); 

			if (value > bestValue) {
				bestValue = value;
				bestKeyboard = keyboards[i];
				newBest = true;
			}
		}

		// Check if a new best keyboard was found
		if (newBest) {
			cout << "Generation: " << setw(5) << left << gen << " Best Value: " << setw(8) << bestValue << bestKeyboard << endl;
			fill(keyboards.begin(), keyboards.end(), bestKeyboard);
		}
	}

	cout << "Complete Optimization" << endl;
	return 0;
}

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
