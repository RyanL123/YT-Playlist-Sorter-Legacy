function getJSON(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function getPlaylist(){
    var playlistID = document.getElementById("playlist-id-input").value;
    var api_key = "AIzaSyAgvRpnz1HdtHi4t8c4MgWneBay0HxAIcg"
    var json = getJSON("https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&playlistId=" + playlistID + "&key=" + api_key);
}
