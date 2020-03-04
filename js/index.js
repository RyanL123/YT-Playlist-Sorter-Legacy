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

function sortVideos(videos, mode){
    if (mode == "d"){
        videos.sort(function comp(a, b){return a.views - b.views;});
    }
    else if (mode == "a"){
        videos.sort(function comp(a, b){return b.views - a.views;});
    }
    else if (mode == "ld"){
        videos.sort(function comp(a, b){return a.likes - b.likes});
    }
    else if (mode == "la"){
        videos.sort(function comp(a, b){return b.likes - a.likes});
    }
    else if (mode == "dd"){
        videos.sort(function comp(a, b){return a.dislikes - b.dislikes});
    }
    else if (mode == "da"){
        videos.sort(function comp(a, b){return b.dislikes - a.dislikes});
    }
}

function generateSortedPlaylist(mode){
    var playlist = JSON.parse(getPlaylistJSON());
    var videos = [];
    for (var i = 0; i < playlist.items.length; i++){
        var vid = playlist.items[i];
        var videoID = vid.snippet.resourceId.videoId;
        var video = JSON.parse(getVideoStats(videoID)).items[0];
        var views = video.statistics.viewCount;
        var channel = video.snippet.channelTitle;
        var likes = video.statistics.likeCount;
        var dislikes = video.statistics.dislikeCount;
        views = parseInt(views);
        videos.push({
            "views": views,
            "likes": likes,
            "dislikes": dislikes,
            "channel": channel,
            "video": playlist.items[i]
        });
    }
    sortVideos(videos, mode);
    return videos;
}

function writePlaylistsIntoDOM(videos){
    var container = document.getElementById("results-table");
    $("#results-table").empty();
    for (var i = 0; i < videos.length; i++){
        var views = videos[i].views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var likes = videos[i].likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
        var dislikes = videos[i].dislikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
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
        "<h3> Likes: " + likes + "</h3>" +
        "<h3> Dislikes: " + dislikes + "</h3>" +
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
    sortVideos(playlist, mode);
    writePlaylistsIntoDOM(playlist);
}