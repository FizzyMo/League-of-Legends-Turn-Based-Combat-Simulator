// File path: /path/to/your/script.js

// Global variables
var characters;
var gameState;

function startGame() {
    showCustomAlert('Welcome To The Fight\r\nOf Your Life', initializeGame);
}

function initializeGame() {
    characters = characterChoices();
    gameState = resetGameState();
    emptyDivs(); // Ensure any previous elements are cleared
    appendCharacters();
    document.getElementById('characters-section').style.display = 'block';
    document.getElementById('selected-character-section').style.display = 'none';
    document.getElementById('attack-button').style.display = 'none';
    document.getElementById('reset-button').style.display = 'none';
}

function showCustomAlert(message, callback) {
    document.getElementById('custom-alert').style.display = 'flex';
    document.getElementById('alert-message').textContent = message;

    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.getElementById('custom-alert').style.display = 'none';
    });

    const confirmBtn = document.querySelector('.confirm-button');
    confirmBtn.addEventListener('click', () => {
        document.getElementById('custom-alert').style.display = 'none';
        if (callback) callback();
    });
}

function characterChoices() {
    return {
        'diana': {
            name: 'Diana',
            health: 125,
            attack: 17,
            counterAttack: 15,
            image: 'assets/images/diana.jpg',
        },
        'teemo': {
            name: 'Teemo',
            health: 100,
            attack: 25,
            counterAttack: 10,
            image: 'assets/images/teemo.jpg'
        },
        'thresh': {
            name: 'Thresh',
            health: 200,
            attack: 10,
            counterAttack: 8,
            image: 'assets/images/thresh.jpg'
        },
        'vayne': {
            name: 'Vanye',
            health: 95,
            attack: 20,
            counterAttack: 13,
            image: 'assets/images/vanye.jpg'
        },
        'leona': {
            name: 'Leona',
            health: 175,
            attack: 11,
            counterAttack: 14,
            image: 'assets/images/leona.jpg'
        },
        'rumble': {
            name: 'Rumble',
            health: 110,
            attack: 20,
            counterAttack: 9,
            image: 'assets/images/rumble.jpg'
        },
        'pantheon': {
            name: 'Pantheon',
            health: 70,
            attack: 25,
            counterAttack: 12,
            image: 'assets/images/pantheon.jpg'
        },
    }
}

function resetGameState() {
    return {
        selectedCharacter: null,
        selectedDefender: null,
        enemiesLeft: 0,
        numAttacks: 0
    }
}

function createCharDiv(character, key) {
    var charDiv = $("<div class='character' data-name='" + key + "'>");
    var charName = $("<div class ='character-name'>").text(character.name);
    var charImage = $("<img alt='image' class='character-image'>").attr('src', character.image);
    var charHealth = $("<div class ='character-health'>").text('Health: ' + character.health);
    charDiv.append(charName).append(charImage).append(charHealth);
    return charDiv;
}

function appendCharacters() {
    var keys = Object.keys(characters);
    for (var i = 0; i < keys.length; i++) {
        var characterKey = keys[i];
        var character = characters[characterKey];
        var charDiv = createCharDiv(character, characterKey);
        $('#character-area').append(charDiv);
    }
}

function appendOpponents(selectedCharacterKey) {
    var characterKeys = Object.keys(characters);
    for (var i = 0; i < characterKeys.length; i++) {
        if (characterKeys[i] !== selectedCharacterKey) {
            var enemyKey = characterKeys[i];
            var enemy = characters[enemyKey];
            var enemyDiv = createCharDiv(enemy, enemyKey);
            $(enemyDiv).addClass('enemy');
            $('#available-to-attack-section').append(enemyDiv);
        }
    }
}

function enableEnemySelection() {
    $('.enemy').on('click.enemySelect', function() {
        var opponentKey = $(this).attr('data-name');
        gameState.selectedDefender = characters[opponentKey];
        $('#defender').append(this);
        $('#attack-button').show();
        $('.enemy').off('click.enemySelect');
    });
}

function attack(numAttacks) {
    gameState.selectedDefender.health -= gameState.selectedCharacter.attack * numAttacks;
    if (gameState.selectedDefender.health < 0) {
        gameState.selectedDefender.health = 0;
    }
}

function defend() {
    gameState.selectedCharacter.health -= gameState.selectedDefender.counterAttack;
    if (gameState.selectedCharacter.health < 0) {
        gameState.selectedCharacter.health = 0;
    }
}

function isCharacterDead(character) {
    return character.health <= 0;
}

function gameWon() {
    return gameState.enemiesLeft === 0;
}

function isAttackPhaseComplete() {
    if (isCharacterDead(gameState.selectedCharacter)) {
        // When Your Character Dies Against The Opponent
        alert('You are not strong enough ' + gameState.selectedDefender.name + '. Click reset to play again');
        $('#selected-character').empty();
        $('#reset-button').show();
        return true;
    } else if (isCharacterDead(gameState.selectedDefender)) {
        gameState.enemiesLeft--;
        $('#defender').empty();
        if (gameWon()) {
            // Your Character Won Against All The Opponents
            alert('You Won Young Wolf! Press Reset to play again');
            $('#reset-button').show();
        } else {
            // Your Character Won Against Current Opponent and Is Ready To Keep Fighting
            alert('I Will Not Fall ' + gameState.selectedDefender.name + '! Select another enemy to challenge');
            enableEnemySelection();
        }
        return true;
    }
    return false;
}

function emptyDivs() {
    $('#selected-character').empty();
    $('#defender').empty();
    $('#available-to-attack-section .enemy').remove();
    $('#character-area').empty();
}

$(document).ready(function() {
    $('#character-area').on('click', '.character', function() {
        var selectedKey = $(this).attr('data-name');
        gameState.selectedCharacter = characters[selectedKey];
        $('#selected-character').append(this);
        appendOpponents(selectedKey);
        $('#characters-section').hide();
        $('#selected-character-section').show();
        gameState.enemiesLeft = Object.keys(characters).length - 1;
        enableEnemySelection();
    });

    $('#attack-button').on('click.attack', function() {
        gameState.numAttacks++;
        attack(gameState.numAttacks);
        defend();
        $('#selected-character .character-health').text('Health: ' + gameState.selectedCharacter.health);
        $('#defender .character-health').text('Health: ' + gameState.selectedDefender.health);
        if (isAttackPhaseComplete()) {
            $(this).hide();
        }
    });

    $('#reset-button').on('click.reset', function() {
        emptyDivs();
        showCustomAlert('Welcome To The Fight\r\nOf Your Life', startGame);
    });

    startGame();
});
