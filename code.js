// Variables globales
let inputScreen = document.getElementById('inputScreen');
let shiftPresionado = false;
let blockMayusOn = false;
let altGrPresionado = false;

// Mapa de caracteres especiales para AltGr + número
const altGrChars = {
    '1': '|',
    '2': '@',
    '3': '#',
    '4': '~',
    '5': '€',
    '6': '¬',
    '7': '/',
    '8': '(',
    '9': ')',
    '0': '=',
};

// Función para manejar el clic en las teclas virtuales
function mantenerTecladoVirtual(event) {
    const key = event.target.innerText.toLowerCase();
    presionarTecla(key);
}

// Función para manejar las pulsaciones de teclas (tanto virtuales como físicas)
function presionarTecla(key) {
    switch(key) {
        case 'shift':
            shiftPresionado = !shiftPresionado;
            break;
        case 'bloc mayús':
        case 'capslock':
            blockMayusOn = !blockMayusOn;
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
            altGrPresionado = !altGrPresionado;
            break;
        default:
            if (key.length === 1) {
                let charToAdd = key;
                if (altGrPresionado && key >= '0' && key <= '9') {
                    charToAdd = altGrChars[key] || key;
                } else if (shiftPresionado || blockMayusOn) {
                    charToAdd = charToAdd.toUpperCase();
                }
                inputScreen.textContent += charToAdd;
                if (shiftPresionado) shiftPresionado = false;
                if (altGrPresionado) altGrPresionado = false;
            }
    }
}

// Función para manejar las pulsaciones de teclas físicas
function mantenerTecladoFisico(event) {
    if (event.key === 'Shift') {
        shiftPresionado = true;
    } else if (event.key === 'CapsLock') {
        blockMayusOn = !blockMayusOn;
    } else if (event.key === 'AltGraph') {
        altGrPresionado = true;
    } else {
        presionarTecla(event.key.toLowerCase());
    }
    
    // Prevenir el comportamiento por defecto para ciertas teclas
    if (['Tab', 'Enter', 'CapsLock', 'Backspace'].includes(event.key)) {
        event.preventDefault();
    }
}

// Función para manejar la liberación de teclas físicas
function handlePhysicalKeyRelease(event) {
    if (event.key === 'Shift') {
        shiftPresionado = false;
    } else if (event.key === 'AltGraph') {
        altGrPresionado = false;
    }
}

// Agregar event listeners
document.querySelectorAll('.tecla, .espacio').forEach(key => {
    key.addEventListener('click', mantenerTecladoVirtual);
});

document.addEventListener('keydown', mantenerTecladoFisico);
document.addEventListener('keyup', handlePhysicalKeyRelease);

// Prevenir el comportamiento por defecto del inputScreen
inputScreen.addEventListener('keydown', function(event) {
    event.preventDefault();
});