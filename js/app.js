/*
 * Pexeso game
 */

// Settings
const cardNames = ["fa-gem", "fa-paper-plane", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb", "fa-cocktail", "fa-flag-checkered", "fa-heart", "fa-snowflake", "fa-grin", "fa-umbrella-beach", "fa-dice-five", "fa-shower", "fa-tooth"] // card names to pick from, list can be as long as you wish
const deckPairCount = 8 // deckPairCount is currently expected to be <= than cardNames.length
const decreaseGameRatingEveryXUnsuccessfulMoves = 5

// State variables
var firstCard = null
var gameTimer = null
var revealedPairTimer = null
var startTime = null
var elapsedSeconds = 0
var movesCounter = 0
var matchCounter = 0

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

// Counters
function incrementMoveCount() {
	movesCounter++
	$(".moves").text(movesCounter)
	}

function resetMoveCount() {
	movesCounter = 0
	$(".moves").text(movesCounter)
	}

function incrementMatchCounter() {
	matchCounter++
	}

function resetMatchCounter() {
	matchCounter = 0
	}

// Timer
function timerReset() {
	elapsedSeconds = 0
	}

function timerStart() {
	clearInterval(gameTimer)
	gameTimer = setInterval(function(){ elapsedSeconds++; redrawTimer(); }, 1000)
	}

function timerStop() {
	clearInterval(gameTimer)
	}

function timerGetTime() {
	var m = Math.floor(elapsedSeconds / 60)
	var s = Math.floor(elapsedSeconds % 60)

	if (s < 10) s = "0" + s

	return m + ":" + s
	}

function redrawTimer() {
	if (elapsedSeconds)
		$(".timer").text(timerGetTime())

	else
		$(".timer").text("0:00")
	}

// Game rating fuctions
function getGameRating() {
	var rating = 5
	var superfluousMovesCount = movesCounter - matchCounter

	if (superfluousMovesCount > 0)
		rating -= superfluousMovesCount / decreaseGameRatingEveryXUnsuccessfulMoves

	if (rating < 1) 
		rating = 1
	
	return Math.ceil(rating)
	}

function redrawStarRating() {
	$(".stars").empty()
	
	var rating = getGameRating()
	
	for (i = 1; i <= rating; i++)
		$("<li><i class='fa fa-star'></i></li>").appendTo(".stars")
	}

// Game logic helper functions
function shuffleCards() {
	var shuffledCardNames = shuffle(cardNames)
	var usedCardNames = shuffledCardNames.slice(0, deckPairCount) // choose deckPairCount out of shuffledCardNames.length
	var deckCards = shuffle(usedCardNames.concat(usedCardNames))
	
	$(".deck").empty()
	deckCards.forEach(function(deckCard) {
		$("<li class='card'><i class='fa "+deckCard+"'></i></li>").appendTo(".deck")
		})
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

function winTheGame() {
	timerStop()
	
	if (getGameRating() < 5)
		$("#wonGameModalChallenge").show() // show "You can do better!" message in the modal

	$("#wonGameModal .btn-primary").click(initGame)

	$("#wonGameModal").modal("show")
	}


// Main game logic here
function handleCardClick(event) {
	var clickedCard = $(event.target)
	var revealedCards = $(".card.open.show")

	if (isRevealedCard(clickedCard)) {
		//console.log("Card already revealed.")
		return false
		}

	if (isMatchedCard(clickedCard)) {
		//console.log("Card already matched.")
		return false
		}

	// One card revealed: show second (clicked) card & test for match with first one
	if (revealedCards.length == 1) {
		clickedCard.addClass("open show")
		incrementMoveCount()
		
		var clickedCardSymbol = clickedCard.find("> i").attr('class')
		var firstCardSymbol = firstCard.find("> i").attr('class')

		if (clickedCardSymbol == firstCardSymbol) {
			//console.log("match!")
			firstCard.addClass("match").removeClass("open show").animateCss('flip')
			clickedCard.addClass("match").removeClass("open show").animateCss('flip')
			}
		else {
			//console.log("no match!")
			revealedPairTimer = setTimeout(function(){
				firstCard.removeClass("open show")
				clickedCard.removeClass("open show")
				}, 1000);
			}
		}

	// Two cards revealed: hide revealed cards & show clicked card & remember it
	// Works for initial (no card revealed) state too
	else /*if (revealedCards.length == 2 || revealedCards.length == 0)*/ {
		clearInterval(revealedPairTimer)
		revealedCards.removeClass("open show")
		clickedCard.addClass("open show")
		firstCard = clickedCard
		}

	if (isWinningConditionAchieved()) setTimeout(winTheGame, 200)

	redrawStarRating()
	}

// Game initiator
function initGame() {
	resetMoveCount()
	shuffleCards()
	redrawStarRating()
	timerStop()
	timerReset()
	redrawTimer()

	$(".restart").click(initGame)
	$(".deck").one("click", timerStart)
	$(".card").click(handleCardClick)
	}


initGame()

