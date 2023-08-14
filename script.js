function calculateAverageRating(games) {
    const totalRatings = games.reduce((sum, game) => sum + parseFloat(game.ratings.rating), 0);
    return totalRatings / games.length;
}

function generateDifferenceHTML(differenceToAverage) {
    const color = differenceToAverage > 0 ? 'green' : (differenceToAverage < 0 ? 'red' : 'gray');
    const symbol = differenceToAverage > 0 ? '↑' : (differenceToAverage < 0 ? '↓' : '');
    const formattedDifference = differenceToAverage !== 0 ? `${Math.abs(differenceToAverage).toFixed(1)}${symbol}` : '-';
    return `<span style="color: ${color}; background: #111111; border-radius: 10px; font-size: 14px; padding: 5px; font-weight: normal;">${formattedDifference}</span>`;
}

function windowLoaded() {
    const universeIDHolder = document.getElementById("game-detail-meta-data").getAttribute("data-universe-id");
    const url = "https://ndevapi.com/main_list_ratings";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const gameContainer = document.getElementsByClassName("game-name")[0];
            const games = data.filter(game => game.uid === universeIDHolder);

            if (games.length > 0) {
                const averageRating = calculateAverageRating(data);
                const differenceToAverage = parseFloat(games[0].ratings.rating) - averageRating;
                const differenceHTMLString = generateDifferenceHTML(differenceToAverage);

                gameContainer.innerHTML += `
                    <br>
                    <span style="background: #111111; border-radius: 10px; font-size: 15px; padding: 5px;">RHL-Score: (${games[0].ratings.rating}/10)</span>
                    ${differenceHTMLString}`;
            }
            else {
                let gameGenre = "";
                if (document.getElementsByClassName("game-stat game-stat-width")[6]) {
                    gameGenre = document.getElementsByClassName("game-stat game-stat-width")[6].querySelector(`p:nth-child(2)`).textContent;
                }
                else if (document.getElementsByClassName("game-stat game-stat-width-voice")[7]) {
                    gameGenre = document.getElementsByClassName("game-stat game-stat-width-voice")[7].querySelector(`p:nth-child(2)`).textContent;
                }

                if (gameGenre == "Horror") {
                    gameContainer.innerHTML += `
                    <br>
                    <span style="color: red; background: #111111; border-radius: 10px; font-size: 14px; padding: 5px; font-weight: normal;">No RHL-Score found</span>
                    <a href="https://discord.gg/Qq9aREaR3F" style="font-size: 12px; background-color: #738ADB; border: 0px; border-radius: 10px; padding: 5px; font-weight: normal; box-shadow: 4px 2.5px 1.5px #111111;">→ Suggest</a>`;
                }
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

addEventListener("load", windowLoaded, false);
