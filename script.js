// Array of card values and their corresponding numerical values
const cardValues = {
    'A': 11,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10
};

// Global variables
let playerHand = [];
let dealerCard = '';
let playerTotal = 0;

// Populate the dropdown options
function populateCardOptions() {
    const cardOptions = Object.keys(cardValues);
    const dealerCardSelect = document.getElementById('dealer-card');
    const playerCard1Select = document.getElementById('player-card-1');
    const playerCard2Select = document.getElementById('player-card-2');
    const newCardSelect = document.getElementById('new-card');

    cardOptions.forEach(card => {
        const option1 = new Option(card, card);
        const option2 = new Option(card, card);
        const option3 = new Option(card, card);
        const option4 = new Option(card, card);

        dealerCardSelect.add(option1);
        playerCard1Select.add(option2);
        playerCard2Select.add(option3);
        newCardSelect.add(option4);
    });
}

// Calculate the total value of player's hand
function calculateHandValue(cards) {
    let total = 0;
    let aceCount = 0;

    cards.forEach(card => {
        total += cardValues[card];
        if (card === 'A') aceCount++;
    });

    // Adjust for aces
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }

    return total;
}

// Calculate probabilities and provide recommendation
function calculateProbabilities() {
    const dealerCardSelect = document.getElementById('dealer-card');
    const playerCard1Select = document.getElementById('player-card-1');
    const playerCard2Select = document.getElementById('player-card-2');

    dealerCard = dealerCardSelect.value;
    const playerCard1 = playerCard1Select.value;
    const playerCard2 = playerCard2Select.value;

    if (!dealerCard || !playerCard1 || !playerCard2) {
        displayMessage('Please select all cards.');
        return;
    }

    // Initialize player's hand
    playerHand = [playerCard1, playerCard2];
    playerTotal = calculateHandValue(playerHand);

    // Placeholder probabilities
    let winProbability = Math.max(0, 100 - playerTotal * 2);
    let bustProbability = Math.min(100, (playerTotal - 10) * 5);

    // Simple strategy recommendation
    let recommendation = playerTotal >= 17 ? 'Stand' : 'Hit';

    // Display results
    document.getElementById('win-probability').innerText = `Win Probability: ${winProbability}%`;
    document.getElementById('bust-probability').innerText = `Bust Probability: ${bustProbability}%`;
    document.getElementById('recommendation').innerText = `Recommendation: ${recommendation}`;

    document.getElementById('results').style.display = 'block';

    // Hide new card section
    document.getElementById('new-card-section').style.display = 'none';

    // Clear messages
    clearMessage();
}

// Display messages on the site
function displayMessage(message) {
    const messageDiv = document.getElementById('game-messages');
    messageDiv.innerText = message;
}

function clearMessage() {
    const messageDiv = document.getElementById('game-messages');
    messageDiv.innerText = '';
}

// Event listeners
document.getElementById('calculate-btn').addEventListener('click', calculateProbabilities);

document.getElementById('hit-btn').addEventListener('click', () => {
    if (playerHand.length === 0) {
        displayMessage('Please calculate probabilities first.');
        return;
    }
    document.getElementById('new-card-section').style.display = 'block';
    clearMessage();
});

document.getElementById('stand-btn').addEventListener('click', () => {
    displayMessage('You chose to stand.');
    // Here, you could add functionality to simulate the dealer's turn and determine the outcome.
});

document.getElementById('restart-btn').addEventListener('click', () => {
    // Reset the game
    playerHand = [];
    dealerCard = '';
    playerTotal = 0;

    document.getElementById('dealer-card').selectedIndex = 0;
    document.getElementById('player-card-1').selectedIndex = 0;
    document.getElementById('player-card-2').selectedIndex = 0;
    document.getElementById('new-card').selectedIndex = 0;

    document.getElementById('results').style.display = 'none';
    document.getElementById('new-card-section').style.display = 'none';
    clearMessage();
});

document.getElementById('add-card-btn').addEventListener('click', () => {
    const newCardSelect = document.getElementById('new-card');
    const newCard = newCardSelect.value;
    if (!newCard) {
        displayMessage('Please select a new card.');
        return;
    }

    // Add new card to player's hand
    playerHand.push(newCard);
    playerTotal = calculateHandValue(playerHand);

    // Update probabilities and recommendation
    let winProbability = Math.max(0, 100 - playerTotal * 2);
    let bustProbability = Math.min(100, (playerTotal - 10) * 5);
    let recommendation = playerTotal >= 17 ? 'Stand' : 'Hit';

    // Display updated results
    document.getElementById('win-probability').innerText = `Win Probability: ${winProbability}%`;
    document.getElementById('bust-probability').innerText = `Bust Probability: ${bustProbability}%`;
    document.getElementById('recommendation').innerText = `Recommendation: ${recommendation}`;
    document.getElementById('results').style.display = 'block';

    // Check if player busted
    if (playerTotal > 21) {
        displayMessage('You busted!');
        document.getElementById('new-card-section').style.display = 'none';
    } else {
        displayMessage(`Your new total is ${playerTotal}.`);
    }
});

// Initialize the card options on page load
window.onload = function() {
    populateCardOptions();
    document.getElementById('results').style.display = 'none';
    document.getElementById('new-card-section').style.display = 'none';
};
