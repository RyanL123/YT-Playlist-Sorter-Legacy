const api_key = "AIzaSyAgvRpnz1HdtHi4t8c4MgWneBay0HxAIcg"

function getJSON(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function getPlaylistJSON(){
    var playlistID = document.getElementById("playlist-id-input").value;
    var playlist = getJSON("https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&maxResults=25&playlistId=" + playlistID + "&key=" + api_key);
    return playlist;
}

function getVideoStats(videoID){
    var stats = getJSON("https://www.googleapis.com/youtube/v3/videos?part=statistics%2Csnippet&id=" + videoID +"&key=" + api_key)
    return stats;
}

function comp(a, b){
    return a.views - b.views;
}

function generateSortedPlaylist(mode){
    var playlist = JSON.parse(getPlaylistJSON());
    var videos = [];
    for (var i = 0; i < playlist.items.length; i++){
        var vid = playlist.items[i];
        var videoID = vid.snippet.resourceId.videoId;
        var views = JSON.parse(getVideoStats(videoID)).items[0].statistics.viewCount;
        var channel = JSON.parse(getVideoStats(videoID)).items[0].snippet.channelTitle;
        views = parseInt(views);
        videos.push({
            "views": views,
            "channel": channel,
            "video": playlist.items[i]
        });
    }
    if (mode == "d"){
        videos.sort(function comp(a, b){return a.views - b.views;});
    }
    else if (mode == "a"){
        videos.sort(function comp(a, b){return b.views - a.views;});
    }
    return videos;
}

function writePlaylistsIntoDOM(videos){
    var container = document.getElementById("results-table");
    $("#results-table").empty();
    for (var i = 0; i < videos.length; i++){
        var views = videos[i].views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
        var video = videos[i].video;
        var title = video.snippet.title;
        var thumbnail = video.snippet.thumbnails.medium.url;
        var channel = videos[i].channel;
        var link = "https://www.youtube.com/watch?v=" + video.snippet.resourceId.videoId;
        var row = container.insertRow(0);
        var description = row.insertCell(0);
        var image = row.insertCell(1);
        description.innerHTML = 
        "<div class=\"vid-description\">" +
        "<h1>" + 
        "<a href=\"" + link +"\" target=_blank>" + title + "</a>" + 
        "</h1>" +
        "<h2>" + channel + "</h2>" + 
        "<h3> Views: " + views + "</h3>" +
        "</div>";
        image.innerHTML = "<img src=\"" + thumbnail + "\">"
    }
}

var playlist = [];

function execute(){
    var modeSelector = document.getElementById("order");
    var mode = modeSelector.options[modeSelector.selectedIndex].value;
    playlist = generateSortedPlaylist(mode);
    writePlaylistsIntoDOM(playlist);
}

function rearrangeVideos(mode){
    if (mode == "d"){
        playlist.sort(function comp(a, b){return a.views - b.views;});
    }
    else if (mode == "a"){
        playlist.sort(function comp(a, b){return b.views - a.views;});
    }
    writePlaylistsIntoDOM(playlist);
}