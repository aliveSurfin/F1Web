var cors2 = "https://cors-anywhere.herokuapp.com/";
// cors2 = "https://cors.io/";
var cors = "https://cors.vaindil.xyz/";

var seasonUrl = "https://f1tv.formula1.com/api/race-season/?fields=year,name,self,has_content,eventoccurrence_urls&year__gt=2017&order=year"
var urlStart = "https://f1tv.formula1.com"
var sessionURLstart = "https://f1tv.formula1.com/api/session-occurrence/?fields=global_channel_urls,global_channel_urls__uid,global_channel_urls__slug,global_channel_urls__self,channel_urls,channel_urls__slug,channel_urls__name,channel_urls__uid,channel_urls__self,eventoccurrence_url,eventoccurrence_url__slug,eventoccurrence_url__circuit_url,eventoccurrence_url__circuit_url__short_name,session_type_url__name&fields_to_expand=global_channel_urls,channel_urls&slug=";


function seasonsToArray() {
    var seasons = new Array();
    var seasonJSON = getSeasonsJSON();

    for (var x = 0; x < seasonJSON.length; x++) {
        seasons.push(
            {
                self: seasonJSON[x].name,
                name: seasonJSON[x].name,
                eventoccurrence_urls: seasonJSON[x].eventoccurrence_urls,
            }
        )
    }
    return seasons;
}
function eventsToArray(eventoccurrence_urls) {
    var events = new Array();
    for (var x = 0; x < eventoccurrence_urls.length; x++) {
        var event = getEventJSON(eventoccurrence_urls[x]);
        events.push(
            {
                self: event.name,
                name: event.name,
                official_name: event.official_name,
                circuit_url: event.circuit_url,
                end_date: event.end_date,
                start_date: event.start_date,
                sessionoccurrence_urls: event.sessionoccurrence_urls,







            }
        )

        //break;
    }

    return events;
}
function sessionsToArray(sessionoccurrence_urls) {
    var sessions = new Array();

    for (var x = 0; x < sessionoccurrence_urls.length; x++) {
        var session = getSessionJSON(sessionoccurrence_urls[x]);
        //console.log(session);
        if (session.status === "expired") {
            continue;
        }
        sessions.push(
            {
                self: session.name,
                name: session.name,
                channel_urls: session.channel_urls,
                status: session.status,
                slug: session.slug,
                start_time: session.start_time,
                end_time: session.end_time,

            }

        )
        //break;
    }
    return sessions;
}
function sessionStreamsToArray(slug) {

    var sessionStreams = new Array();
    var sessionStreamJSON = getSessionStreamsJSON(slug);
    sessionStreamJSON = sessionStreamJSON.objects[0];
    for (var x = 0; x < sessionStreamJSON.channel_urls.length; x++) {
        sessionStreamJSON.channel_urls[x].self = getPlayableURL(sessionStreamJSON.channel_urls[x].self);
        var file = getFixedArray(sessionStreamJSON.channel_urls[x].self);
        var url = createFile(file);

        sessionStreams.push(
            {
                self: sessionStreamJSON.channel_urls[x].name,
                name: sessionStreamJSON.channel_urls[x].name,
                blob: url,
                file: file,
            }
        )

    }
    return sessionStreams;
}
function TESTING() {
    var seasonArray = seasonsToArray();
    var eventArray = eventsToArray(seasonArray[1].eventoccurrence_urls);
    var sessionArray = sessionsToArray(eventArray[0].sessionoccurrence_urls);
    var sessionStreamsArray = sessionStreamsToArray(sessionArray[1].slug);
    console.log(sessionStreamsArray);
}
function search(year, event, session, stream, f1) {
    //
    var found;
    // defaults
    if (stream === undefined || stream === "" || stream === null) {
        stream = "Main Feed";
    } else {
        stream = stream.trim();
    }
    if (session === undefined || session === "" || session === null) {
        session = "last";
    } else {
        session = session.trim();
    }
    if (event === undefined || event === "" || event === null) {
        event = "last"; // add handling for current event vvvvv
    } else {
        event = event.trim();
    }
    if (year === undefined || year === "" || year === null) {
        year = "last";
    } else {
        year = year.trim();
    }
    if (f1 === undefined || f1 === "" || f1 === null) {
        f1 = true
    } else {
        f1 = false;
    }
    var f1str = f1 ? "yes" : "no";
    console.log("Year: " + year + " | " + "Event: " + event + " | " + "Sesson: " + session + " | " + "Stream: " + stream + " | " + "F1 ?: " + f1str);

    // searching season
    var seasonJSON = getSeasonsJSON();
    console.log(seasonJSON[0]);
    if (year === "last") {
        seasonJSON = seasonJSON[seasonJSON.length - 1];
    } else {
        for (var x = 0; x < seasonJSON.length; x++) {
            if (seasonJSON[x].name.includes(year)) {
                seasonJSON = seasonJSON[x];
                break;
            } else {
                // handle not found 
                console.log("season not found");
            }
        }
    }
    //console.log("SEASON");
    console.log("Season : " + seasonJSON.name);
    // searching event
    var now = new Date();
    if (event === "last") {
        for (var x = 0; x < seasonJSON.eventoccurrence_urls.length; x++) {
            var eventJSON = getEventJSON(seasonJSON.eventoccurrence_urls[x]);
            if (eventJSON.name.includes("Pre-Season")) {
                continue;
            } else {
                // console.log(eventJSON);
                var startDate = parseDate(eventJSON.start_date);
                if (getDaysBetween(startDate) > 0) {
                    if (x != 0) {
                        eventJSON = getEventJSON(seasonJSON.eventoccurrence_urls[x - 1]);
                    }
                    break;
                }
            }
        }
    } else {
        for (var x = 0; x < seasonJSON.eventoccurrence_urls.length; x++) {
            var eventJSON = getEventJSON(seasonJSON.eventoccurrence_urls[x]);
            eventJSON.name = eventJSON.name.toLowerCase();
            eventJSON.official_name = eventJSON.official_name.toLowerCase();

            event = event.toLowerCase();
            if (eventJSON.name.includes(event)
                || eventJSON.official_name.includes(event)
            ) {
                break;
            } else {
                // handle not found
                console.log("event not found");
            }

        }
    }
    console.log("Event : " + eventJSON.name);
    console.log(eventJSON);

    //searching session

    if (session === "last") {
        for (var x = eventJSON.sessionoccurrence_urls.length - 1; x > -1; x--) {
            var sessionJSON = getSessionJSON(eventJSON.sessionoccurrence_urls[x]);
            console.log(sessionJSON.name);
            if (sessionJSON.slug.includes("high-speed-test")


            ) {

                console.log("*skipped - no content");
                continue;
            } else {
                if (f1 === true) {
                    // console.log(sessionJSON.session_name);
                    if (!sessionJSON.name.includes("F1") // needs fiddling


                    ) {
                        console.log("*skipped- not f1");
                        continue;
                    }
                }
            }

            var start_time = new Date(sessionJSON.start_time)
            if (getDaysBetween(start_time) <= 0) {
                console.log("*found last race");
                console.log("days between" + getDaysBetween(start_time))
                break;
            }
        }
    } else {
        for (var x = eventJSON.sessionoccurrence_urls.length - 1; x > -1; x--) {
            var sessionJSON = getSessionJSON(eventJSON.sessionoccurrence_urls[x]);
            sessionJSON.name = sessionJSON.name.toLowerCase();
            sessionJSON.session_name = sessionJSON.session_name.toLowerCase();
            if (sessionJSON.session_name.includes(session)
                || sessionJSON.name.includes(session)
            ) {
                if (f1) { // NEEDS TESTING 
                    if (!sessionJSON.name.includes("f1")
                        || sessionJSON.name.includes("f2")
                        || sessionJSON.name.includes("f3")

                    ) {
                        console.log("*skipped :" + sessionJSON.name);
                        continue;
                    }
                }
                console.log("found event");
                break;
            } else {
                console.log("*skipped :" + sessionJSON.name);
                continue;
            }

        }
    }

    console.log("Session : " + sessionJSON.name);
    console.log(sessionJSON);

    //search streams
    var sessionStreamJSON = getSessionStreamsJSON(sessionJSON.slug);
    sessionStreamJSON = sessionStreamJSON.objects[0];
    if (stream === "Main Feed") {
        for (var x = sessionStreamJSON.channel_urls.length - 1; x > -1; x--) {
            if (sessionStreamJSON.channel_urls[x].name.includes(stream)) {
                sessionStreamJSON.channel_urls[x].self = getPlayableURL(sessionStreamJSON.channel_urls[x].self);
                console.log("found*");
                console.log(sessionStreamJSON.channel_urls[x].name);
                console.log(sessionStreamJSON.channel_urls[x]);
                found = sessionStreamJSON.channel_urls[x];
                break;
            }
        }
    } else {
        stream = stream.toLowerCase();
        for (var x = 0; x < sessionStreamJSON.channel_urls.length; x++) {
            sessionStreamJSON.channel_urls[x].name = sessionStreamJSON.channel_urls[x].name.toLowerCase();
            sessionStreamJSON.channel_urls[x].slug = sessionStreamJSON.channel_urls[x].slug.toLowerCase();
            if (sessionStreamJSON.channel_urls[x].name.includes(stream)
                || sessionStreamJSON.channel_urls[x].slug.includes(stream)
            ) {
                sessionStreamJSON.channel_urls[x].self = getPlayableURL(sessionStreamJSON.channel_urls[x].self);
                console.log("found*");
                console.log(sessionStreamJSON.channel_urls[x].name);
                console.log(sessionStreamJSON.channel_urls[x]);
                found = sessionStreamJSON.channel_urls[x];

                break;
            }

        }
    }

    if (found === null) {

    } else {
        var file = getFixedArray(found.self);
        var file = createFile(file);
        return file;

    }
    console.log("test");


}
function getm3u8asArray(url) {
    var m3u8response = getRequest(url);
    return m3u8response.split("\n");

}
function getFixedArray(url) {
    var array = getm3u8asArray(url);

    var newArray = new Array;

    var urlRegex = RegExp(`[^\/]*$`);
    url = url.replace(urlRegex, "");
    for (var x = 0; x < array.length; x++) {

        var oldLine = array[x];
        var newLine = "";
        if (!oldLine.includes("https")) {

            if (oldLine.length > 6 &&
                (
                    oldLine.substring(0, 5) === "layer" ||
                    oldLine.substring(0, 4) === "clip" ||
                    oldLine.substring(0, 3) === "OTT"

                )) {
                newLine = url + oldLine;

            } else {
                var regex = RegExp(`[^"]*m3u8`);

                var temp = oldLine.match(regex);
                newLine = oldLine.replace(regex, url + temp);

            }


        }

        if (newLine === "") {
            newArray.push(oldLine)
        } else {
            var regex2 = RegExp(`https:\/\/f1tv-cdn[^\.]*\.formula1\.com`);

            newLine = newLine.replace(regex2, "https://f1tv.secure.footprint.net")

            newArray.push(newLine);

        }
        //   console.log(newArray[newArray.length-1]);
    }

    return newArray;


}
function createFile(array) {
    var arrayStr = "";
    for (var x = 0; x < array.length; x++) {
        arrayStr += array[x];
        arrayStr += "\n";
    }
    var fileBlob = new Blob([arrayStr]);
    //var fileurl = window.webkitURL.createObjectURL(fileBlob);
    var newFile = new File(array, "master.m3u8");

    var data = new Blob([arrayStr], { type: 'video/m3u8' });

    return window.URL.createObjectURL(data);



}
function downloadFile(file) {
    var a = document.createElement("a");
    url = URL.createObjectURL(file);
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();

}
function getRequest(URL) {
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open("GET", cors + URL, false);
    xmlHTTP.send(null);
    return xmlHTTP.responseText;
}
function getSeasonsJSON() {
    var seasonJSON = JSON.parse(getRequest(seasonUrl));
    seasonJSON = seasonJSON.objects;
    return seasonJSON;
}

