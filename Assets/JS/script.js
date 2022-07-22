var searchEl = document.querySelector('#search');
var searchButtonEl = document.querySelector('#searchButton');
var scoreEl = document.querySelector('#score');

// this function gets ratings for title
var getRatings = function (title) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ebf7d7cf9emshe2b557c1aca00c0p1e7f5fjsnb7e551aa03e8',
            'X-RapidAPI-Host': 'mdblist.p.rapidapi.com'
        }
    };

    fetch('https://mdblist.p.rapidapi.com/?s=' + title, options)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    if (data["search"].length > 0) {
                        scoreEl.textContent = "score for " + title + " is " + data["search"][0]["score"];
                    } else {
                        scoreEl.textContent = "score for " + title + " not found";
                    }
                });
            } else { // in case of error 
                scoreEl.textContent = "Error getting score for " + title;
            }
        });
};

var submitHandler = function (event) {
    var title = searchEl.value.trim();
    console.log(title);
    getRatings(title)
};

searchButtonEl.addEventListener('click', submitHandler);