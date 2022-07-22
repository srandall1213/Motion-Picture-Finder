
















































var searchBtn = document.querySelector("#searchButton");
var searchInput = document.querySelector("#search");

searchBtn.addEventListener('click', function(event) {
    event.preventDefault();
  
    if (searchInput.value === "") {
        alert("Show cannot be blank."); //put modal here
    } else {
      runUtelly(searchInput.value);
    }
});


function runUtelly(show) {
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f62dfa844dmsh9edf5c494fd42acp10844cjsn5de935bebbcd',
		'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
	}
};

fetch('https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term="' + show + '"&country=us', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
}