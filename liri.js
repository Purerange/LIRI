require("dotenv").config();

var spotifyIDs = require("./keys.js").spotify;
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(spotifyIDs);

var nodeArgs = process.argv;


// console.log(spotifyIDs);

// console.log(nodeArgs);
// console.log(action);
// console.log(input);


// Determine which function we need to call
function determine(action) {
    switch (action) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThis();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("Invalid arguments. Please see documentation and try again.");
    }
}


// Not sure why this returns weird stuff when searching for Drake.
function concertThis() {
// concert-this
// Pass the artist's name into the API and print Venue Name, Venue Location, and Event Date (using moment)

    // console.log("Concerting this");

    if (!nodeArgs[3]) {

        return console.log("You did not input a valid artist's name, so nothing will happen.");

    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";

    request(queryUrl, function(error, response, body) {

        if (error) {
            return console.log(error);
        } else if (response.statusCode === 200) {
            console.log("Events:\n");
            for (var j = 0; j < JSON.parse(body).length; j++) {
                console.log("Venue Name: " + JSON.parse(body)[i].venue.name);
                console.log("Venue Location: " + JSON.parse(body)[i].venue.city + ", " + JSON.parse(body)[i].venue.country);

                // Need to convert with moment.js
                console.log("Event Date: " + JSON.parse(body)[i].datetime);
                console.log("");
            }
        }

    })
}

function spotifyThis() {
// spotify-this-song
// Pass the song's name into the API and print Artist(s), Song Name, Preview Link, Album

    spotify.search({type: "track", query: input, limit: 1}, function(err, data) {
        if (err) {
            return console.log("An error occurred: " + err);
        }

        console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Preview URL: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);

    });
}

function movieThis() {
// movie-this
// Pass the movie name and output a bunch of info
// If no movie is specified, do Mr. Nobody

    // console.log("Movieing this");

    if (!nodeArgs[3]) {

        input = "Dr.+Nobody";
        console.log("You did not input a valid movie name, so we have selected Mr. Nobody for you. You are welcome.");

    }

    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        if (error) {
            return console.log(error);
        } else if (response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }

    })
}

function doWhatItSays() {
// do-what-it-says
// Take the text inside random.txt and do what that says

    // console.log("Doing what it says");

    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        console.log(data);
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        dataArr[1] = dataArr[1].replace(/"/g, "");

        console.log(dataArr)

        input = dataArr[1];

        determine(dataArr[0]);
      
      });


}

// Collect command line arguments
if (nodeArgs[2]) {
    var action = nodeArgs[2];
}

if (nodeArgs[3]) {
    var input = "";

    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            input = input + "+" + nodeArgs[i];

        } else {

            input += nodeArgs[i];

        }
    }
}

determine(action);