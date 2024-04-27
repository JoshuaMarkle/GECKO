// key.js

class Key {
    constructor(index, x, y, letter = 'A', difficulty = 1, fingerNumber = 1, mainFingerRest = false) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.difficulty = difficulty;
        this.fingerNumber = fingerNumber;
        this.mainFingerRest = mainFingerRest;
    }
}

class KeyManager {
    constructor() {
        this.keys = [];
    }

    addKey(x, y) {
        const index = this.keys.length + 1; // Simple index generation
        const key = new Key(index, x, y);
        this.keys.push(key);
        return key;
    }

    deleteKey(index) {
        const keyIndex = this.keys.findIndex(k => k.index === index);
        if (keyIndex !== -1) {
            this.keys.splice(keyIndex, 1);
        }
    }

	getKey(index) {
		console.log('Fetching key with index:', index); // Logging to debug
		return this.keys.find(k => k.index === index);
	}

    updateKey(index, properties) {
        const key = this.getKey(index);
        if (key) {
            Object.assign(key, properties);
        }
    }
}

export const keyManager = new KeyManager();
