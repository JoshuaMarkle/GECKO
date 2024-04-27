CC=emcc
SRC_DIR=./src
OUT_DIR=./public/scripts/wasm
SOURCES=$(SRC_DIR)/GeneticAlgorithm.cpp
OUTPUT_JS=$(OUT_DIR)/ga.js
OUTPUT_WASM=$(OUT_DIR)/ga.wasm

CFLAGS=-O3 -s WASM=1 \
       -s "EXPORTED_FUNCTIONS=['_runGA']" \
       -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" \
       -s "ALLOW_MEMORY_GROWTH=1"

all: clean $(OUTPUT_JS)

$(OUTPUT_JS): $(SOURCES)
	$(CC) $(CFLAGS) $(SOURCES) -o $(OUTPUT_JS)

clean:
	rm -f $(OUTPUT_JS) $(OUTPUT_WASM)

.PHONY: all clean
