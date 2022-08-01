var searchInput = document.querySelector("#searchInput");
var searchBtn = document.querySelector("#searchBtn");
var clearBtn = document.querySelector("#clearBtn");
var searchResultsEl = document.querySelector("#searchResults");
var searchHistoryEl = document.querySelector("#searchHistory");

//RUN MOVIE QUOTE API
runMQ();

//SEARCH EVENT
searchBtn.addEventListener('click', function(event) {
    event.preventDefault();
    var errBlankModal = document.querySelector("#blankTitle");
    var closeBlankBtn = document.querySelector("#closeBlank");

    if (searchInput.value === "") {
        openModal(errBlankModal);
        closeBlankBtn.addEventListener('click', function () {
            closeModal(errBlankModal)
        });
    } else {
        searchResultsEl.innerHTML = "";
        runUtelly(searchInput.value);
        saveShows();
        historyButtons();
    }
});
keepHistory();

//MODAL FUNCTIONS
function openModal($el) {
    $el.classList.add('is-active');
}

function closeModal($el) {
    $el.classList.remove('is-active');
}

//UTELLY FETCH
function runUtelly(show) {
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f62dfa844dmsh9edf5c494fd42acp10844cjsn5de935bebbcd',
		'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
	}
};

fetch('https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term="' + show + '"&country=us', options)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        
        //Card Creation
        var cardEl = document.createElement("div");
        cardEl.classList.add("card");
        searchResultsEl.append(cardEl);

        //Conditional statement for successful/failed title search
        if (data.results[0] === undefined) {
            cardEl.classList.remove("card");
            var notFoundModal = document.querySelector("#notFound");
            var closeNotFoundBtn = document.querySelector("#closeNotFound");

            openModal(notFoundModal);
            closeNotFoundBtn.addEventListener('click', function () {
                closeModal(notFoundModal);
            });
            return;   
        } else {
            populate();
        };
    
        function populate() {
            for (i = 0; i < data.results.length; i++) {
                //Title
                var showTitle = document.createElement('h2');
                var showTitleData = data.results[i].name;
                showTitle.innerHTML = showTitleData
                cardEl.append(showTitle);     
                
                //Picture
                var picture = document.createElement('img');
                picture.classList.add('resultImg');
                var pictureURL = data.results[i].picture;
                picture.setAttribute('src', pictureURL);
                picture.setAttribute('alt', "picture not found");
                cardEl.append(picture);

                //"Where to Watch" Header
                var whereHeader = document.createElement("h3");
                whereHeader.innerHTML = "WHERE TO WATCH:";
                cardEl.append(whereHeader);

                //Streaming Services
                for (var x = 0; x < data.results[i].locations.length; x++) {
                    //Streaming Service Link
                    var iconA = document.createElement('a');
                    var iconURL = data.results[i].locations[x].url;
                    iconA.setAttribute('href', iconURL);
                    iconA.setAttribute('target', '_blank');
                    cardEl.append(iconA)
            
                    //Streaming Service Logo
                    var iconLogo = document.createElement('img');
                    var iconLogoURL = data.results[i].locations[x].icon;
                    iconLogo.setAttribute('src', iconLogoURL);
                    iconLogo.classList.add("logo");
                    iconA.append(iconLogo);
                }

                //Info Logo Container
                var infoDiv = document.createElement('div');
                cardEl.append(infoDiv);
    
                //"Information" Header
                var infoHeader = document.createElement("h3");
                infoHeader.innerHTML = "INFORMATION:";
                infoDiv.append(infoHeader);

                //IMDb
                if (data.results[i].external_ids.imdb === null) {
                    
                } else {
                    //Link to IMDb
                    var imdbA = document.createElement('a');
                    var imdbURL = data.results[i].external_ids.imdb.url;
                    imdbA.setAttribute('href', imdbURL);
                    imdbA.setAttribute('target', '_blank');
                    infoDiv.append(imdbA)
                    
                    //IMDb Logo
                    var imdbLogo = document.createElement('img');
                    imdbLogo.setAttribute('src', 'https://cdn4.iconfinder.com/data/icons/socialmediaicons_v120/48/imdb.png');
                    imdbLogo.classList.add("logo");
                    imdbA.append(imdbLogo);
                };

                //TMDB
                if (data.results[i].external_ids.tmdb == null) {

                } else {
                    //Result Link to TMDB
                    var tmdbA = document.createElement('a');
                    var tmdbURL = data.results[i].external_ids.tmdb.url;
                    tmdbA.setAttribute('href', tmdbURL);
                    tmdbA.setAttribute('target', '_blank');
                    infoDiv.append(tmdbA)
        
                    // Result TMDB Logo
                    var tmdbLogo = document.createElement('img');
                    tmdbLogo.setAttribute('src','https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg');
                    tmdbLogo.classList.add("logoResize");
                    tmdbA.append(tmdbLogo);
                };

                //WIKI
                if (data.results[i].external_ids.wiki_data === null) {
                    
                } else {
                //WikiData Link
                var wikiA = document.createElement('a');
                var wikiURL = data.results[i].external_ids.wiki_data.url;
                wikiA.setAttribute('href', wikiURL);
                wikiA.setAttribute('target', '_blank');
                infoDiv.append(wikiA)
        
                //WikiData Logo
                var wikiLogo = document.createElement('img');
                wikiLogo.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/6/66/Wikidata-logo-en.svg');
                wikiLogo.classList.add("logoResize");
                wikiA.append(wikiLogo);
                };   

                //Divider Line
                var divider = document.createElement('p');
                divider.classList.add("divider");
                infoDiv.append(divider);
            }
        }
    })
}

