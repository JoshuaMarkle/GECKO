CC=emcc
SRC_DIR=./src
OUT_DIR=./public/scripts/wasm
SOURCES=$(wildcard $(SRC_DIR)/*.cpp)
OUTPUT_JS=$(OUT_DIR)/ga.js
OUTPUT_WASM=$(OUT_DIR)/ga.wasm

CFLAGS=-O3 -s WASM=1 \
       -s "EXPORTED_FUNCTIONS=['_runOptimization']" \
       -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" \
       -s "ALLOW_MEMORY_GROWTH=1"

all: clean $(OUTPUT_JS)

$(OUTPUT_JS): $(SOURCES)
	if [ ! -d $(OUT_DIR) ]; then mkdir -p $(OUT_DIR); fi
	$(CC) $(CFLAGS) $^ -o $@

clean:
	rm -f $(OUTPUT_JS) $(OUTPUT_WASM)

.PHONY: all clean
