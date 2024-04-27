self.importScripts('wasm/ga.js'); // Import the compiled WebAssembly module

self.onmessage = function(e) {
    const { iterations, populationSize } = e.data;
    const result = Module.ccall('runGA', 'number', ['number', 'number'], [iterations, populationSize]);
    postMessage({ type: 'complete', result });
};

function updateUI(iteration, best) {
    postMessage({ type: 'update', iteration, best });
}

// Overwrite the Module object's print function to hook console outputs if needed
Module['print'] = function(text) {
    postMessage({ type: 'print', message: text });
};
