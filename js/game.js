
// GLOBAL Variables

//initial score values
var score = 0;
var wrongMoves = 0;

var maxLevel = 5; //5 default

var playLevel = 1;

var cardsrow = 4;

var showAlerts = true; //default

let gameImagesArray = []; //contains all images for the game

var cards = []; //holds the cards selected randomly

var cardsInPlay = []; //copy of the cards currently being played

var cardIds = []; //store ids for comparison purposes

var matched = true; //check if matched cards

var cardId = 0; //current card id to be compared

const gamePlay = function(index) {

	cardId = index;//this.getAttribute('name');

	var repeat = false;

	//check if this is a repeat card or card that's already opened
	if (cardIds.length>0) {
		var cid = index; //this.getAttribute('name');
		//cid = cid.split("_")[1];
		
		for (var dd = 0; dd < cardIds.length; dd++) {
			if ( cid===cardIds[dd] ) {
				repeat = true;
				break;
			}
		}
	}

	if (!repeat) { //does not allow to click same, like an already opened card
		repeat = false; 

		//this.setAttribute('src', gameImagesArray[index]);
		//this.setAttribute('alt', cards[cardId].altText); //add alt text
		showBoard(index);
		
		var cardFlipped = gameImagesArray[cardId];

		cardsInPlay.push(gameImagesArray[cardId]); //store card object
		cardIds.push(index); //this.getAttribute('data-id')); //store card ids to check no-repeats

		if ( cardsInPlay.length%2===0 ) { //allow cards IN PAIRS

			matched = checkForMatch();
			if (!matched) {
				//allow to replace 2nd card 
				cardsInPlay.pop();
				cardIds.pop();
				
			} else {
				//MATCHED

				if (cardsInPlay.length === ((playLevel+1)*cardsrow) ) {
					levelUp();
				}
				
				if (playLevel > maxLevel) { // END GAME
				    processEndGame();
				}
			}
		
		}
	}


};

var checkForMatch = function(){
	var cid = cardsInPlay.length - 1;
	if( cardsInPlay[cid]===cardsInPlay[cid-1]  ) {
			score++; //increase score
			//console.log("Score=" + score); //debug
			if (showAlerts) alert("You found a match!");

		} else {
			wrongMoves++; //unmatched turn
			if (showAlerts) alert("Sorry, TRY Again. TIP: Remember the cards' position.");
			return false;
		}

	return true;
};