function getEventJSON(eventoccurrence_url) {
    var eventURL = cors + urlStart + eventoccurrence_url;
    var eventJSON = JSON.parse(getRequest(eventURL));
    return eventJSON;
}

function getSessionJSON(sessionoccurence_url) {
    var sessionURL = urlStart + sessionoccurence_url;
    var sessionJSON = JSON.parse(getRequest(sessionURL));
    return sessionJSON;
}
function getSessionStreamsJSON(slug) {
    var sessionStreamURL = sessionURLstart + slug;
    var sessionStreamJSON = JSON.parse(getRequest(sessionStreamURL));
    for (var x = 0; x < sessionStreamJSON.objects[0].channel_urls.length; x++) {
        //console.log(sessionStreamJSON.objects[0].channel_urls[x].name);
        switch (sessionStreamJSON.objects[0].channel_urls[x].name) {
            case "WIF":
                sessionStreamJSON.objects[0].channel_urls[x].name = "Main Feed"
                break;
        }
    }
    return sessionStreamJSON;
}
function addCorrectURLs(sessionStreamJSON) {
    sessionStreamJSON.objects[0].urls = new Array(sessionStreamJSON.objects[0].channel_urls.length);
    for (var x = 0; x < sessionStreamJSON.objects[0].channel_urls.length; x++) {
        var fixedURLtoAdd = getPlayableURL(sessionStreamJSON.objects[0].channel_urls[x].self);

        sessionStreamJSON.objects[0].urls[x] = fixedURLtoAdd;


        // MAYBE CHANGE
        sessionStreamJSON.objects[0].channel_urls[x].self = fixedURLtoAdd;
        //  sessionStreamJSON.objects[0].channel_urls.fixed = fixedURLtoAdd;

    }
    return (sessionStreamJSON.objects[0]);
}

