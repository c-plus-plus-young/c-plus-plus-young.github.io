async function fetchGames() {
    try {
        const response = await fetch('/pages/games/games.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const games = await response.json();
        return games;
    } catch (error) {
        console.error('Error fetching game list: ', error);
    }
}

fetchGames().then(games => {
    const gamesContainer = document.getElementById('games-container');
    for (const [gameName, details] of Object.entries(games)) {
        const gameDiv = document.createElement('div');
        gameDiv.innerHTML = `<h3>${gameName}</h3><img src="${games[gameName]['image-link']}" alt="${gameName} image">`;
        gameDiv.addEventListener('click', () => {
            window.location.href = games[gameName]['url'];
        });
        gameDiv.addEventListener('mouseover', () => {
            gameDiv.style.cursor = 'pointer';
        });
        gamesContainer.appendChild(gameDiv);
    }
});
