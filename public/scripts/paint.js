// paint.js

import { keyManager } from './key.js';

document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById('gridContainer');
    const gridSize = 20;
    const keySize = gridSize * 3;
    let currentMode = 'add';

    function setupGrid() {
        for (let i = 0; i < 600; i++) { // Large example grid
            let cell = document.createElement('div');
            cell.className = 'grid-cell';
            gridContainer.appendChild(cell);
        }
    }

    document.getElementById('addMode').addEventListener('click', () => currentMode = 'add');
    document.getElementById('deleteMode').addEventListener('click', () => currentMode = 'delete');
    document.getElementById('dragMode').addEventListener('click', () => currentMode = 'drag');
	document.getElementById('selectMode').addEventListener('click', () => currentMode = 'select');

    gridContainer.addEventListener('click', (e) => {
        if (currentMode === 'add' && e.target === gridContainer) {
            let rect = gridContainer.getBoundingClientRect();
            let key = keyManager.addKey(e.clientX - rect.left, e.clientY - rect.top);
            displayKey(key);
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
                moving = false;
            }
        });
    }

	gridContainer.addEventListener('click', (e) => {
		if (currentMode === 'select') {
			if (e.target.className.includes('key')) {
				toggleKeySelection(e.target);
				displayKeyInfo();
			} else {
				deselectAllKeys();
				displayKeyInfo();
			}
		}
	});

	function toggleKeySelection(keyElement) {
		keyElement.classList.toggle('selected');
	}

	function deselectAllKeys() {
		document.querySelectorAll('.key.selected').forEach(k => k.classList.remove('selected'));
	}

	function displayKeyInfo() {
		const selectedKeys = document.querySelectorAll('.key.selected');
		const detailsContainer = document.getElementById('keyDetails');
		detailsContainer.innerHTML = '';

		selectedKeys.forEach(key => {
			const index = parseInt(key.dataset.index);
			const keyData = keyManager.getKey(index);
			if (keyData) {
				detailsContainer.innerHTML += `<div>Index: ${keyData.index}</div>
											   <div>Letter: ${keyData.letter}</div>
											   <div>Difficulty: ${keyData.difficulty}</div>
											   <div>Finger Number: ${keyData.fingerNumber}</div>
											   <div>Main Finger Rest: ${keyData.mainFingerRest}</div>`;
			} else {
				console.log('No data found for key with index:', index);
			}
		});
	}

	function selectLayer(layerId) {
		const buttons = document.querySelectorAll('.layer-btn');
		buttons.forEach(btn => {
			if (parseInt(btn.getAttribute('onclick').match(/\d+/)[0]) === layerId) {
				btn.classList.add('selected');
			} else {
				btn.classList.remove('selected');
			}
		});
	}

    setupGrid();
});