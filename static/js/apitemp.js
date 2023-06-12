let token = localStorage.getItem("access")

// 현재 로그인 유저
let payload = localStorage.getItem("payload");
let payload_parse = JSON.parse(payload);
let current_user = payload_parse.username;
// console.log(payload, payload_parse, current_user)
console.log("현재 로그인한//" + current_user)

// 이메일 유효성 검사
function CheckEmail(str) {
    var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg_email.test(str)) {
        return false;
    } else {
        return true;
    }
}

// 비밀번호 유효성 검사
function checkPw() {
    let id = $("#username").val();
    let pw = $("#password1").val();
    let number = pw.search(/[0-9]/g);
    let english = pw.search(/[a-z]/ig);
    let spece = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (pw.length < 8 || pw.length > 20) {
        alert("8자리 ~ 20자리 이내로 입력해주세요.");
        return false;

    } else if (pw.search(/\s/) != -1) {
        alert("비밀번호는 공백 없이 입력해주세요.");
        return false;

    } else if (number < 0 || english < 0 || spece < 0) {
        alert("영문,숫자,특수문자를 혼합하여 입력해주세요.");
        return false;

    } else if ((number < 0 && english < 0) || (english < 0 && spece < 0) || (spece < 0 && number < 0)) {
        alert("영문,숫자, 특수문자 중 2가지 이상을 혼합하여 입력해주세요.");
        return false;

    } else if (/(\w)\1\1\1/.test(pw)) {
        alert('같은 문자를 4번 이상 사용하실 수 없습니다.');
        return false;

    } else if (pw.search(id) > -1) {
        alert("비밀번호에 아이디가 포함되었습니다.");
        return false;
    } else {
        alert("비밀번호가 정상적으로 입력되었습니다.");
        return true;
    }

    if (false === reg.test(pw)) {
        alert('비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.');
        return false;
    } else {
        alert("비밀번호가 정상적으로 입력되었습니다.");
        return true;
    }

}

// 회원가입
async function handleSignin() {
    const email = document.getElementById("email").value
    const email_ = document.getElementById("email")
    const username = document.getElementById("username").value
    const password1 = document.getElementById("password1").value
    const password2 = document.getElementById("password2").value
    console.log(email_, email, username, password1, password2)

    if (password2 !== password1) {
        alert("비번 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
        // } else if (!checkPw(password1)) {
        //     alert("비번 유효성 검사 잘못된입력입니다. 확인해주세요.")
        //     window.location.reload()
    } else if (!email || !username || !password1 || !password2) {
        alert("공란 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    } else if (!CheckEmail(email)) { // 존재한다면 -1이 아닌 숫자가 반환됨
        alert("이메일 형식이 아닙니다.");
        email_.focus();
        console.log(email_)
        return false;
    }

    const response = await fetch(`${back_base_url}/users/sign-up/`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "username": username,
            "password": password1
        })

    })
    let result = await response.json();
    console.log(result)
    console.log(JSON.stringify(result))

    if (response.status == 201) {
        // alert("이메일을 확인해주세요.")
        alert("회원가입이 완료되었습니다")
        window.location.replace(`${front_base_url}/templates/logintemp.html`)
    } else {
        console.log(response.status)
        alert(JSON.stringify(result))
        window.location.reload()
    }

}

// 이메일 인증 재전송-미완성
async function handleEmailValify() {
    const email = document.getElementById("email").value
    console.log(email)

    const response = await fetch(`${back_base_url}/users/dj-rest-auth/registration/resend-email/`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
        })
    })
    console.log(response)
    let result = await response.json();
    console.log(result)
    console.log(JSON.stringify(result))

    if (response.status == 200) {
        alert("이메일을 확인해주세요.")
        window.location.replace(`${front_base_url}/templates/logintemp.html`)
    } else {
        console.log(response.status)
        alert(JSON.stringify(result))
        window.location.reload()
    }

}

// 로그인
async function handleLogin() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password1").value
    console.log(username, password)

    const response = await fetch(`${back_base_url}/users/log-in/`, {
        headers: {
            "Content-Type": "application/json",

        },
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })

    const result = await response.json()

    console.log(result)

    if (response.status == 200) {
        localStorage.setItem("access", result.access);
        localStorage.setItem("refresh", result.refresh);

        const base64Url = result.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload);
        alert("로그인되었습니다.")
        window.location.replace(`${front_base_url}/index.html`)
    } else {
        console.log(response.status)
        alert(JSON.stringify(result))
        window.location.reload()
    }

}

// 로그아웃
async function handleLogout() {
    alert("로그아웃!")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.reload();
}

// 비번변경-로그인된 상태에서
async function pschange() {
    const password1 = document.getElementById("password1").value
    const password2 = document.getElementById("password2").value
    console.log(password1, password2)

    if (password2 !== password1) {
        alert("비번 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    } else if (!password1 || !password2) {
        alert("공란 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    }

    const response = await fetch(`${back_base_url}/users/dj-rest-auth/password/change/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",

        },
        method: 'POST',
        body: JSON.stringify({
            "new_password1": password1,
            "new_password2": password2
        })
    })

    const result = await response.json()
    console.log(result)

    if (response.status == 200) {
        console.log(response)
        alert("비밀번호가 변경되었습니다.")
        window.location.replace(`${front_base_url}/index.html`)
    } else {
        console.log(result)
        console.log(response.status)
        alert(JSON.stringify(result))
        window.location.reload()
    }

}
