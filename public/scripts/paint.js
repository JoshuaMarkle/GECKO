// paint.js

import { keyManager } from './key.js';

document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById('gridContainer');
    const gridSize = 20;
    const keySize = gridSize * 3;
    let currentMode = 'add';

	// Change Editing Modes
	document.getElementById('addMode').addEventListener('click', () => changeMode('add'));
	document.getElementById('deleteMode').addEventListener('click', () => changeMode('delete'));
	document.getElementById('dragMode').addEventListener('click', () => changeMode('drag'));
	document.getElementById('selectMode').addEventListener('click', () => changeMode('select'));
	changeMode('add');

	function changeMode(mode) {
		currentMode = mode;
		const modeButtons = document.querySelectorAll('.mode-btn');
		modeButtons.forEach(button => {
			if (button.id === mode + 'Mode') {
				button.classList.add('selected');
			} else {
				button.classList.remove('selected');
			}
		});
	}

    gridContainer.addEventListener('click', (e) => {
        if (currentMode === 'add') {
            let rect = gridContainer.getBoundingClientRect();
            let key = keyManager.addKey(e.clientX - rect.left, e.clientY - rect.top);
            displayKey(key);
			updateHierarchy();
        }
    });

	function displayKey(key) {
		let keyElement = document.createElement('div');
		keyElement.className = 'key';
		keyElement.style.left = `${Math.round(key.x / gridSize) * gridSize - keySize / 2}px`;
		keyElement.style.top = `${Math.round(key.y / gridSize) * gridSize - keySize / 2}px`;
		keyElement.dataset.index = key.index;
		let keyTop = document.createElement('div');
		keyTop.className = 'key-top';
		// keyTop.textContent = key.letter;
		keyTop.textContent = key.index;
		keyElement.appendChild(keyTop);
		gridContainer.appendChild(keyElement);
		setupDrag(keyElement, key.index);
	}

    function setupDrag(keyElement, index) {
        let moving = false;
        let offsetX, offsetY;

        keyElement.addEventListener('mousedown', (e) => {
            if (currentMode === 'drag') {
                moving = true;
                offsetX = e.clientX - parseInt(keyElement.style.left) - gridSize;
                offsetY = e.clientY - parseInt(keyElement.style.top) - gridSize;
                keyElement.style.opacity = '0.7';
                keyElement.style.zIndex = '2';
                e.preventDefault(); // Prevent drag behavior from interfering
            } else if (currentMode === 'delete') {
                gridContainer.removeChild(keyElement);
                keyManager.deleteKey(index);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (moving) {
                let newX = Math.round((e.clientX - offsetX) / gridSize) * gridSize - keySize / 2;
                let newY = Math.round((e.clientY - offsetY) / gridSize) * gridSize - keySize / 2;
                keyElement.style.left = `${newX}px`;
                keyElement.style.top = `${newY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (moving) {
                keyElement.style.opacity = '1';
                keyElement.style.zIndex = '1';
                moving = false;
            }
        });
    }

	gridContainer.addEventListener('click', (e) => {
		if (currentMode === 'select') {
			if (e.target.classList.contains('key')) {
				toggleKeySelection(e.target);
			} else {
				deselectAllKeys();
			}
			updateHierarchy();
		}
	});

	function toggleKeySelection(keyOrIndex) {
		let keyElement;

		if (typeof keyOrIndex === 'number') {
			// From hierarchy, where only index might be passed
			keyManager.toggleSelection(keyOrIndex);
			keyElement = document.querySelector(`.key[data-index="${keyOrIndex}"]`);
		} else if (keyOrIndex instanceof Element) {
			// From grid interaction, where the element is passed
			const index = parseInt(keyOrIndex.dataset.index);
			keyManager.toggleSelection(index);
			keyElement = keyOrIndex;
		}

		if (keyElement) {
			keyElement.classList.toggle('selected'); // Toggle visual state
		}
		updateHierarchy(); // Reflect changes in the hierarchy
	}

	function deselectAllKeys() {
		keyManager.deselectAll();
		document.querySelectorAll('.key').forEach(k => k.classList.remove('selected'));
		updateHierarchy(); // Reflect the change
	}

	function updateHierarchy() {
		const keyList = document.getElementById('keyList');
		keyList.innerHTML = ''; // Clear the current list

		keyManager.keys.forEach(key => {
			const listItem = document.createElement('li');
			listItem.textContent = `Key ${key.index}: ${key.letter}`;
			listItem.dataset.index = key.index;
			listItem.className = 'key-item';
			if (key.selected) {
				listItem.classList.add('selected');
			}

			listItem.addEventListener('click', () => {
				toggleKeySelection(key.index); // Pass the index directly
			});

			keyList.appendChild(listItem);
		});
	}
});
