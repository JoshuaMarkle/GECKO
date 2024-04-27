function selectLayer(selectedId) {
    const buttons = document.querySelectorAll('.layer-btn');
	const identifier = "layer-btn-" + selectedId;
    buttons.forEach(btn => {
        if (btn.id === identifier) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const divider = document.getElementById('draggableDivider');
    const keyInfoContainer = document.getElementById('keyInfoContainer');
    const layerContainer = document.getElementById('layerContainer');
    let dragging = false;

    divider.addEventListener('mousedown', function(e) {
        dragging = true;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!dragging) return;
        let newY = e.clientY - rightSidebar.offsetTop; // Adjust based on sidebar's position
        let maxHeight = rightSidebar.offsetHeight;
        if (newY < 50) newY = 50; // Minimum height for keyInfoContainer
        if (newY > maxHeight - 50) newY = maxHeight - 50; // Minimum height for layerContainer
        keyInfoContainer.style.height = `${newY}px`;
        layerContainer.style.height = `${maxHeight - newY - 5}px`; // Subtract divider height
    }

    function onMouseUp() {
        dragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
});

