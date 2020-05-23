function getJSON(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function convertISOtoInt(ISODate){
    date = new Date(ISODate);
    return parseInt(date.getFullYear())*1000 + (parseInt(date.getMonth())+1)*100 + parseInt(date.getDate());
}

function convertISOtoString(ISODate){
    date = new Date(ISODate);
    year = parseInt(date.getFullYear());
    month = parseInt(date.getMonth());
    day = parseInt(date.getDate());
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month] + " " + day + ", " + year;
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
    else if (mode == "ud"){
        videos.sort(function comp(a, b){return convertISOtoInt(a.uploadDate) - convertISOtoInt(b.uploadDate) })
    }
    else if (mode == "ua"){
        videos.sort(function comp(a, b){return convertISOtoInt(b.uploadDate) - convertISOtoInt(a.uploadDate) })
    }
}

function generateSortedPlaylist(mode){
    document.getElementById("loading").style.display = "";
    var playlist = JSON.parse(getPlaylistJSON());
    var videos = [];
    for (var i = 0; i < playlist.items.length; i++){
        var vid = playlist.items[i];
        var videoID = vid.snippet.resourceId.videoId;
        var video = JSON.parse(getVideoStats(videoID)).items[0];
        var views = video.statistics.viewCount;
        var uploadDate = video.snippet.publishedAt;
        var channel = video.snippet.channelTitle;
        var likes = video.statistics.likeCount;
        var dislikes = video.statistics.dislikeCount;
        views = parseInt(views);
        videos.push({
            "views": views,
            "likes": likes,
            "dislikes": dislikes,
            "uploadDate": uploadDate,
            "channel": channel,
            "video": playlist.items[i]
        });
    }
    sortVideos(videos, mode);
    document.getElementById("loading").style.display = "none";
    return videos;
}

function writePlaylistsIntoDOM(videos){
    var container = document.getElementById("result");
    for (var i = 0; i < videos.length; i++){
        var views = videos[i].views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var likes = videos[i].likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var dislikes = videos[i].dislikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var uploadDate = videos[i].uploadDate;
        var video = videos[i].video;
        var title = video.snippet.title;
        var thumbnail = video.snippet.thumbnails.medium.url;
        var channel = videos[i].channel;
        var link = "https://www.youtube.com/watch?v=" + video.snippet.resourceId.videoId;
        container.innerHTML +=
        "<div class=\"row bg-light rounded mt-2 py-4 px-2\">" +
        "<div class=\"col-sm-8\">" +
        "<div class=\"vid-description\">" +
        "<h4>" +    
        "<a href=\"" + link +"\" target=_blank>" + title + "</a>" + 
        "</h4>" +
        "<h5>" + channel + "</h5>" + 
        "<h5> Upload Date: " + convertISOtoString(uploadDate) + "</h5>" +
        "<h5> Views: " + views + "</h5>" +
        "<h5> Likes: " + likes + "</h5>" +
        "<h5> Dislikes: " + dislikes + "</h5>" +
        "</div>" +
        "</div>" +
        "<div class=\"col-sm-4\">" +
        "<img class=\"rounded img-fluid mx-auto d-block\" src=\"" + thumbnail + "\">" +
        "</div>" +
        "</div>";
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