self.importScripts('wasm/ga.js');

self.onmessage = function(e) {
    // const { iterations, populationSize } = e.data;
    // const result = Module.ccall('runGA', 'number', ['number', 'number'], [iterations, populationSize]);
	Module.ccall('runOptimization', null, [], []);
    // postMessage({ type: 'complete', result });
};

function updateUI(gen, bestValue, bestKeyboard) {
    postMessage({ type: 'update', generation: gen, bestValue: bestValue, bestKeyboard: bestKeyboard });
}

// Overwrite the Module object's print function to hook console outputs if needed
Module['print'] = function(text) {
    postMessage({ type: 'print', message: text });
};

// Overwrite the onAbort function to handle unexpected stops
Module['onAbort'] = function(message) {
    postMessage({ type: 'error', message });
};

// Add direct communication functions to Module to use from C++
Module['updateUI'] = updateUI;
