'use strict';

(function () {
  const PLAYERS = window.data.players;
  const TABLE_CARDS = [];

  const START_RATE = 5;

  let rate = 5;
  let steck = START_RATE;
  let indexDiller = 0;
  let indexOfFirstPlayer = 1;

  const testButton = document.querySelector('button[name=test]');
  const callButton = document.querySelector('button[name=call]');
  const raiseButton = document.querySelector('button[name=raise]');
  const foldButton = document.querySelector('button[name=fold]');

  const playersList = document.querySelectorAll('.player');
  const tableField = document.querySelector('.table__field');
  const tableInput = document.querySelector('input[name=table-rate]');
  const playerControll = document.querySelector('.room__player-controll');
  const tableCards = document.querySelectorAll('.deck__card');
  const eventList = document.querySelector('.event__list');

  const DECK = window.dataCards.deck;
  let newDeck = [];

  const shaffleDeck = function () {
    newDeck.splice(0, newDeck.length);
    for (let i = 0; i < DECK.length; i++) {
      while (newDeck.length < DECK.length) {
        const newCard = DECK[window.utils.random(0, DECK.length)];
        if (!newDeck.includes(newCard)) {
          newDeck.push(newCard);
        }
      }
    } return newDeck;
  }

  const clearClasses = function (playersList) {
    playersList.forEach(element => {
      element.querySelector('.player__container').classList.remove('player__container--active')
    });
  };

  const setActiveClass = function (index) {
    clearClasses(playersList)
    playersList[index].querySelector('.player__container').classList.add('player__container--active');
  }

  const clearActiveStatus = function () {
    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].isActive = false;
    }
    clearClasses(playersList);
  }

  const changeIndex = function (index = 0) {

    let player = PLAYERS[index];
    player.isActive = true;
    setActiveClass(index);

    return function (newIndex = index) {
      index = newIndex;
      player.isActive = false;

      if (index < PLAYERS.length - 1) {
        index++;
      } else {
        index = 0;
      }
      clearActiveStatus();
      player = PLAYERS[index];
      player.isActive = true;
      setActiveClass(index);
    }
  }

  const changePlayer = changeIndex();

  const clearDillers = function () {
    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].isDiller = false;
    }
    playersList.forEach(element => {
      element.querySelector('.player__diller').classList.add('visually-hidden');
    });
  };

  const clearPlayers = function () {
    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].isActive = false;
    };
    clearClasses(playersList);
  };

  const setDiller = function () {

    return function (index = indexDiller) {
      clearDillers();
      clearPlayers();
      let player = PLAYERS[index];
      player.isDiller = true
      player.isActive = true;
      setActiveClass(index);
      playersList[index].querySelector('.player__diller').classList.remove('visually-hidden');
      player.rate = START_RATE;
      player.cash -= START_RATE;

      window.render.renderPlayers(PLAYERS);
    }
  };

  const changeDiller = setDiller();

  const setRate = function () {
    for (let i = 0; i < PLAYERS.length; i++) {
      let diff = rate - PLAYERS[i].rate;
      if (PLAYERS[i].isActive && PLAYERS[i].rate < rate) {
        PLAYERS[i].cash -= diff;
        PLAYERS[i].rate = diff;
        playersList[i].querySelector('.player__cash').value = PLAYERS[i].cash;
        playersList[i].querySelector('.player__rate').value = PLAYERS[i].rate;
        steck = Number(steck) + Number(PLAYERS[i].rate);
        PLAYERS[i].rate = rate;
      }
      else if (PLAYERS[i].isActive && PLAYERS[i].rate === rate && !PLAYERS[i].isBot) {
        steck = Number(steck);
      }
    }

    window.render.renderTable(rate, steck);
    window.render.renderPlayers(PLAYERS);
  }

  const checkStepStatus = function () {
    let callArray = []
    for (let i = 0; i < PLAYERS.length; i++) {

      if (PLAYERS[i].rate === rate) {
        callArray.push(PLAYERS[i]);
      } else if (PLAYERS[i].rate < rate) {
        callArray.splice(0, callArray.length);
      }

      if (callArray.length === PLAYERS.length && tableField.textContent === 'preflop') {
        callArray.splice(0, callArray.length);
        console.log('floop!');
        for (let i = 0; i < PLAYERS.length; i++) {
          PLAYERS[i].rate = 0;
        }
        rate = START_RATE * 2;

        flop();
      }

      if (callArray.length == PLAYERS.length && tableField.textContent == 'flop') {
        callArray.splice(0, callArray.length);
        console.log('tern!');
        for (let i = 0; i < PLAYERS.length; i++) {
          PLAYERS[i].rate = 0;
        }
        rate = START_RATE * 2;

        tern();
      }

      if (callArray.length == PLAYERS.length && tableField.textContent == 'tern') {
        callArray.splice(0, callArray.length);
        console.log('river!');
        for (let i = 0; i < PLAYERS.length; i++) {
          PLAYERS[i].rate = 0;
        }
        rate = START_RATE * 2;

        river();
      }

      if (callArray.length == PLAYERS.length && tableField.textContent == 'river') {
        callArray.splice(0, callArray.length);
        console.log('restart!');
        for (let i = 0; i < PLAYERS.length; i++) {
          PLAYERS[i].rate = 0;

          const playerHand = playersList[i].querySelectorAll('.card');
          playerHand[0].classList.remove('card--close');
          playerHand[1].classList.remove('card--close');
        }

        checkForWinners(PLAYERS, steck = steck);

        playerControll.classList.add('visually-hidden');

        setTimeout(restart, 5000);

      }
    }
  }

  const checkForWinners = function (players, steck) {

    players = PLAYERS;
    let winners = [];

    players.forEach(player => {
      if (player.royalflush.length > 0) {
        player.power = player.power + 10000;
        winners.push(player);
      } else if (player.streetflush.length > 0) {
        player.power = player.power + 9000 + player.streetflush[0].rank;
        winners.push(player);
      } else if (player.kare.length > 0) {
        player.power = player.power + 8000 + player.kare[0].rank + player.kikker[0].rank;
        winners.push(player);
      } else if (player.fullhouse.length > 0) {
        player.power = player.power + 7000 + player.fullhouse[0].rank + player.fullhouse[3].rank + player.fullhouse[0].rank;
        winners.push(player);
      } else if (player.flush.length > 0) {
        player.power = player.power + 6000 + player.flush[0].rank;
        console.log(player.flush);
        winners.push(player);
      } else if (player.street.length > 0 && player.flush.length === 0) {
        player.power = player.power + 5000 + player.street[0].rank;
        winners.push(player);
      } else if (player.set.length > 0 && player.flush.length === 0) {
        player.power = player.power + 4000 + player.set[0].rank + player.kikker[0].rank;
        winners.push(player);
      } else if (player.couple.length > 2 && player.flush.length === 0) {
        player.power = player.power + Number((player.couple[0].rank * 2) * 10) + Number((player.couple[2].rank * 2) * 10) + player.couple[2].rank + 3000 + player.kikker[0].rank;
        winners.push(player);
      } else if (player.couple.length === 2 && player.flush.length === 0) {
        player.power = player.power + Number((player.couple[0].rank * 2) * 10) + 2000 + player.kikker[0].rank;
        winners.push(player);
      } else if (player.hightCard.length > 0 && player.flush.length === 0) {
        // player.power = player.power + player.hightCard[0].rank;
        console.log('WRNING' + player);
        winners.push(player);
      }
    })

    winners.sort(function (player1, player2) {
      return player2.power - player1.power;
    });

    console.log(winners);

    if (winners.length > 0) {

      if (winners[0].power > 0 && winners[0].power < 100) {
        console.log('победил: ' + winners[0].name + ', собрав старшую карту: ' + winners[0].hightCard[0].name);
        eventList.querySelector('.event__text').textContent = 'победил: ' + winners[0].name + ', собрав старшую карту: ' + winners[0].hightCard[0].name;

        playersList[PLAYERS.indexOf(winners[0])].style = 'border: 5px solid orange';
        winners[0].cash = winners[0].cash + Number(steck);

      } else if (winners[0].power > 100 && winners[0].power < 3000) {
        console.log('победил: ' + winners[0].name + ', собрав пару, ' + 'из ' + winners[0].couple[0].name + ', киккер: ' + winners[0].kikker[0].name);
        eventList.querySelector('.event__text').textContent = 'победил: ' + winners[0].name + ', собрав пару, ' + ' из ' + winners[0].couple[0].name + ', киккер: ' + winners[0].kikker[0].name;

        playersList[PLAYERS.indexOf(winners[0])].style = 'border: 5px solid orange';
        winners[0].cash = winners[0].cash + Number(steck);

      } else if (winners[0].power > 3000 && winners[0].power < 4000) {
        console.log('победил: ' + winners[0].name + ', собрав две пары, ' + 'из ' + winners[0].couple[0].name + ' и ' + winners[0].couple[2].name + ', киккер: ' + winners[0].kikker[0].name);
        eventList.querySelector('.event__text').textContent = 'победил: ' + winners[0].name + ', собрав две пары, ' + ' из ' + winners[0].couple[0].name + ' и ' + winners[0].couple[2].name + ', киккер: ' + winners[0].kikker[0].name;

        playersList[PLAYERS.indexOf(winners[0])].style = 'border: 5px solid orange';
        winners[0].cash = winners[0].cash + Number(steck);

      } else if (winners[0].power > 4000 && winners[0].power < 5000) {
        console.log('победил: ' + winners[0].name + ', собрав сет ' + 'из ' + winners[0].set[0].name + ', киккер: ' + winners[0].kikker[0].name);
        eventList.querySelector('.event__text').textContent = 'победил: ' + winners[0].name + ', собрав сет, ' + 'из ' + winners[0].set[0].name + ', киккер: ' + winners[0].kikker[0].name;

        playersList[PLAYERS.indexOf(winners[0])].style = 'border: 5px solid orange';
        winners[0].cash = winners[0].cash + Number(steck);

      } else if (winners[0].power > 5000 && winners[0].power < 6000) {
        console.log('победил: ' + winners[0].name + ', собрав стрит, ' + 'от: ' + winners[0].street[0].name);
        eventList.querySelector('.event__text').textContent = 'победил: ' + winners[0].name + ', собрав стрит, ' + 'от: ' + winners[0].street[0].name;

        playersList[PLAYERS.indexOf(winners[0])].style = 'border: 5px solid orange';
        winners[0].cash = winners[0].cash + Number(steck);

      } else if (winners[0].power > 6000 && winners[0].power < 7000) {
        console.log('победил: ' + winners[0].name + ', собрав флеш, ' + 'от: ' + winners[0].flush[0].name);
        eventList.querySelector('.event__text').textContent = 'победил: ' + winners[0].name + ', собрав флеш, ' + 'от: ' + winners[0].flush[0].name;

        playersList[PLAYERS.indexOf(winners[0])].style = 'border: 5px solid orange';
        winners[0].cash = winners[0].cash + Number(steck);

      } else if (winners[0].power > 7000 && winners[0].power < 8000) {
        console.log('победил: ' + winners[0].name + ', собрав фуллхаус, ' + 'из: ' + winners[0].fullhouse[0].name + ' и ' + winners[0].fullhouse[3].name);
        eventList.querySelector('.event__text').textContent = 'победил: ' + winners[0].name + ', собрав фуллхаус, ' + 'из: ' + winners[0].fullhouse[0].name + ' и ' + winners[0].fullhouse[3].name;

        playersList[PLAYERS.indexOf(winners[0])].style = 'border: 5px solid orange';
        winners[0].cash = winners[0].cash + Number(steck);

      } else if (winners[0].power > 8000 && winners[0].power < 9000) {
        console.log('победил: ' + winners[0].name + ', собрав каре, ' + 'из: ' + winners[0].kare[0].name + ', киккер: ' + winners[0].kikker[0].name);
        eventList.querySelector('.event__text').textContent = 'победил: ' + winners[0].name + ', собрав каре, ' + 'из: ' + winners[0].kare[0].name + ', киккер: ' + winners[0].kikker[0].name;

        playersList[PLAYERS.indexOf(winners[0])].style = 'border: 5px solid orange';
        winners[0].cash = winners[0].cash + Number(steck);

      } else if (winners[0].power > 9000 && winners[0].power < 10000) {
        console.log('победил: ' + winners[0].name + ', собрав стритфлеш, ' + 'от: ' + winners[0].streetflush[0].name);
        eventList.querySelector('.event__text').textContent = console.log('победил: ' + winners[0].name + ', собрав стритфлеш, ' + 'от: ' + winners[0].streetflush[0].name);

        playersList[PLAYERS.indexOf(winners[0])].style = 'border: 5px solid orange';
        winners[0].cash = winners[0].cash + Number(steck);

      } else if (winners[0].power >= 10000) {
        console.log('победил: ' + winners[0].name + ', собрав ROYAL FLUSH!!!');
        eventList.querySelector('.event__text').textContent = 'победил: ' + winners[0].name + ', собрав ROYAL FLUSH!!!'

        playersList[PLAYERS.indexOf(winners[0])].style = 'border: 5px solid orange';
        winners[0].cash = winners[0].cash + Number(steck);
      }
    }
  }

  //=================
  //boti

  const changeIndexBot = function (index = 0) {

    let player = PLAYERS[index];
    player.isActive = true;
    setActiveClass(index);

    return function (newIndex = index) {
      index = newIndex;
      player.isActive = false;

      if (index < PLAYERS.length - 1) {
        index++;
      } else {
        index = 0;
      }
      clearActiveStatus();
      player = PLAYERS[index];
      player.isActive = true;
      setActiveClass(index);
      isBot(player)
    }
  }

  const changePlayerBot = changeIndexBot();

  const isBot = function (player) {

    if (player.isBot === true) {
      setTimeout(setRate, 100)
      setTimeout(changePlayerBot, 100)
      setTimeout(checkStepStatus, 100)
      playerControll.classList.add('visually-hidden');
    } else if (player.isBot === false) {
      playerControll.classList.remove('visually-hidden');
    }
  }







  //==================


  const preFlop = function (index = indexDiller) {

    eventList.querySelector('.event__text').textContent = '';

    for (let i = 0; i < PLAYERS.length; i++) {
      playersList[i].style = '';
    }

    shaffleDeck();
    window.render.renderCards(newDeck, TABLE_CARDS);

    rate = START_RATE;
    changeDiller(indexDiller);
    setRate();

    rate = rate * 2;
    changePlayer(index);
    setRate();
    changePlayerBot(indexDiller);

    // for (let i = 0; i < PLAYERS.length; i++) {
    //   checkCombination(PLAYERS[i]);
    // };

    window.render.renderTable(rate, steck);
    window.render.renderPlayers(PLAYERS);

  }

  const flop = function () {
    tableField.textContent = 'flop';

    tableCards[0].style = 'display: flex';
    tableCards[1].style = 'display: flex';
    tableCards[2].style = 'display: flex';

    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].combination.push(TABLE_CARDS[0]);
      PLAYERS[i].combination.push(TABLE_CARDS[1]);
      PLAYERS[i].combination.push(TABLE_CARDS[2]);
    }

    checkCombination(PLAYERS[0]);
    changePlayer(indexDiller);

    window.render.renderTable(rate, steck);
    window.render.renderPlayers(PLAYERS);

    // for (let i = 0; i < PLAYERS.length; i++) {
    //   checkCombination(PLAYERS[i]);
    // };

    changePlayerBot(indexDiller);

  }

  const tern = function () {
    tableField.textContent = 'tern';

    tableCards[3].style = 'display: flex';

    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].combination.push(TABLE_CARDS[3]);
    };

    // for (let i = 0; i < PLAYERS.length; i++) {
    //   checkCombination(PLAYERS[i]);
    // };

    changePlayer(indexDiller);

    window.render.renderPlayers(PLAYERS);
    window.render.renderTable(rate, steck);

    changePlayerBot(indexDiller);

  }

  const river = function () {
    tableField.textContent = 'river';

    tableCards[4].style = 'display: flex';

    for (let i = 0; i < PLAYERS.length; i++) {
      PLAYERS[i].combination.push(TABLE_CARDS[4]);
    };

    for (let i = 0; i < PLAYERS.length; i++) {
      checkCombination(PLAYERS[i]);
    };

    changePlayer(indexDiller);

    window.render.renderPlayers(PLAYERS);
    window.render.renderTable(rate, steck);

    changePlayerBot(indexDiller);

    // checkForWinners(PLAYERS);

  };

  const restart = function () {

    for (let i = 0; i < PLAYERS.length; i++) {
      // PLAYERS[i].cash = 5000;
      PLAYERS[i].rate = 0;
      PLAYERS[i].isActive = false;
      PLAYERS[i].isDiller = false;
      PLAYERS[i].combination = [];
      PLAYERS[i].hand = [];
      PLAYERS[i].combination = [];
      PLAYERS[i].hightCard = [];
      PLAYERS[i].kikker = [];
      PLAYERS[i].couple = [];
      PLAYERS[i].set = [];
      PLAYERS[i].street = [];
      PLAYERS[i].flush = [];
      PLAYERS[i].fullhouse = [];
      PLAYERS[i].kare = [];
      PLAYERS[i].streetflush = [];
      PLAYERS[i].royalflush = [];
      PLAYERS[i].power = 0;
    }

    steck = START_RATE;
    tableField.textContent = 'preflop';

    if (indexDiller < PLAYERS.length - 1) {
      indexDiller++;
    } else {
      indexDiller = 0;
    }

    for (let i = 0; i < PLAYERS.length; i++) {
      checkCombination(PLAYERS[i]);
    };

    preFlop(indexDiller);
    window.render.renderPlayers(PLAYERS);
    window.render.renderTable(rate, steck);
  };

  //==========

  //проверка комбинаций

  const checkForSameRank = function (couplesArray, count, player = player) {

    switch (couplesArray.length) {
      case count:
        if (count === 0) {
          player.hightCard.push(couplesArray[0]);

          player.hightCard = player.couple.sort(function (card1, card2) {
            return card2.rank - card1.rank;
          });
        }

        //пары
        if (count === 2 && player.couple.length == 0) {
          player.couple = couplesArray.concat(player.couple);

          // console.log('пара: ' + player.couple[0].name);
          // console.log(player.couple);

        } else if (count === 2 && player.couple.length == 2 && player.couple[0].rank !== couplesArray[0].rank) {
          player.couple = couplesArray.concat(player.couple);

          player.couple = player.couple.sort(function (card1, card2) {
            return card2.rank - card1.rank;
          });

          // console.log('две пары :' + player.couple[0].name + ' и ' + player.couple[2].name);
          // console.log(player.couple);

        } else if (count === 2 && player.couple.length == 4 && player.couple[0].rank !== couplesArray[0].rank && count === 2 && player.couple.length == 4 && player.couple[2].rank !== couplesArray[0].rank) {
          player.couple = couplesArray.concat(player.couple);
          player.couple = player.couple.sort(function (card1, card2) {
            return card2.rank - card1.rank;
          });
          player.couple.splice(4, 2);

          // console.log('две пары :' + player.couple[0].name + ' и ' + player.couple[2].name);
          // console.log(player.couple);
        }

        //сеты
        if (count === 3 && player.set.length == 0) {
          player.set = couplesArray.concat(player.set);

          if (player.couple.length === 2 && player.set[0] === player.couple[0]) {
            player.couple.splice(0, player.couple.length);
          } else if (player.couple.length === 4 && player.set[0] === player.couple[0]) {
            player.couple.splice(0, 2);
          } else if (player.couple.length === 4 && player.set[0] === player.couple[2]) {
            player.couple.splice(2, 2);
          }

          // console.log('сет: ' + player.set[0].name);
          // console.log(player.set);

        } else if (count === 3 && player.set.length == 3 && player.set[0].rank < couplesArray[0].rank) {
          player.couple.push(player.set[0]);
          player.couple.push(player.set[1]);
          player.set = couplesArray;

          player.couple.sort(function (card1, card2) {
            return card2.rank - card1.rank;
          });

          // console.log('сет: ' + player.set[0].name);
          // console.log(player.set);
        };

        //каре
        if (count > 3) {
          player.kare = couplesArray.concat(player.kare);
          // console.log('каре из: ' + player.kare[0].name);
          // console.log(player.kare);
        }

        //фуллхаусы
        if (player.set.length > 0 && player.couple.length > 0) {
          player.fullhouse.push(player.set[0]);
          player.fullhouse.push(player.set[1]);
          player.fullhouse.push(player.set[2]);
          player.fullhouse.push(player.couple[0]);
          player.fullhouse.push(player.couple[1]);
          console.log('фуллхаус из :' + player.fullhouse[0].name + ' и ' + player.fullhouse[3].name);
          console.log(player.fullhouse);
        }
        // console.log(player);
        break;
    }


  };

  const checkForCouples = function (megaArray, player = player) {
    checkForSameRank(megaArray[0], 2, player);
    checkForSameRank(megaArray[1], 2, player);
    checkForSameRank(megaArray[2], 2, player);
    checkForSameRank(megaArray[3], 2, player);
    checkForSameRank(megaArray[4], 2, player);
    checkForSameRank(megaArray[5], 2, player);
    checkForSameRank(megaArray[6], 2, player);
    checkForSameRank(megaArray[7], 2, player);
    checkForSameRank(megaArray[8], 2, player);
    checkForSameRank(megaArray[9], 2, player);
    checkForSameRank(megaArray[10], 2, player);
    checkForSameRank(megaArray[11], 2, player);
    checkForSameRank(megaArray[12], 2, player);

    //старшая карта
    if (player.royalflush.length < 1 && player.streetflush.length < 1 && player.kare.length < 1 && player.fullhouse.length < 1 && player.flush.length < 1 && player.street.length < 1 && player.set.length < 1 && player.couple.length < 1) {
      player.combination.sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });
      player.hightCard.push(player.combination[0]);
      player.hightCard.sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });
      // console.log('старшая карта ' + player.hightCard[0].name);
    }

    //киккеры
    if (player.royalflush.length < 1 && player.streetflush.length < 1 && player.kare.length < 1 && player.fullhouse.length < 1 && player.flush.length < 1 && player.street.length < 1 && player.set.length > 1 && player.couple.length < 1) {

      let kikkers = [];

      player.combination.sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });

      // console.log(player.combination);

      for (let i = 0; i < player.combination.length; i++) {
        let card = player.combination[i];
        if (card.rank !== player.set[0].rank) {
          kikkers.push(card);
        }
      }

      kikkers.sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });

      player.kikker[0] = kikkers[0];
      // console.log('kikker :' + player.kikker[0].name);
    }

    if (player.royalflush.length < 1 && player.streetflush.length < 1 && player.kare.length < 1 && player.fullhouse.length < 1 && player.flush.length < 1 && player.street.length < 1 && player.set.length < 1 && player.couple.length === 4) {

      let kikkers = [];

      player.combination.sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });

      // console.log(player.combination);

      for (let i = 0; i < player.combination.length; i++) {
        let card = player.combination[i];
        if (card.rank !== player.couple[0].rank && card.rank !== player.couple[2].rank) {
          kikkers.push(card);
        }
      }

      kikkers.sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });

      player.kikker[0] = kikkers[0];
      console.log('kikker :' + player.kikker[0].name);

    } else if (player.royalflush.length < 1 && player.streetflush.length < 1 && player.kare.length < 1 && player.fullhouse.length < 1 && player.flush.length < 1 && player.street.length < 1 && player.set.length < 1 && player.couple.length === 2) {

      let kikkers = [];

      player.combination.sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });

      // console.log(player.combination);

      for (let i = 0; i < player.combination.length; i++) {
        let card = player.combination[i];
        if (card.rank !== player.couple[0].rank) {
          kikkers.push(card);
        }
      }

      kikkers.sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });

      player.kikker[0] = kikkers[0];
      if (player.kikker[0] !== undefined) {
        // console.log('kikker :' + player.kikker[0].name);
      }
    }
  }

  const checkForSet = function (megaArray, player = player) {
    checkForSameRank(megaArray[0], 3, player);
    checkForSameRank(megaArray[1], 3, player);
    checkForSameRank(megaArray[2], 3, player);
    checkForSameRank(megaArray[3], 3, player);
    checkForSameRank(megaArray[4], 3, player);
    checkForSameRank(megaArray[5], 3, player);
    checkForSameRank(megaArray[6], 3, player);
    checkForSameRank(megaArray[7], 3, player);
    checkForSameRank(megaArray[8], 3, player);
    checkForSameRank(megaArray[9], 3, player);
    checkForSameRank(megaArray[10], 3, player);
    checkForSameRank(megaArray[11], 3, player);
    checkForSameRank(megaArray[12], 3, player);
    checkForCouples(megaArray, player = player);
  }

  const checkForStreet = function (megaArray, player = player) {

    // стритфлеши и стриты
    if (megaArray[12].length >= 1 && megaArray[11].length >= 1 && megaArray[10].length >= 1 && megaArray[9].length >= 1 && megaArray[8].length >= 1) {

      let streetFromAce = [];

      streetFromAce.push(megaArray[12][0]);
      streetFromAce.push(megaArray[11][0]);
      streetFromAce.push(megaArray[10][0]);
      streetFromAce.push(megaArray[9][0]);
      streetFromAce.push(megaArray[8][0]);

      console.log(streetFromAce);

      for (let i = 0; i < streetFromAce.length; i++) {
        let card = streetFromAce[i];

        let streetFlushD = [];
        let streetFlushC = [];
        let streetFlushH = [];
        let streetFlushS = [];

        if (card.suit === 'diamonds') {
          streetFlushD.push(card);
        } else if (card.suit === 'clubs') {
          streetFlushC.push(card);
        } else if (card.suit === 'hearts') {
          streetFlushH.push(card);
        } else if (card.suit === 'spides') {
          streetFlushS.push(card);
        };

        if (streetFlushD.length === streetFromAce.length) {
          player.royalflush = streetFromAce;
          console.log('Бубновый Роял Флеш от туза');
        } else if (streetFlushC.length === streetFromAce.length) {
          player.royalflush = streetFromAce;
          console.log('Трефовый Роял Флеш от туза');
        } else if (streetFlushH.length === streetFromAce.length) {
          player.royalflush = streetFromAce;
          console.log('Червонный Роял Флеш от туза');
        } else if (streetFlushS.length === streetFromAce.length) {
          player.royalflush = streetFromAce;
          console.log('Пиковый Роял Флеш от туза');
        } else {
          player.street = streetFromAce;
          console.log(player);
          console.log('стрит от туза');
        }

        console.log(streetFromAce);

      }

    } else if (megaArray[11].length >= 1 && megaArray[10].length >= 1 && megaArray[9].length >= 1 && megaArray[8].length >= 1 && megaArray[7].length >= 1) {
      console.log(player);

      let streetFromKing = [];

      streetFromKing.push(megaArray[11][0]);
      streetFromKing.push(megaArray[10][0]);
      streetFromKing.push(megaArray[9][0]);
      streetFromKing.push(megaArray[8][0]);
      streetFromKing.push(megaArray[7][0]);

      console.log(streetFromKing);

      for (let i = 0; i < streetFromKing.length; i++) {
        let card = streetFromKing[i];

        let streetFlushD = [];
        let streetFlushC = [];
        let streetFlushH = [];
        let streetFlushS = [];

        if (card.suit === 'diamonds') {
          streetFlushD.push(card);
        } else if (card.suit === 'clubs') {
          streetFlushC.push(card);
        } else if (card.suit === 'hearts') {
          streetFlushH.push(card);
        } else if (card.suit === 'spides') {
          streetFlushS.push(card);
        };

        if (streetFlushD.length === streetFromKing.length) {
          player.streetflush = streetFromKing;
          console.log('Бубновый стрит Флеш от короля');
        } else if (streetFlushC.length === streetFromKing.length) {
          player.streetflush = streetFromKing;
          console.log('Трефовый стрит Флеш от короля');
        } else if (streetFlushH.length === streetFromKing.length) {
          player.streetflush = streetFromKing;
          console.log('Червонный стрит Флеш от короля');
        } else if (streetFlushS.length === streetFromKing.length) {
          player.streetflush = streetFromKing;
          console.log('Пиковый стрит Флеш от короля');
        } else {
          player.street = streetFromKing;
          console.log(player);
          console.log('стрит от короля');
        }
        console.log(streetFromKing);
      }

    } else if (megaArray[10].length >= 1 && megaArray[9].length >= 1 && megaArray[8].length >= 1 && megaArray[7].length >= 1 && megaArray[6].length >= 1) {
      console.log(player);

      let streetFromQueen = [];

      streetFromQueen.push(megaArray[10][0]);
      streetFromQueen.push(megaArray[9][0]);
      streetFromQueen.push(megaArray[8][0]);
      streetFromQueen.push(megaArray[7][0]);
      streetFromQueen.push(megaArray[6][0]);

      console.log(streetFromQueen);

      for (let i = 0; i < streetFromQueen.length; i++) {
        let card = streetFromQueen[i];

        let streetFlushD = [];
        let streetFlushC = [];
        let streetFlushH = [];
        let streetFlushS = [];

        if (card.suit === 'diamonds') {
          streetFlushD.push(card);
        } else if (card.suit === 'clubs') {
          streetFlushC.push(card);
        } else if (card.suit === 'hearts') {
          streetFlushH.push(card);
        } else if (card.suit === 'spides') {
          streetFlushS.push(card);
        };

        if (streetFlushD.length === streetFromQueen.length) {
          player.streetflush = streetFromQueen;
          console.log('Бубновый стрит Флеш от дамы');
        } else if (streetFlushC.length === streetFromQueen.length) {
          player.streetflush = streetFromQueen;
          console.log('Трефовый стрит Флеш от дамы');
        } else if (streetFlushH.length === streetFromQueen.length) {
          player.streetflush = streetFromQueen;
          console.log('Червонный стрит Флеш от дамы');
        } else if (streetFlushS.length === streetFromQueen.length) {
          player.streetflush = streetFromQueen;
          console.log('Пиковый стрит Флеш от дамы');
        } else {
          player.street = streetFromQueen;
          console.log(player);
          console.log('стрит от дамы');
        }
        console.log(streetFromQueen);
      }

    } else if (megaArray[9].length >= 1 && megaArray[8].length >= 1 && megaArray[7].length >= 1 && megaArray[6].length >= 1 && megaArray[5].length >= 1) {
      console.log(player);

      let streetFromJack = [];

      streetFromJack.push(megaArray[9][0]);
      streetFromJack.push(megaArray[8][0]);
      streetFromJack.push(megaArray[7][0]);
      streetFromJack.push(megaArray[6][0]);
      streetFromJack.push(megaArray[5][0]);

      console.log(streetFromJack);

      for (let i = 0; i < streetFromJack.length; i++) {
        let card = streetFromJack[i];

        let streetFlushD = [];
        let streetFlushC = [];
        let streetFlushH = [];
        let streetFlushS = [];

        if (card.suit === 'diamonds') {
          streetFlushD.push(card);
        } else if (card.suit === 'clubs') {
          streetFlushC.push(card);
        } else if (card.suit === 'hearts') {
          streetFlushH.push(card);
        } else if (card.suit === 'spides') {
          streetFlushS.push(card);
        };

        if (streetFlushD.length === streetFromJack.length) {
          player.streetflush = streetFromJack;
          console.log('Бубновый стрит Флеш от валета');
        } else if (streetFlushC.length === streetFromJack.length) {
          player.streetflush = streetFromJack;
          console.log('Трефовый стрит Флеш от валета');
        } else if (streetFlushH.length === streetFromJack.length) {
          player.streetflush = streetFromJack;
          console.log('Червонный стрит Флеш от валета');
        } else if (streetFlushS.length === streetFromJack.length) {
          player.streetflush = streetFromJack;
          console.log('Пиковый стрит Флеш от валета');
        } else {
          player.street = streetFromJack;
          console.log(player);
          console.log('стрит от валета');
        }
        console.log(streetFromJack);
      }

    } else if (megaArray[8].length >= 1 && megaArray[7].length >= 1 && megaArray[6].length >= 1 && megaArray[5].length >= 1 && megaArray[4].length >= 1) {
      console.log(player);

      let streetFromTen = [];

      streetFromTen.push(megaArray[8][0]);
      streetFromTen.push(megaArray[7][0]);
      streetFromTen.push(megaArray[6][0]);
      streetFromTen.push(megaArray[5][0]);
      streetFromTen.push(megaArray[4][0]);

      console.log(streetFromTen);

      for (let i = 0; i < streetFromTen.length; i++) {
        let card = streetFromTen[i];

        let streetFlushD = [];
        let streetFlushC = [];
        let streetFlushH = [];
        let streetFlushS = [];

        if (card.suit === 'diamonds') {
          streetFlushD.push(card);
        } else if (card.suit === 'clubs') {
          streetFlushC.push(card);
        } else if (card.suit === 'hearts') {
          streetFlushH.push(card);
        } else if (card.suit === 'spides') {
          streetFlushS.push(card);
        };

        if (streetFlushD.length === streetFromTen.length) {
          player.streetflush = streetFromTen;
          console.log('Бубновый стрит Флеш от десятки');
        } else if (streetFlushC.length === streetFromTen.length) {
          player.streetflush = streetFromTen;
          console.log('Трефовый стрит Флеш от десятки');
        } else if (streetFlushH.length === streetFromTen.length) {
          player.streetflush = streetFromTen;
          console.log('Червонный стрит Флеш от десятки');
        } else if (streetFlushS.length === streetFromTen.length) {
          player.streetflush = streetFromTen;
          console.log('Пиковый стрит Флеш от десятки');
        } else {
          player.street = streetFromTen;
          console.log(player);
          console.log('стрит от десятки');
        }
        console.log(streetFromTen);
      }

    } else if (megaArray[7].length >= 1 && megaArray[6].length >= 1 && megaArray[5].length >= 1 && megaArray[4].length >= 1 && megaArray[3].length >= 1) {
      console.log(player);

      let streetFromNine = [];

      streetFromNine.push(megaArray[7][0]);
      streetFromNine.push(megaArray[6][0]);
      streetFromNine.push(megaArray[5][0]);
      streetFromNine.push(megaArray[4][0]);
      streetFromNine.push(megaArray[3][0]);

      console.log(streetFromNine);

      for (let i = 0; i < streetFromNine.length; i++) {
        let card = streetFromNine[i];

        let streetFlushD = [];
        let streetFlushC = [];
        let streetFlushH = [];
        let streetFlushS = [];

        if (card.suit === 'diamonds') {
          streetFlushD.push(card);
        } else if (card.suit === 'clubs') {
          streetFlushC.push(card);
        } else if (card.suit === 'hearts') {
          streetFlushH.push(card);
        } else if (card.suit === 'spides') {
          streetFlushS.push(card);
        };

        if (streetFlushD.length === streetFromNine.length) {
          player.streetflush = streetFromNine;
          console.log('Бубновый стрит Флеш от девятки');
        } else if (streetFlushC.length === streetFromNine.length) {
          player.streetflush = streetFromNine;
          console.log('Трефовый стрит Флеш от девятки');
        } else if (streetFlushH.length === streetFromNine.length) {
          player.streetflush = streetFromNine;
          console.log('Червонный стрит Флеш от девятки');
        } else if (streetFlushS.length === streetFromNine.length) {
          player.streetflush = streetFromNine;
          console.log('Пиковый стрит Флеш от девятки');
        } else {
          player.street = streetFromNine;
          console.log(player);
          console.log('стрит от девятки');
        }
        console.log(streetFromNine);
      }

    } else if (megaArray[6].length >= 1 && megaArray[5].length >= 1 && megaArray[4].length >= 1 && megaArray[3].length >= 1 && megaArray[2].length >= 1) {
      console.log(player);

      let streetFromEight = [];

      streetFromEight.push(megaArray[6][0]);
      streetFromEight.push(megaArray[5][0]);
      streetFromEight.push(megaArray[4][0]);
      streetFromEight.push(megaArray[3][0]);
      streetFromEight.push(megaArray[2][0]);

      console.log(streetFromEight);

      for (let i = 0; i < streetFromEight.length; i++) {
        let card = streetFromEight[i];

        let streetFlushD = [];
        let streetFlushC = [];
        let streetFlushH = [];
        let streetFlushS = [];

        if (card.suit === 'diamonds') {
          streetFlushD.push(card);
        } else if (card.suit === 'clubs') {
          streetFlushC.push(card);
        } else if (card.suit === 'hearts') {
          streetFlushH.push(card);
        } else if (card.suit === 'spides') {
          streetFlushS.push(card);
        };

        if (streetFlushD.length === streetFromEight.length) {
          player.streetflush = streetFromEight;
          console.log('Бубновый стрит Флеш от восьмерки');
        } else if (streetFlushC.length === streetFromEight.length) {
          player.streetflush = streetFromEight;
          console.log('Трефовый стрит Флеш от восьмерки');
        } else if (streetFlushH.length === streetFromEight.length) {
          player.streetflush = streetFromEight;
          console.log('Червонный стрит Флеш от восьмерки');
        } else if (streetFlushS.length === streetFromEight.length) {
          player.streetflush = streetFromEight;
          console.log('Пиковый стрит Флеш от восьмерки');
        } else {
          player.street = streetFromEight;
          console.log(player);
          console.log('стрит от восьмерки');
        }
        console.log(streetFromEight);
      }

    } else if (megaArray[5].length >= 1 && megaArray[4].length >= 1 && megaArray[3].length >= 1 && megaArray[2].length >= 1 && megaArray[1].length >= 1) {
      console.log(player);

      let streetFromSeven = [];

      streetFromSeven.push(megaArray[5][0]);
      streetFromSeven.push(megaArray[4][0]);
      streetFromSeven.push(megaArray[3][0]);
      streetFromSeven.push(megaArray[2][0]);
      streetFromSeven.push(megaArray[1][0]);

      console.log(streetFromSeven);

      for (let i = 0; i < streetFromSeven.length; i++) {
        let card = streetFromSeven[i];

        let streetFlushD = [];
        let streetFlushC = [];
        let streetFlushH = [];
        let streetFlushS = [];

        if (card.suit === 'diamonds') {
          streetFlushD.push(card);
        } else if (card.suit === 'clubs') {
          streetFlushC.push(card);
        } else if (card.suit === 'hearts') {
          streetFlushH.push(card);
        } else if (card.suit === 'spides') {
          streetFlushS.push(card);
        };

        if (streetFlushD.length === streetFromSeven.length) {
          player.streetflush = streetFromSeven;
          console.log('Бубновый стрит Флеш от семерки');
        } else if (streetFlushC.length === streetFromSeven.length) {
          player.streetflush = streetFromSeven;
          console.log('Трефовый стрит Флеш от семерки');
        } else if (streetFlushH.length === streetFromSeven.length) {
          player.streetflush = streetFromSeven;
          console.log('Червонный стрит Флеш от семерки');
        } else if (streetFlushS.length === streetFromSeven.length) {
          player.streetflush = streetFromSeven;
          console.log('Пиковый стрит Флеш от семерки');
        } else {
          player.street = streetFromSeven;
          console.log(player);
          console.log('стрит от семерки');
        }
        console.log(streetFromSeven);
      }

    } else if (megaArray[4].length >= 1 && megaArray[3].length >= 1 && megaArray[2].length >= 1 && megaArray[1].length >= 1 && megaArray[0].length >= 1) {
      console.log(player);

      let streetFromSix = [];

      streetFromSix.push(megaArray[4][0]);
      streetFromSix.push(megaArray[3][0]);
      streetFromSix.push(megaArray[2][0]);
      streetFromSix.push(megaArray[1][0]);
      streetFromSix.push(megaArray[0][0]);

      console.log(streetFromSix);

      for (let i = 0; i < streetFromSix.length; i++) {
        let card = streetFromSix[i];

        let streetFlushD = [];
        let streetFlushC = [];
        let streetFlushH = [];
        let streetFlushS = [];

        if (card.suit === 'diamonds') {
          streetFlushD.push(card);
        } else if (card.suit === 'clubs') {
          streetFlushC.push(card);
        } else if (card.suit === 'hearts') {
          streetFlushH.push(card);
        } else if (card.suit === 'spides') {
          streetFlushS.push(card);
        };

        if (streetFlushD.length === streetFromSix.length) {
          player.streetflush = streetFromSix;
          console.log('Бубновый стрит Флеш от шестерки');
        } else if (streetFlushC.length === streetFromSix.length) {
          player.streetflush = streetFromSix;
          console.log('Трефовый стрит Флеш от шестерки');
        } else if (streetFlushH.length === streetFromSix.length) {
          player.streetflush = streetFromSix;
          console.log('Червонный стрит Флеш от шестерки');
        } else if (streetFlushS.length === streetFromSix.length) {
          player.streetflush = streetFromSix;
          console.log('Пиковый стрит Флеш от шестерки');
        } else {
          player.street = streetFromSix;
          console.log(player);
          console.log('стрит от шестерки');
        }
        console.log(streetFromSix);
      }

    } else if (megaArray[3].length >= 1 && megaArray[2].length >= 1 && megaArray[1].length >= 1 && megaArray[0].length >= 1 && megaArray[12].length >= 1) {
      console.log(player);

      let streetFromFive = [];

      streetFromFive.push(megaArray[3][0]);
      streetFromFive.push(megaArray[2][0]);
      streetFromFive.push(megaArray[1][0]);
      streetFromFive.push(megaArray[0][0]);
      streetFromFive.push(megaArray[12][0]);

      console.log(streetFromFive);

      for (let i = 0; i < streetFromFive.length; i++) {
        let card = streetFromFive[i];

        let streetFlushD = [];
        let streetFlushC = [];
        let streetFlushH = [];
        let streetFlushS = [];

        if (card.suit === 'diamonds') {
          streetFlushD.push(card);
        } else if (card.suit === 'clubs') {
          streetFlushC.push(card);
        } else if (card.suit === 'hearts') {
          streetFlushH.push(card);
        } else if (card.suit === 'spides') {
          streetFlushS.push(card);
        };

        if (streetFlushD.length === streetFromFive.length) {
          player.streetflush = streetFromFive;
          console.log('Бубновый стрит Флеш от пятерки');
        } else if (streetFlushC.length === streetFromFive.length) {
          player.streetflush = streetFromFive;
          console.log('Трефовый стрит Флеш от пятерки');
        } else if (streetFlushH.length === streetFromFive.length) {
          player.streetflush = streetFromFive;
          console.log('Червонный стрит Флеш от пятерки');
        } else if (streetFlushS.length === streetFromFive.length) {
          player.streetflush = streetFromFive;
          console.log('Пиковый стрит Флеш от пятерки');
        } else {
          player.street = streetFromFive;
          console.log(player);
          console.log('стрит от пятерки');
        }
        console.log(streetFromFive);
      }
    } else {
      checkForSet(megaArray, player = player);
    }
  }

  const checkForFlesh = function (megaArray, player = player) {
    if (megaArray[13].length >= 5) {
      megaArray[13].sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });
      player.flush.push(megaArray[13][0]);
      player.flush.push(megaArray[13][1]);
      player.flush.push(megaArray[13][2]);
      player.flush.push(megaArray[13][3]);
      player.flush.push(megaArray[13][4]);
      console.log('флешь из ' + megaArray[13][0].suit + ' от ' + megaArray[13][0].name);

    } else if (megaArray[14].length >= 5) {
      megaArray[14].sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });
      player.flush.push(megaArray[14][0]);
      player.flush.push(megaArray[14][1]);
      player.flush.push(megaArray[14][2]);
      player.flush.push(megaArray[14][3]);
      player.flush.push(megaArray[14][4]);
      console.log('флешь из ' + megaArray[14][0].suit + ' от ' + megaArray[14][0].name);

    } else if (megaArray[15].length >= 5) {
      megaArray[15].sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });
      player.flush.push(megaArray[15][0]);
      player.flush.push(megaArray[15][1]);
      player.flush.push(megaArray[15][2]);
      player.flush.push(megaArray[15][3]);
      player.flush.push(megaArray[15][4]);
      console.log('флешь из ' + megaArray[15][0].suit + ' от ' + megaArray[15][0].name);
    }

    else if (megaArray[16].length >= 5) {
      megaArray[16].sort(function (card1, card2) {
        return card2.rank - card1.rank;
      });
      player.flush.push(megaArray[16][0]);
      player.flush.push(megaArray[16][1]);
      player.flush.push(megaArray[16][2]);
      player.flush.push(megaArray[16][3]);
      player.flush.push(megaArray[16][4]);
      console.log('флешь из ' + megaArray[16][0].suit + ' от ' + megaArray[16][0].name);

    } else {
      checkForStreet(megaArray, player = player)
    };
  }


  const checkCombination = function (player) {

    let diamonds = [];
    let hearts = [];
    let spides = [];
    let clubs = [];
    let couplesOfDeuce = [];
    let couplesOfThree = [];
    let couplesOfFour = [];
    let couplesOfFive = [];
    let couplesOfSix = [];
    let couplesOfSeven = [];
    let couplesOfEight = [];
    let couplesOfNine = [];
    let couplesOfTen = [];
    let couplesOfJack = [];
    let couplesOfQueen = [];
    let couplesOfKing = [];
    let couplesOfAce = [];

    if (player.power > 0) {
      diamonds = [];
      hearts = [];
      spides = [];
      clubs = [];
      couplesOfDeuce = [];
      couplesOfThree = [];
      couplesOfFour = [];
      couplesOfFive = [];
      couplesOfSix = [];
      couplesOfSeven = [];
      couplesOfEight = [];
      couplesOfNine = [];
      couplesOfTen = [];
      couplesOfJack = [];
      couplesOfQueen = [];
      couplesOfKing = [];
      couplesOfAce = [];
    }

    let playerHand = player.combination;

    let megaArray = [couplesOfDeuce, couplesOfThree, couplesOfFour, couplesOfFive, couplesOfSix, couplesOfSeven, couplesOfEight, couplesOfNine, couplesOfTen, couplesOfJack, couplesOfQueen, couplesOfKing, couplesOfAce, diamonds, hearts, spides, clubs];

    playerHand.find(card => {
      switch (card.suit) {
        case 'diamonds':
          diamonds.push(card);
          break;
        case 'hearts':
          hearts.push(card);
          break;
        case 'spides':
          spides.push(card);
          break;
        case 'clubs':
          clubs.push(card);
          break;
      }

      switch (card.rank) {
        case 2:
          couplesOfDeuce.push(card);
          break;
        case 3:
          couplesOfThree.push(card);
          break;
        case 4:
          couplesOfFour.push(card);
          break;
        case 5:
          couplesOfFive.push(card);
          break;
        case 6:
          couplesOfSix.push(card);
          break;
        case 7:
          couplesOfSeven.push(card);
          break;
        case 8:
          couplesOfEight.push(card);
          break;
        case 9:
          couplesOfNine.push(card);
          break;
        case 10:
          couplesOfTen.push(card);
          break;
        case 11:
          couplesOfJack.push(card);
          break;
        case 12:
          couplesOfQueen.push(card);
          break;
        case 13:
          couplesOfKing.push(card);
          break;
        case 14:
          couplesOfAce.push(card);
          break;
      };
    });
    checkForFlesh(megaArray, player = player);
  };

  //============

  testButton.addEventListener('click', function () {
    changePlayer();
  });

  callButton.addEventListener('click', function () {
    setRate();
    changePlayer();
    // changePlayerBot();
    checkStepStatus();

  });

  raiseButton.addEventListener('click', function () {
    rate = rate + (rate * 2);

    setRate();
    changePlayer();
    changePlayerBot();
    checkStepStatus();
  })

  window.steps = {
    rate: rate,
    steck: steck,
    preFlop: preFlop,
    newDeck: newDeck,
  }

})();




