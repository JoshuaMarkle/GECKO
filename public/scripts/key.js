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
		this.selected = false;
    }
}

class KeyManager {
    constructor() {
        this.keys = [];
    }

    addKey(x, y) {
        const index = this.keys.length + 1; // Unique index for each key
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
        return this.keys.find(k => k.index === index);
    }

    toggleSelection(index) {
        const key = this.getKey(index);
        if (key) {
            key.selected = !key.selected;
        }
    }

    deselectAll() {
        this.keys.forEach(key => key.selected = false);
    }

    getSelectedKeys() {
        return this.keys.filter(key => key.selected);
    }
}

export const keyManager = new KeyManager();