function getPlayableURL(assetID) { // add own function for post request 
    //console.log("ASSET ID : " + assetID);
    var url = "https://f1tv.formula1.com/api/viewings/";
    //var assetID = "/api/channels/chan_9b01938bf1e94d2c942c34a74ea83636/";

    var formattedID = "";
    var isChannel = false;
    if (assetID.includes("/api/channels/")) {
        isChannel = true;
        formattedID = `{"channel_url":"` + assetID + `"}`
    } else {
        formattedID = `{"asset_url":"` + assetID + `"}`
    }

    var data = JSON.parse(formattedID);

    x = formattedID;
    var xhr = new XMLHttpRequest();

    xhr.open('POST', cors2 + url, false);

    xhr.send(x);
    // if (xhr.status !== 200) {
    //     console.log(xhr.responseText);
    // }
    var respData = xhr.responseText;

    if (respData.includes("form_validation_errors")) {

        return -1;

    }
    // console.log(respData);
    var respJSON = JSON.parse(respData);
    if (isChannel) {
        return respJSON.tokenised_url;
    } else {
        console.log("************");
        console.log(respJSON);
        return -2;
    }




}




function parseDate(dateString) {
    var parts = dateString.split("-");
    var date = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
    return date;

}
function isWithinWeek(date) {
    var now = new Date();
    // console.log(now);
    //console.log(date);
    var seconds = parseInt((date - now) / 1000);
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    //console.log(days);
    if (days < 7) {
        return true;
    }
    return false;
}
function getDaysBetween(date) {
    var now = new Date();
    // console.log(now);
    //console.log(date);
    var seconds = parseInt((date - now) / 1000);
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    //console.log(days);
    return days;
}
function testingTeamRadio() {
    //     var season = seasonsToArray()[1];
    //     var event = eventsToArray(season.eventoccurrence_urls)[0];
    //    // console.log(event);
    //     var session = sessionsToArray(event.sessionoccurrence_urls)[4];

    //     var slug = session.slug;
    var slug = "2019-australian-grand-prix-race";
    var file = getSessionTeamRadio(slug);
    console.log(file);
    return file;
}
function getSessionTeamRadio(slug, seperate) {
    console.log(slug);
    var allDrivers = new Array();
    var videoFiles = new Array();
    var sessionStreamsArray = sessionStreamsToArray(slug);
    console.log(sessionStreamsArray.length);
    var test = 0;
    for (var x = 0; x < sessionStreamsArray.length; x++) {
        var name = sessionStreamsArray[x].name;
        if (name !== "pit lane"
            && name !== "driver"
            && name !== "data"
        ) {
            if (name === "Main Feed") {
                for (var a = 0; a < sessionStreamsArray[x].file.length; a++) {
                    if (sessionStreamsArray[x].file[a].includes("BANDWIDTH")&&sessionStreamsArray[x].file[a+1].includes("AUDIO")) { // change this to get rid of audio stream
                        videoFiles.push(sessionStreamsArray[x].file[a]);
                        videoFiles.push(sessionStreamsArray[x].file[a + 1]);
                        console.log(videoFiles)
                    }
                }
                console.log(sessionStreamsArray[x]);
            } else {


                allDrivers.push(sessionStreamsArray[x]);
                test++;
            }
        }
    }
    console.log("Number of drivers: " + test)
    //console.log(allDrivers);
    var allTeamRadio = new Array();
    for (var y = 0; y < allDrivers.length; y++) {
        for (var x = 0; x < allDrivers[y].file.length; x++) {
            if (allDrivers[y].file[x].toLowerCase().includes("teamradio")) {
                allTeamRadio.push({
                    name: allDrivers[y].name,
                    url: allDrivers[y].file[x],
                })
            }
        }
    }
    if (!seperate) {
        var finalFile = new Array();
        finalFile.push("#EXTM3U");
        finalFile.push("#EXT-X-INDEPENDENT-SEGMENTS"); // change to seperate file per driver // return array of blobs
        for (var x = 0; x < allTeamRadio.length; x++) {
            allTeamRadio[x].url = allTeamRadio[x].url.replace("TeamRadio", allTeamRadio[x].name);
            finalFile.push(allTeamRadio[x].url);
        }
        for (var x = 0; x < videoFiles.length; x++) {
            finalFile.push(videoFiles[x]);
        }
        // for(var x=0; x<finalFile.length; x++){
        //   //  console.log(finalFile[x]);
        // }
        return createFile(finalFile);

    } else {

    }



}
