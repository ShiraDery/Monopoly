const initialBudget = Number(location.search.split("=")[1]);
let budgets = [initialBudget, initialBudget];
let positions = [1, 1];
let purchases = [null, null, null, null, null, null, null, null,];
let activePlayer = 0; // 0 or 1
let notActivePlayer = 1; //1 or 0
let OldGameExist = 0;
let capital = [budgets[0], budgets[1]];
let stations0 = [];
let stations1 = [];

function switchPlayer() {
    activePlayer = activePlayer == 0 ? 1 : 0;
    notActivePlayer = Math.abs(activePlayer - 1);
}
function loadJSON() {
    const corners = [7, 10, 1, 4];
    let carIndex = 0;
    for (let i = 1; i <= 12; i++) {
        if (corners.indexOf(i) > -1) {
            continue;
        }
        const car = suzukiCars[carIndex];
        const $cell = $("#cell-" + i);
        $cell.html(`
                    <h2>${car.group}</h2>
                    <h4>${car.name}</h4>
                    <img src="${car.picture}"/>
                    <div>$${car.worth.toLocaleString()}</div>
                           `);
        carIndex++;
    }
    oldGameExist = JSON.parse(localStorage.getItem("oldGameExist"));
    if (oldGameExist == 1) {
        continueGame();
    }
    else {
        return;
    }
}
function renderBudgets() {
    $(".player-budget", "#p1-cell").text(budgets[0].toLocaleString())
    $(".player-budget", "#p2-cell").text(budgets[1].toLocaleString())
}
function renderPlayersPositions(shouldRemoveOld) {
    let $cell = $("#cell-" + positions[0]);

    if (shouldRemoveOld) {
        $("#p1").remove();
        $("#p2").remove();
    }

    $cell.html(`${$cell.html()} <div id="p1"><img src ='images/car1.jpg'/></div>`)
    $cell = $("#cell-" + positions[1]);
    $cell.html(`${$cell.html()} <div id="p2"><img src ='images/car2.jpg'/></div>`)
}

function renderCapital() {
    $(".player-capital", "#capital1").text(capital[0].toLocaleString());
    $(".player-capital", "#capital2").text(capital[1].toLocaleString());
}

function renderStations() {
    $(".player-stations", "#station1").text(stations0);
    $(".player-stations", "#station2").text(stations1);
}

function calcNextPosition(currentPosition, steps) {
    let next = (steps + currentPosition) % 13 + Math.floor((steps + currentPosition) / 13)

    return next;
}
function carDetailsByPosition(position) {
    const positionCarMap = {
        2: 0,
        3: 1,
        5: 2,
        6: 3,
        8: 4,
        9: 5,
        11: 6,
        12: 7
    };
    return suzukiCars[positionCarMap[position]];
}
function handleDiceClick() {
    $("#dice").on("click", function () {
        const steps = Math.round(Math.random() * 5) + 1;
        alert("dice result " + steps);
        const nextPosition = calcNextPosition(positions[activePlayer], steps);
        positions[activePlayer] = nextPosition;
        renderPlayersPositions(true);
        const car = carDetailsByPosition(nextPosition);

        if (car) {
            if (purchases[car.id] == null) {
                if (budgets[activePlayer] >= car.worth) {
                    const shouldBuy = confirm("buy " + car.name + "?");
                    if (shouldBuy) {
                        purchases[car.id] = activePlayer;
                        budgets[activePlayer] -= car.worth;
                        capital[activePlayer] -= car.worth;
                        if (activePlayer == 0) {
                            stations0 += (suzukiCars[car.id].name + ",");
                            capital[0] += (0.5 * suzukiCars[car.id].worth);
                        }

                        else {
                            stations1 += (suzukiCars[car.id].name + ",");
                            capital[1] += (0.5 * suzukiCars[car.id].worth);
                        }   
                    }

                } else {
                    alert("oppps not enough budget :|");
                }
            } else {
                if (purchases[car.id] == activePlayer) {
                    alert("welcome back to your property :P");
                } else {
                    alert("PAY 10%!");
                    budgets[activePlayer] -= car.worth * 0.1;
                    budgets[notActivePlayer] += car.worth * 0.1;
                    capital[activePlayer] -= car.worth * 0.1;
                    capital[notActivePlayer] += car.worth * 0.1;
                }
            }
        }
        else {
            //some corner
        }

        renderBudgets();
        switchPlayer();
        renderCapital();
        renderStations();

    });
}

function renderPurchases(carname) {
    if (activePlayer == 0)
        $('#p1-cell').append(carname + ",");
    else
        $('#p2-cell').append(carname + ",");
}

function endGame() {
    let endGame = confirm("Are you sure you want to end the game?");
    if (endGame) {
        if (capital[0] > capital[1])
            alert("The winner is player 1 !! :)");
        else
            alert("The winner is player 2 !! :)");

        localStorage.clear();
        localStorage.setItem("oldGameExist", "0");
        oldGameExist = JSON.parse(localStorage.getItem("oldGameExist"));
        
    }
    else return;
}
 
function confirmExit() {
    localStorage.setItem("oldGameExist", "1");
    localStorage.setItem("budgets", JSON.stringify(budgets));
    localStorage.setItem("positions", JSON.stringify(positions));
    localStorage.setItem("activePlayer", JSON.stringify(activePlayer));
    localStorage.setItem("purchases", JSON.stringify(purchases));
    localStorage.setItem("notActivePlayer", JSON.stringify(notActivePlayer));
    localStorage.setItem("capital", JSON.stringify(capital));
    localStorage.setItem("stations0", JSON.stringify(stations0));
    localStorage.setItem("stations1", JSON.stringify(stations1));
}

function continueGame() {

    if (localStorage.getItem("budgets") != null) {
        activePlayer = JSON.parse(localStorage.getItem("activePlayer"));
        purchases = JSON.parse(localStorage.getItem("purchases"));
        notActivePlayer = JSON.parse(localStorage.getItem("notActivePlayer"));
        positions = JSON.parse(localStorage.getItem("positions"));
        budgets = JSON.parse(localStorage.getItem("budgets"));
        capital = JSON.parse(localStorage.getItem("capital"));
        stations0 = JSON.parse(localStorage.getItem("stations0"));
        stations1 = JSON.parse(localStorage.getItem("stations1"));

    }
    localStorage.setItem("oldGameExist", "0");
    oldGameExist = JSON.parse(localStorage.getItem("oldGameExist"));
}


$(document).ready(function () {

    loadJSON();
    renderBudgets();
    renderPlayersPositions(false);
    handleDiceClick();
    renderCapital();
    renderStations();
    window.onbeforeunload = function () {
        confirmExit();
        return 'Are you sure you want to leave?';
    };
    continueGame();
});


