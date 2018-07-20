//symbol for the wild card
const wildCardSymbol = '*';

//character representations of each possible card
//ORDER MATTERS HERE
const cardSymbols = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

//poker hands ordered from least valuable to most valuable
//ORDER MATTERS HERE
const handRankings = [
    'High Card',
    'Pair',
    'Two Pair',
    'Three of a Kind',
    'Straight',
    'Full House',
    'Four of a Kind',
];

//possible outcomes
const pokerHandResults = {
    'handOneWinner': 'Hand One is the winner!',
    'handTwoWinner': 'Hand Two is the winner!',
    'noWinner': 'It\'s a tie, neither hand wins!'
}

//get the values for each card in the hand
let getHandValues = (rawHand) => {
    let handValues = [];
    for (let i = 0; i < rawHand.length; i++) {
        handValues[i] = rawHand[i] === wildCardSymbol ? wildCardSymbol : getCardNumbericalValue(rawHand[i]);
    }

    return handValues;
}

//returns the numeric value for a given card symbol
let getCardNumbericalValue = (card) => {
    return $.inArray(card, cardSymbols) + 2;
}

//determines the symbolic representation of the poker hand
let getPokerHandFromCards = (handValues) => {
    let cardFrequencies = [];
    let pokerHand = '';

    $.each(handValues, (index, value) => {
        let frequency = getCardFrequency(handValues, value);
        if (frequency > 1 && $.inArray(value, cardFrequencies) === -1) {
            pokerHand += frequency;
            cardFrequencies.push(value);
        }
    });
    return !pokerHand ? checkStraight(handValues) : pokerHand;
}

//gets the occurence of A card in the hand provided
let getCardFrequency = (handValues, currentValue) => {
    let frequency = 0;
    $.each(handValues, (index, handValue) => {
        if (currentValue === handValue && frequency < 4) {
            frequency++;
        }
    });
    
    return frequency;
}

//gets the occurences of each card in the hand provided
let getAllCardFrequencies = (handValues) => {
    let cardFrequencies = [];
    let cardsWithFrequency = [];
    $.each(handValues, (index, value) => {
        if (value !== wildCardSymbol) {
            let frequency = getCardFrequency(handValues, value);
            if ($.inArray(value, cardsWithFrequency) === -1) {
                cardsWithFrequency.push(value);
                cardFrequencies.push({
                    'value': value,
                    'frequency': frequency
                });
            }
        }
    });

    return cardFrequencies.sort((a,b) => {return b.frequency-a.frequency});
}

//Verifies whether the hand provided qualifies as a straight
let checkStraight = (handValues) => {
    let straight = '5';
    let sortedValues = handValues.sort((a,b) => {return a-b});
    $.each(sortedValues, (index, value) => {
        if (index === 0 || sortedValues[index - 1] + 1 === value) {
            return true;
        } else {
            straight = '';
            return false;
        }
    });

    return straight;
}

//Provide a numerical representation of what poker hand the cards make up (e.g. 23 === Full House)
//and return the human readable version of that hand
let getHumanReadableValue = (pokerHand) => {
    humanReadableValue = '';
    switch(pokerHand) {
        case '4':
        //Four of a Kind
            humanReadableValue = handRankings[6];
            break;
        case '23':
        case '32':
        //Full House
            humanReadableValue = handRankings[5];
            break;
        case '5':
        //Straight
            humanReadableValue = handRankings[4];
            break;
        case '3':
        //Three of a Kind
            humanReadableValue = handRankings[3];
            break;
        case '22':
        //Two Pairs
            humanReadableValue = handRankings[2];
            break;
        case '2':
        //Two of a Kind
            humanReadableValue = handRankings[1];
            break;
        default:
        //High Card
            humanReadableValue = handRankings[0];
            break;
    }

    return humanReadableValue;
}

//logic to determine which hand is the winner
let getWinner = (results) => {
    let handOne = results[0];
    let handTwo = results[1];
    let handOneRanking = $.inArray(handOne.humanReadableValue, handRankings);
    let handTwoRanking = $.inArray(handTwo.humanReadableValue, handRankings);
    let winner = compareCardValues(handOneRanking, handTwoRanking);
    if (winner === pokerHandResults.noWinner) {
        if (handOne.pokerHand === '5') {
            winner = resolveStraightTie(handOne.convertedValues, handTwo.convertedValues);
        } else {
            winner = resolveNonStraightTie(handOne.convertedValues, handTwo.convertedValues);
        }
    }
    
    return winner;
}

//determines which Straight hand has a higher value
let resolveStraightTie = (handOne, handTwo) => {
    return compareCardValues(getHighestCard(handOne), getHighestCard(handTwo));
}

