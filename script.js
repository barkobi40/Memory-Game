$(document).ready(function() {
  // Game variables
  var cards = [];
  var openedCards = [];
  var matchedCards = [];
  var moves = 0;
  var numPairs = 0;
  var interval;

  // Start the game
  function startGame() {
    var playerName = $("#player-name").val();
    numPairs = parseInt($("#num-cards").val());

    if (1 > numPairs || numPairs > 30){
      alert("Please enter number of card pairs that is under 30.");
      return;
    }

    if (!playerName || !numPairs) {
      alert("Please enter your name and the number of card pairs.");
      return;
    }

    $("#start-form").hide();
    $("#game").show();
    $("#player-info").text("Player: " + playerName);

    createCards(numPairs);
    renderCards();
    startTimer();
  }

  // Create the card pairs
  function createCards(numPairs) {
    var values = [];
    for (var i = 0; i < numPairs; i++) {
      values.push(i + 1);
      values.push(i + 1);
    }

    while (values.length > 0) {
      var randomIndex = Math.floor(Math.random() * values.length);
      var value = values.splice(randomIndex, 1)[0];
      cards.push({
        value: value,
        index: cards.length,
        isMatched: false
      });
    }
  }

  // Render the cards on the game board
  function renderCards() {
    var $cardsContainer = $("#cards");
    $cardsContainer.empty();

    for (var i = 0; i < cards.length; i++) {
      var $card = $("<div>")
        .addClass("card")
        .attr("data-index", i)
        .text(cards[i].value);
      $cardsContainer.append($card);
    }
  }

  // Handle card click events
  function cardClickHandler() {
    var index = $(this).data("index");
    var card = cards[index];

    if (!card || card.isMatched || openedCards.length >= 2) {
      return;
    }

    $(this).addClass("open");
    openedCards.push(card);

    // Add the "visible" class to make the card visible
    $(this).addClass("visible");

    if (openedCards.length === 2) {
      moves++;
      updateMoves();

      if (openedCards[0].value === openedCards[1].value) {
        setTimeout(function() {
          markCardsAsMatched();
        }, 500);
      } else {
        setTimeout(function() {
          closeOpenedCards();
        }, 1000);
      }
    }
  }

  // Mark opened cards as matched
  function markCardsAsMatched() {
    openedCards.forEach(function(card) {
      card.isMatched = true;
      matchedCards.push(card);
    });

    $(".card.open").addClass("matched").removeClass("open");

    openedCards = [];

    if (matchedCards.length === numPairs * 2) {
      endGame();
    }
  }

  // Close opened cards
  function closeOpenedCards() {
    $(".card.open").removeClass("open visible");
    openedCards = [];
  }

  // Update the moves counter
  function updateMoves() {
    $("#moves").text("Moves: " + moves);
  }

  // Start the game timer
  function startTimer() {
    var startTime = new Date().getTime();
    interval = setInterval(function() {
      var currentTime = new Date().getTime();
      var elapsedTime = currentTime - startTime;
      var formattedTime = formatTime(elapsedTime);
      $("#clock").text("Time: " + formattedTime);
    }, 999);
  }

  // Format the time in mm:ss format
  function formatTime(time) {
    var minutes = Math.floor(time / 60000);
    var seconds = Math.floor((time % 60000) / 1000);
    return padZero(minutes) + ":" + padZero(seconds);
  }

  // Add leading zero if number is less than 10
  function padZero(number) {
    return number < 10 ? "0" + number : number;
  }

  // End the game
  function endGame() {
    clearInterval(interval);
    // var formattedTime = formatTime(new Date().getTime() / 1000);
    var EndTime = $("#clock").text();
    $("#game").append("<div id='result'>Game Completed in The " + EndTime + "  !" + "</div>");
    $("#play-again").show();
  }

  // Restart the game
  function restartGame() {
    cards = [];
    openedCards = [];
    matchedCards = [];
    moves = 0;
    numPairs = 0;
    clearInterval(interval);
    $("#start-form").show();
    $("#game").hide();
    $("#cards").empty();
    $("#player-name").val("");
    $("#num-cards").val("");
    $("#result").remove();
    $("#play-again").hide();
  }

  // Event delegation for card clicks
  $(document).on("click", ".card", cardClickHandler);

  // Event listener for start button click
  $("#start-btn").on("click", function() {
    startGame();
  });
  // press enter will start the game
  $("#gameInfo1, #gameInfo2").on("keypress", function(event) {
    if(event.key === "Enter") {
      startGame();
    }
  });

  // Event listener for play again button click
  $("#play-again-btn").on("click", function() {
    restartGame();
  });

});
