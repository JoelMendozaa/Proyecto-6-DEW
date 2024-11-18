// Variables globales
let inputScreen = document.getElementById('inputScreen');
let shiftPressed = false;
let capsLockOn = false;
let altGrPressed = false;

// Mapa de caracteres especiales para AltGr + número
const altGrChars = {
    '1': '|',
    '2': '@',
    '3': '#',
    '4': '~',
    '5': '€',
    '6': '¬',
    '7': '{',
    '8': '[',
    '9': ']',
    '0': '}',
};

// Función para manejar el clic en las teclas virtuales
function handleVirtualKeyPress(event) {
    const key = event.target.innerText.toLowerCase();
    handleKeyPress(key, true);
}

// Función para manejar las pulsaciones de teclas (tanto virtuales como físicas)
function handleKeyPress(key, isVirtual = false) {
    switch(key) {
        case 'shift':
            shiftPressed = !shiftPressed;
            break;
        case 'bloc mayús':
        case 'capslock':
            capsLockOn = !capsLockOn;
            break;
        case 'back':
        case 'backspace':
            inputScreen.textContent = inputScreen.textContent.slice(0, -1);
            break;
        case 'enter':
            inputScreen.textContent += '\n';
            break;
        case 'tab':
            inputScreen.textContent += '    ';
            break;
        case 'espacio':
        case ' ':
            inputScreen.textContent += ' ';
            break;
        case 'alt gr':
            altGrPressed = !altGrPressed;
            break;
        default:
            if (key.length === 1) {
                let charToAdd = key;
                if (altGrPressed && (key >= '0' && key <= '9')) {
                    charToAdd = altGrChars[key] || key;
                } else if (shiftPressed || capsLockOn) {
                    charToAdd = charToAdd.toUpperCase();
                }
                inputScreen.textContent += charToAdd;
                if (shiftPressed && isVirtual) shiftPressed = false;
                if (altGrPressed && isVirtual) altGrPressed = false;
            }
    }
}

// Función para manejar las pulsaciones de teclas físicas
function handlePhysicalKeyPress(event) {
    if (event.key === 'Shift') {
        shiftPressed = true;
    } else if (event.key === 'CapsLock') {
        capsLockOn = !capsLockOn;
    } else if (event.key === 'AltGraph') {
        altGrPressed = true;
    } else {
        handleKeyPress(event.key.toLowerCase());
    }
    
    // Prevenir el comportamiento por defecto para ciertas teclas
    if (['Tab', 'Enter', 'CapsLock', 'Backspace'].includes(event.key)) {
        event.preventDefault();
    }
}

// Función para manejar la liberación de teclas físicas
function handlePhysicalKeyRelease(event) {
    if (event.key === 'Shift') {
        shiftPressed = false;
    } else if (event.key === 'AltGraph') {
        altGrPressed = false;
    }
}

// Función para actualizar el estado visual de las teclas modificadoras
function updateModifierKeys() {
    document.querySelectorAll('.tecla').forEach(key => {
        const keyText = key.innerText.toLowerCase();
        if (keyText === 'shift') {
            key.classList.toggle('active', shiftPressed);
        } else if (keyText === 'bloc mayús') {
            key.classList.toggle('active', capsLockOn);
        } else if (keyText === 'alt gr') {
            key.classList.toggle('active', altGrPressed);
        }
    });
}

// Agregar event listeners
document.querySelectorAll('.tecla, .espacio').forEach(key => {
    key.addEventListener('mousedown', handleVirtualKeyPress);
    key.addEventListener('mouseup', updateModifierKeys);
});

document.addEventListener('keydown', handlePhysicalKeyPress);
document.addEventListener('keyup', event => {
    handlePhysicalKeyRelease(event);
    updateModifierKeys();
});

// Prevenir el comportamiento por defecto del inputScreen
inputScreen.addEventListener('keydown', function(event) {
    event.preventDefault();
});

// Estilo para teclas activas
const style = document.createElement('style');
style.textContent = `
    .tecla.active {
        background-color: #4a90e2;
        color: white;
    }
`;
document.head.appendChild(style);