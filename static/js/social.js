function oauthSignIn(key, redirecturi) {
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
    var params = {
        'client_id': key,
        'redirect_uri': redirecturi,
        'response_type': 'token',
        'scope': 'openid email profile',
        'include_granted_scopes': 'true',
        'state': 'pass-through value',
        'prompt': 'consent'
    };

    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
}


// login에서 import
export async function socialLogin(social) {
    const url = `${back_base_url}/users/social/`;
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",

        },
        method: 'POST',
        body: JSON.stringify({
            social,
        }),
    });
    if (response.status === 200) {
        const responseJson = await response.json();
        if (social == 'kakao-login') {
            window.location.href = responseJson.url;
        }
        if (social == 'google-login') {
            oauthSignIn(responseJson.key, responseJson.redirecturi)
        }
        if (social == 'naver-login') {
            window.location.href = responseJson.url;
        }
        if (social == 'github-login') {
            window.location.href = responseJson.url;
        }
    }
}


// index에서 import
export async function sendCode() {
    var currentUrl = window.location.href
    var urlWithoutQuery = currentUrl.split('?')[0]
    let social = null
    let code = new URLSearchParams(window.location.search).get('code')

    let state = null

    if (code) {
        let len = code.length
        state = new URLSearchParams(window.location.search).get('state')
        if (state) {
            social = 'naver-login'
        }
        else if (len == 20) {
            social = 'github-login'
        }
        else {
            // if (social !== 'github-login')
            //     social = 
            // else {
            social = 'kakao-login'
            // }
        }
    }
    else {
        social = 'google-login'
        urlWithoutQuery = currentUrl.split('#')[0]
        code = new URLSearchParams(location.href).get('access_token')
    }
    if (code) {
        const url = `${back_base_url}/users/${social}/`

        let body = { code, }
        if (state) {
            body.state = state
        }
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",

            },
            method: 'POST',
            body: JSON.stringify(body)
        })
        if (response.status == 200) {
            const response_json = await response.json()
            localStorage.setItem('refresh', response_json.refresh)
            localStorage.setItem('access', response_json.access)
            const base64Url = response_json.access.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''))
            localStorage.setItem('payload', jsonPayload)
            window.location.href = urlWithoutQuery
        }
    }
}


// var currentUrl = window.location.href
// var urlWithoutQuery = currentUrl.split('?')[0]
// if (response.status == 200) {
//     var currentUrl = window.location.href
//     let code = new URL(window.location.href)
//     let code_ = code.searchParams.get('code')
//     // let code = new URLSearchParams(window.location.search).get('code')
//     console.log(currentUrl)
//     console.log(code)
//     console.log(code_)
// }