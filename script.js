
// Delete the two token cookies
function delete_cookies(){
    set_cookie("access_token", "", 0)
    set_cookie("refresh_token", "", 0)
}

// remove cookies and reload
function disconnect(){
    delete_cookies()
    window.location.assign('http://localhost/StravaMap')
}

// Get token with and save it
function get_token(code){
    params = {
        'code': code,
        'client_id':'32029',
        'client_secret':'0565c2ccd75607aad3a021fd6d90b33a31a823f8',
        'grant_type': "authorization_code"
    }

    // set cookie of the two tokens and reload page
    set_token_cookie = function(json){
        json = JSON.parse(json)
        set_cookie("access_token", json["access_token"], json["expires_at"])
        set_cookie("refresh_token", json["refresh_token"], json["expires_at"]*2)
        location.reload()
    }
    // Post + Callback
    res = post_api('token', params, set_token_cookie, 'https://www.strava.com/oauth/')
}

// get arguments as dict from URL
function get_args(){
    var query = window.location.search.substring(1).split("&")
    var get_attrs = {}
    for (i=0; i<query.length; i++){
        tmp = query[i].split("=")
        get_attrs[tmp[0]] = tmp[1]
    }
    return get_attrs
}

// get the needed cookie 
function get_cookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function set_cookie(cname, cvalue, exdays) {
  var expires = "expires="+ exdays;
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
