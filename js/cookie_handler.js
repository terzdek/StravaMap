
// Delete the two token cookies
function delete_cookies(){
    set_cookie("access_token", "", 0)
    set_cookie("refresh_token", "", 0)
    set_cookie("activities", "", 0)
    set_cookie("user", "", 0)
}

// remove cookies and reload
function disconnect(){
    delete_cookies()
    localStorage.removeItem("activities");
    window.location.assign(location.protocol + '//' + location.host + location.pathname)
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
