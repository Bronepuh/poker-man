'use strict';

(function () {

  const TABLE_CARDS = [];


  const playersList = document.querySelectorAll('.player');
  const PLAYERS = window.data.players;
  const playerChips = document.querySelectorAll('.player__steck .steck__item');
  const playerRateChips = document.querySelectorAll('.player__rate-steck .steck__item');
  const playerControll = document.querySelector('.room__player-controll');
  const tableCards = document.querySelectorAll('.deck__card');

  const clearPlayerCards = function () {
    for (let i = 0; i < PLAYERS.length; i++) {
      const player = PLAYERS[i];
      const playerHand = playersList[i].querySelectorAll('.card');
      playerHand.forEach(element => {
        element.className = '';
        element.className = 'player__card card';
      })
    }
  }

  const clearTableCardsClasses = function (dataTableCards) {
    tableCards.forEach(element => {
      element.className = '';
      element.className = 'deck__card card';
    });
    dataTableCards.splice(0, dataTableCards.length);
    dataTableCards = [];
  }

  const hideTableCards = function () {
    tableCards.forEach(element => {
      element.style = 'display: none';
    })
  };

  const renderCards = function (data, dataTableCards) {

    clearPlayerCards();
    clearTableCardsClasses(dataTableCards);

    let shiftCards = [];

    for (let i = 0; i < PLAYERS.length; i++) {
      const player = PLAYERS[i];
      const playerHand = playersList[i].querySelectorAll('.card');
      let card = data[i];
      player.hand.push(card);
      player.combination.push(card);
      shiftCards.push(card);
      playerHand[0].classList.add(card.className);
      data.splice(i, 1);

      card = data[i];
      player.hand.push(card);
      player.combination.push(card);
      shiftCards.push(card);
      playerHand[1].classList.add(card.className);
      data.splice(i, 1);
    }

    tableCards[0].classList.add(data[0].className);
    dataTableCards.push(data[0]);
    tableCards[1].classList.add(data[1].className);
    dataTableCards.push(data[1]);
    tableCards[2].classList.add(data[2].className);
    dataTableCards.push(data[2]);
    tableCards[3].classList.add(data[3].className);
    dataTableCards.push(data[3]);
    tableCards[4].classList.add(data[4].className);
    dataTableCards.push(data[4]);

    hideTableCards();
  };

  const clearSteck = function (chips) {
    chips.forEach(element => {
      element.classList.add('visually-hidden')
    });
    return TABLE_CARDS;
  };

  const renderChips = function (cash, orangeChips, greenChips, blueChips, redChips) {

    const indexOfOrange = Math.floor(Number(cash) / 1000);
    const remainderOfThauthend = Number(cash) % 1000;
    const indexOfGreen = Math.floor(Number(remainderOfThauthend) / 100);
    const remainderOfHundred = Number(remainderOfThauthend) % 100;
    const indexOfBlue = Math.floor(Number(remainderOfHundred) / 25);
    const remainderOfTventyFive = Number(remainderOfHundred) % 25;
    const indexOfRed = Math.floor(Number(remainderOfTventyFive) / 5);

    if (indexOfOrange > 0) {
      for (let i = 0; i < indexOfOrange; i++) {
        orangeChips[i].classList.remove('visually-hidden');
      }
    }

    if (indexOfGreen > 0) {
      for (let i = 0; i < indexOfGreen; i++) {
        greenChips[i].classList.remove('visually-hidden');
      }
    }

    if (indexOfBlue > 0) {
      for (let i = 0; i < indexOfBlue; i++) {
        blueChips[i].classList.remove('visually-hidden');
      }
    }

    if (indexOfRed > 0) {
      for (let i = 0; i < indexOfRed; i++) {
        redChips[i].classList.remove('visually-hidden');
      }
    }
  }

  const renderPlayers = function (PLAYERS) {

    clearSteck(playerChips);
    clearSteck(playerRateChips);

    for (let i = 0; i < PLAYERS.length; i++) {

      const player = PLAYERS[i];

      player.id = i;
      playersList[i].classList.remove('visually-hidden')

      const playerName = playersList[i].querySelector('.player__name');
      playerName.value = player.name;

      const playerCash = playersList[i].querySelector('.player__cash');
      playerCash.value = player.cash;

      const playerRate = playersList[i].querySelector('.player__rate');
      playerRate.value = player.rate;

      //прячу карты других игроков
      if(PLAYERS[i].isBot) {
        const playerHand = playersList[i].querySelectorAll('.card');
        playerHand[0].classList.add('card--close');
        playerHand[1].classList.add('card--close');
      }

      //фишки игрока
      const playerOrangeChips = playersList[i].querySelectorAll('.player__steck .steck__item--orange');
      const playerGreenChips = playersList[i].querySelectorAll('.player__steck .steck__item--green');
      const playerBlueChips = playersList[i].querySelectorAll('.player__steck .steck__item--blue');
      const playerRedChips = playersList[i].querySelectorAll('.player__steck .steck__item--red');

      //фишки ставки
      const rateOrangeChips = playersList[i].querySelectorAll('.player__rate-steck .steck__item--orange');
      const rateGreenChips = playersList[i].querySelectorAll('.player__rate-steck .steck__item--green');
      const rateBlueChips = playersList[i].querySelectorAll('.player__rate-steck .steck__item--blue');
      const rateRedChips = playersList[i].querySelectorAll('.player__rate-steck .steck__item--red');

      renderChips(player.cash, playerOrangeChips, playerGreenChips, playerBlueChips, playerRedChips);
      renderChips(player.rate, rateOrangeChips, rateGreenChips, rateBlueChips, rateRedChips);

    }
  }

  const renderTable = function (rate, steck) {

    const tableRate = document.querySelector('input[name="table-rate"]');
    const tableSteck = document.querySelector('input[name="table-steck"]');

    //фишки на столе
    const tableChips = document.querySelectorAll('.table__steck .steck__item');

    clearSteck(tableChips);

    const tableOrangeChips = document.querySelectorAll('.table__steck .steck__item--orange');
    const tableGreenChips = document.querySelectorAll('.table__steck .steck__item--green');
    const tableBlueChips = document.querySelectorAll('.table__steck .steck__item--blue');
    const tableRedChips = document.querySelectorAll('.table__steck .steck__item--red');

    tableRate.value = rate;
    tableSteck.value = steck;

    renderChips(steck, tableOrangeChips, tableGreenChips, tableBlueChips, tableRedChips);
  }

  window.render = {
    renderPlayers: renderPlayers,
    renderTable: renderTable,
    renderCards: renderCards,
    tableCards: TABLE_CARDS,
  }

})();
