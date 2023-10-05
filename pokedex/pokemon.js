const MAX_POKEMON = 151; //Määrittää pokemoinedein määrän
const listWrapper = document.querySelector(".list-wrapper"); // Nämä muuttujat viittaavat HTML-elementteihin joka mahdollistaa toimintojen suorittamisen niiden kanssa
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];// Tähän tulee pokemonien data 

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`) //"BACK TICS" urlin ympärillä mahdollistaa datan käyttämisen HTMLssä
    .then((response) => response.json())
    .then((data) => {
        allPokemons = data.results;
        displayPokemons(allPokemons);
    });

async function fetchPokemonDataBeforeRedirect(id) { //async = Jos kirjoitetaa pelkkä function ja dataa on valtavamäärä, niin suorittaessa ohjelmaa se ei ehdi käydä kaikkea dataa lataamassa APIsta jolloinka se lyö erroria. Async mahdollistaa sen, että se ei etene koodissa ennen kuin kaikki data on käyty läpi.
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)// Käytetään fetch funktioo datan hakuun. 
            .then((res) =>
                res.json()
            ),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((res) =>
                res.json()
            ),
        ]);
        return true;
    }   catch (error) {
        console.error("Failed to fetch Pokemon data before redirect");
    }
}

function displayPokemons(pokemon) {
    listWrapper.innerHTML = "";

    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonID}</p> 
            </div>
            <div class="img-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}/>
            </div>
            <div class="name-wrap">
            <p class="body3-fonts">#${pokemon.name}</p> 
            </div>
        `;

        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect (pokemonID);
            if (success) {
                window.location.href = `./detail.html?id=${pokemonID}`; //Mahdollistaa pidettävän saman detail html - sivun
            }
        });

        listWrapper.appendChild(listItem);
    });
}
    searchInput.addEventListener("keyup", handleSearch); //HAKUKONEEN TOIMINNALLISUUS

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredPokemons;
        
        if (numberFilter.checked) {
            filteredPokemons = allPokemons.filter((pokemon) => {
                const pokemonID = pokemon.url.split("/")[6]; // Korjattu muuttujan nimi
                return pokemonID.startsWith(searchTerm);
            });
        } else if (nameFilter.checked) {
                filteredPokemons = allPokemons.filter((pokemon) => {
                return pokemon.name.toLowerCase().startsWith(searchTerm);
            });
        } else {
                filteredPokemons = allPokemons;
        }

        displayPokemons(filteredPokemons);
        if (filteredPokemons.length === 0){
            notFoundMessage.style.display = "block";
        }   else {
            notFoundMessage.style.display = "none";
    }
}

const closeButton = document.querySelector(".search-close-icon");//RUKSILLA SAADAAN PERUTTUA
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
    searchInput.value = "";
    displayPokemons(allPokemons);
    notFoundMessage.style.display = "none"
}