//SAVE SEARCH TO LOCAL STORAGE
function saveShows() {
    var new_show = document.querySelector('#searchInput').value;

    if (localStorage.getItem('Show Titles:') === null) {
        localStorage.setItem('Show Titles:', '[]');
    }

    var showArray = JSON.parse(localStorage.getItem('Show Titles:')) || [];
    showArray.push(new_show);

    localStorage.setItem('Show Titles:', JSON.stringify(showArray));
}

//CREATE SEARCH HISTORY BUTTONS
function historyButtons () {
    var showArray = JSON.parse(localStorage.getItem('Show Titles:')) || [];
    searchHistoryEl.innerHTML = "";
      
    for (var i = 0; i < showArray.length; i++) {
        var historyBtn = document.createElement('button');
        historyBtn.classList.add("historyBtn");
        var searchedShow = JSON.parse(localStorage.getItem('Show Titles:'))[i];
        historyBtn.innerHTML += searchedShow;
        searchHistoryEl.append(historyBtn); 
        renderResults();
    }     

    //RENDER SEARCH RESULTS ON CLICK
    function renderResults() {
        historyBtn.addEventListener("click", function(event) { 
            event.preventDefault();
            if (historyBtn) {
                searchResultsEl.innerHTML = '';
                runUtelly(event.target.innerHTML);
            }
        });
    }
}

//KEEP SEARCH HISTORY ON REFRESH
function keepHistory () {
    if (localStorage === "") {
  
    } else {
      historyButtons();
    }
}

//CLEAR SEARCH HISTORY
clearBtn.addEventListener("click", function() {
    localStorage.clear();
    searchHistoryEl.innerHTML = "";
    searchResultsEl.innerHTML = "";
})

//MQ FETCH
function runMQ() {
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f62dfa844dmsh9edf5c494fd42acp10844cjsn5de935bebbcd',
		'X-RapidAPI-Host': 'movie-and-tv-shows-quotes.p.rapidapi.com'
	}
};

fetch('https://movie-and-tv-shows-quotes.p.rapidapi.com/quotes/random/quote', options)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
        console.log("MQ", data);
        var movieQuoteEl = document.querySelector("#movieQuote");
        var quote = data.quote;
        movieQuoteEl.innerHTML = '"' + quote + '"';

        var mqInfoEl = document.querySelector("#mqInfo");
        var actor = data.actor;
        var character = data.character;
        var title = data.quoteFrom;
        var year = data.year;
        mqInfoEl.innerHTML = " - " + actor + " as " + character + " in " + (title.italics()) + ", " + year;
    })  
}      