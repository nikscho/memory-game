/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

var firstCard = null
var movesCount = 0
var cardNames = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb", "fa-leaf"]
var deckPairCount = 8

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function initGame() {
	resetMoveCount()
	shuffleCards()

	$(".restart").click(initGame)
	$(".card").click(handleHiddenCardClick)
	}

function incrementMoveCount(card) {
	movesCount++
	$(".moves").text(movesCount)
	}

function getMoveCount(card) {
	return $(".moves").text()
	}

function resetMoveCount(card) {
	movesCount = 0
	$(".moves").text(movesCount)
	}

function shuffleCards() {
	cardPairs = cardNames.slice(0, deckPairCount);
	deckCards = shuffle(cardPairs.concat(cardPairs))
	
	$(".deck").empty()
	deckCards.forEach(function(deckCard) {
		$("<li class='card'><i class='fa "+deckCard+"'></i></li>").appendTo(".deck")
		});
	}

function isMatchedCard(card) {
	return card.hasClass("match")
	}

function isRevealedCard(card) {
	return (card.hasClass("open") && card.hasClass("show"))
	}

function isWinningConditionAchieved() {
	return ($(".match").length == deckPairCount * 2)
	}

function handleHiddenCardClick(event) {
	var clickedCard = $(event.target)
	var revealedCards = $(".card.open.show")

	if (isRevealedCard(clickedCard)) {
		console.log("Card already revealed.")
		return false
		}

	if (isMatchedCard(clickedCard)) {
		console.log("Card already matched.")
		return false
		}

	// One card revealed: show clicked card & test for match with previous one
	if (revealedCards.length == 1) {
		clickedCard.addClass("open show")
		incrementMoveCount()
		
		var clickedCardSymbol = clickedCard.find("> i").attr('class')
		var firstCardSymbol = firstCard.find("> i").attr('class')

		if (clickedCardSymbol == firstCardSymbol) {
			console.log("match!")
			firstCard.addClass("match").removeClass("open show")
			clickedCard.addClass("match").removeClass("open show")
			}
		}

	// Two cards revealed: hide revealed cards & show clicked card & remember it
	// Works for no card revealed state too
	else /*if (revealedCards.length == 2 || revealedCards.length == 0)*/ {
		revealedCards.removeClass("open show")
		clickedCard.addClass("open show")
		firstCard = clickedCard
		}

	if (isWinningConditionAchieved())
		setTimeout(function(){
			alert("Congratulations! You won the game after "+getMoveCount()+" moves!")
			}, 200);
	}

initGame()


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
