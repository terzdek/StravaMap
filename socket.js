// Redirect to strava Oauth site to get access code. Then redirect back to homepage
function OauthRedirect() {
    params = {
        'client_id':'32029',
        'redirect':'http://localhost/StravaMap', 
        'approval_prompt':'auto',
        'response_type':'code',
        'scope':"read,activity:read_all,profile:read_all,read_all"
    }

    window.location.assign("http://www.strava.com/oauth/authorize?" + 
        "client_id=" + params['client_id'] +
        "&response_type="+ params['response_type'] +
        "&redirect_uri="+ params['redirect']  +
        "&approval_prompt="+ params['approval_prompt']  +
        "&scope=" + params['scope'])
}

// perform a get api call
function get_api(type, params, callback=function(json){},fullurl='https://www.strava.com/api/v3/'){
    var req = new XMLHttpRequest();
    url = fullurl + type + '?'
    $.each(params, function( k, v ) {
        url += k +"=" + v + "&"
    })
    console.log("GET " + url)
    req.open('GET', url, true);

    req.onreadystatechange = function() {
        if(req.readyState === 4){     
            if(req.status == 200) {
                callback(req.responseText)
            }else{
                console.log("Error during " + url)
                console.log("Status de la réponse: %d (%s)", req.status, req.statusText)
            }
        }   
    }

    req.send()
}

// perform a get api call
function post_api(type, params, callback=function(json){}, fullurl='https://www.strava.com/api/v3/'){
    var req = new XMLHttpRequest();
    url = fullurl + type + '?'
    $.each(params, function( k, v ) {
        url += k +"=" + v + "&"
    })
    req.open('POST', url, true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onreadystatechange = function() {
        if(req.readyState === 4){     
            if(req.status == 200) {
                callback(req.responseText)
            }else{
                console.log("Error during " + url)
                console.log("Status de la réponse: %d (%s)", req.status, req.statusText)
            }
        }   
    }

    req.send(params)
}