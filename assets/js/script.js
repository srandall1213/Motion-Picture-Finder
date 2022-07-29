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
        document.querySelector("#searchResults").innerHTML = '';
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

        //Result Title
        var showTitle = document.createElement('h2');

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
            var showTitleData = data.results[0].name;
            showTitle.innerHTML = showTitleData
            cardEl.append(showTitle);
        }
           
        //Result Picture
        var picture = document.createElement('img');
        picture.classList.add('resultImg');
        var pictureURL = data.results[0].picture;
        picture.setAttribute('src', pictureURL);
        cardEl.append(picture);

        //"Where to Watch" Header
        var whereHeader = document.createElement("h2");
        whereHeader.innerHTML = "Where to watch:";
        cardEl.append(whereHeader);

        //Result Link to Streaming Service 
        for (var i = 0; i < data.results[0].locations.length; i++) {
        var iconA = document.createElement('a');
        var iconURL = data.results[0].locations[i].url;
        iconA.setAttribute('href', iconURL);
        iconA.setAttribute('target', '_blank');
        cardEl.append(iconA)
        
        //Result Logo
        var iconLogo = document.createElement('img');
        var iconLogoURL = data.results[0].locations[i].icon;
        iconLogo.setAttribute('src', iconLogoURL);
        iconLogo.classList.add("logo");
        iconA.append(iconLogo);
        }

        //Info Logos Container
        var infoDiv = document.createElement('div');
        cardEl.append(infoDiv);

        //"Information" Header
        var infoHeader = document.createElement("h2");
        infoHeader.innerHTML = "Information:";
        infoDiv.append(infoHeader);

        //Result Link to IMDb
        var imdbA = document.createElement('a');
        var imdbURL = data.results[0].external_ids.imdb.url;
        imdbA.setAttribute('href', imdbURL);
        imdbA.setAttribute('target', '_blank');
        infoDiv.append(imdbA)
        
        // Result IMDb Logo
        var imdbLogo = document.createElement('img');
        imdbLogo.setAttribute('src', 'https://cdn4.iconfinder.com/data/icons/socialmediaicons_v120/48/imdb.png');
        imdbLogo.classList.add("logo");
        imdbA.append(imdbLogo);

        //Result Link to TMDB
        var tmdbA = document.createElement('a');
        var tmdbURL = data.results[0].external_ids.tmdb.url;
        tmdbA.setAttribute('href', tmdbURL);
        tmdbA.setAttribute('target', '_blank');
        infoDiv.append(tmdbA)
        
        // Result TMDB Logo
        var tmdbLogo = document.createElement('img');
        tmdbLogo.setAttribute('src','https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg');
        tmdbLogo.classList.add("logoResize");
        tmdbA.append(tmdbLogo);

        //Result Link to Wiki Info
        var wikiA = document.createElement('a');
        var wikiURL = data.results[0].external_ids.wiki_data.url;
        wikiA.setAttribute('href', wikiURL);
        wikiA.setAttribute('target', '_blank');
        infoDiv.append(wikiA)
        
        // Result WikiData Logo
        var wikiLogo = document.createElement('img');
        wikiLogo.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/6/66/Wikidata-logo-en.svg');
        wikiLogo.classList.add("logoResize");
        wikiA.append(wikiLogo);
    });  
      
}

//SAVE SEARCH TO LOCAL STORAGE
function saveShows() {
    var new_show = document.querySelector('#searchInput').value;

    if (localStorage.getItem('Show Titles:') === null) {
        localStorage.setItem('Show Titles:', '[]');
    }

    var showArray = JSON.parse(localStorage.getItem('Show Titles:'))||[];
    showArray.push(new_show);

    localStorage.setItem('Show Titles:', JSON.stringify(showArray));
}

//CREATE SEARCH HISTORY BUTTONS
function historyButtons () {

    var showArray = JSON.parse(localStorage.getItem('Show Titles:'))||[];
    console.log(showArray)
    searchHistoryEl.innerHTML = "";
      
    for (var i = 0; i < showArray.length; i++) {
        var historyBtn = document.createElement('button');
        historyBtn.classList.add("historyBtn");
        var searchedShow = JSON.parse(localStorage.getItem('Show Titles:'))[i];
        historyBtn.innerHTML += searchedShow;
        searchHistoryEl.append(historyBtn); 
        renderResults();
        console.log(showArray)
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
    searchHistoryEl.innerText = '';
    searchResultsEl.innerText = '';
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
            var movieQuoteEl=document.querySelector("#movieQuote");
            var quote=data.quote;
            movieQuoteEl.innerHTML='"' + quote + '"';

            var mqInfoEl=document.querySelector("#mqInfo");
            var actor=data.actor;
            var character=data.character;
            var title=data.quoteFrom;
            var year=data.year;
            mqInfoEl.innerHTML= "-" + actor + " as " + character + " in " + (title.italics()) + ", " + year;
        })
}        