//if both hands have the same poker hand (e.g. both are Three of a Kind)
//function determines which hand has a higher value
let resolveNonStraightTie = (handOne, handTwo) => {
    let winner = '';
    //sorts the arrays by frequency first, then by value
    let handOneCardFrequencies = getAllCardFrequencies(handOne).sort((a,b) => {if (a.frequency === b.frequency) {return b.value - a.value} else {return b.frequency - a.frequency}});
    let handTwoCardFrequencies = getAllCardFrequencies(handTwo).sort((a,b) => {if (a.frequency === b.frequency) {return b.value - a.value} else {return b.frequency - a.frequency}});
    $.each(handOneCardFrequencies, (index, handOneCard) => {
        let handTwoValue = handTwoCardFrequencies[index].value;
        winner = compareCardValues(handOneCard.value, handTwoValue);
        if (winner !== pokerHandResults.noWinner) {
            return false;
        }
    });

    return winner;
}

//compare two integer values to determine what hand
//has better cards, when both hands have the same poker hand (e.g. both are Three of a Kind)
let compareCardValues = (handOneCardValue, handTwoCardValue) => {
    let result = '';
    switch(true) {
        case handOneCardValue > handTwoCardValue:
            result = pokerHandResults.handOneWinner;
            break;
        case handOneCardValue < handTwoCardValue:
            result = pokerHandResults.handTwoWinner;
            break;
        case handOneCardValue === handTwoCardValue:
            result = pokerHandResults.noWinner;
            break;
    }

    return result;
}

//outputs the results to the UI
let displayResults = (winner, handOneType, handTwoType) => {
    $('.hand-one-type').text(handOneType);
    $('.hand-two-type').text(handTwoType);
    $('.result').text(winner);
}

//if the hand has a wildcard ('*'), function handles
//the logic to determine what value it should be to create
//the BEST poker hand possible
let resolveWildCard = (handValues) => {
    let newWildCardValue = resolveStraightWithWildCard(handValues);
    if ($.inArray(14, handValues) !== -1 && getCardFrequency(handValues, 14) === 1 && !newWildCardValue) {
        //check for ACE as a lower value in a Straight hand
        let tempValues = $.extend([], handValues);
        tempValues[$.inArray(14, tempValues)] = 1;
        newWildCardValue = resolveStraightWithWildCard(tempValues);
        if (newWildCardValue) {
            handValues[$.inArray(14, handValues)] = 1;
        }
    }
    if (!newWildCardValue) {
        let currentPokerHand = getAllCardFrequencies(handValues);
        if (!$.isEmptyObject(currentPokerHand)) {
            newWildCardValue = currentPokerHand[0].value;
        } else {
            newWildCardValue = getHighestCard(handValues);
        }
    }
    handValues[handValues.indexOf(wildCardSymbol)] = newWildCardValue;
    return handValues;
}

//if the hand has wildcard ('*'), function determines whether
//a Straight can created if the wildcard takes on any value
//returns either the value that created a straight, or an empty string
let resolveStraightWithWildCard = (handValues) => {
    let tempValues = $.extend([], handValues);
    let newWildCardValue = '';
    let isStraight = false;
    $.each(cardSymbols, (index) => {
        let cardValue = index + 2;
        tempValues[tempValues.indexOf(wildCardSymbol)] = cardValue;
        isStraight = checkStraight(tempValues);
        if (index !== cardSymbols.length - 1) {
            tempValues[tempValues.indexOf(cardValue)] = wildCardSymbol;
        }
        if (isStraight) {
            newWildCardValue = cardValue;
        }
    });

    return newWildCardValue
}

//returns the highest card value for a given hand
let getHighestCard = (handValues) => {
    return handValues.sort((a,b) => {return b-a})[0];
}

//event handler that gets the values from each input
//and verifies which hand is the better poker hand
$('form').on('submit', (e) => {
    e.preventDefault();
    let handResults = [];
    let hands = $('input.poker-hand');
    if (hands.length === 2) {
        $.each(hands, (index, hand) => {
            let rawHand = hand.value.toUpperCase();
            let convertedValues = getHandValues(rawHand);
            if (rawHand.includes(wildCardSymbol)) {
                convertedValues = resolveWildCard(convertedValues);
            }
            let pokerHand = getPokerHandFromCards(convertedValues);
            let humanReadableValue = getHumanReadableValue(pokerHand);
            let result = {
                'convertedValues': convertedValues,
                'pokerHand': pokerHand,
                'humanReadableValue': humanReadableValue
            };
            handResults.push(result);
        });
        let winner = getWinner(handResults);
        displayResults(winner, handResults[0].humanReadableValue, handResults[1].humanReadableValue);
    }
});