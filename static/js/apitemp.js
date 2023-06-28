let token = localStorage.getItem("access")

// 현재 로그인 유저
let payload = localStorage.getItem("payload");
let payload_parse = JSON.parse(payload);
let current_user = payload_parse.username;
let login_type = payload_parse.login_type;
let last_login = payload_parse.last_login;
let current_ = Math.floor((new Date()).getTime() / 1000)
let exp = payload_parse.exp

console.log(exp - current_)

/** 이메일 유효성 검사 */
function CheckEmail(str) {
    var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg_email.test(str)) {
        return false;
    } else {
        return true;
    }
}

function win_close() {
    window.close()
}

/** 아이디 유효성 검사 */
function checkID() {
    console.log("아이디유효성검사")
    let id = $("#username").val();
    let number = id.search(/[0-9]/g);
    let english = id.search(/[a-z]/ig);

    if (id.length < 10 || id.length > 20) {
        alert("8자리 ~ 20자리 이내로 입력해주세요.");
        return false;

    } else if (id.search(/\s/) != -1) {
        alert("아이디는 공백 없이 입력해주세요.");
        return false;

    } else if (!english) {
        alert("영문만 가능합니다.");
        return false;
    }
    else if (number < 0) {
        alert("숫자로는 아이디를 생성할수 없습니다.");
        return false;
    } else if (number < 0 || english < 0) {
        alert("영문,숫자,특수문자를 혼합하여 입력해주세요.");
        return false;
    } else {
        alert("비밀번호가 정상적으로 입력되었습니다.");
        return true;
    }
}

/** 비밀번호 유효성 검사 */
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

    if (!email || !username || !password1 || !password2) {
        alert("공란 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    }
    else if (!checkPw(password1 || password2)) {
        alert("비번 유효성 검사 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    } else if (password2 !== password1) {
        alert("비번 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    } else if (!CheckEmail(email)) { // 존재한다면 -1이 아닌 숫자가 반환됨
        alert("이메일 형식이 아닙니다.");
        email_.focus();
        return false;
    } else if (!checkID(username)) {
        alert("아이디 유효성 검사 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    }

    if (checkPw) {
        alert("⏳잠시만 기다려 주세요")
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

    if (response.status == 201) {
        alert("로그인전에 이메일을 확인해주세요.")
        window.location.replace(`${front_base_url}/templates/logintemp.html`)
    } else {
        alert(JSON.stringify(result))
        window.location.reload()
    }

}

// 이메일 인증 재전송
async function handleEmailResend() {
    const email = document.getElementById("email").value

    alert("⏳잠시만 기다려 주세요")

    const response = await fetch(`${back_base_url}/users/resend/email/`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
        })
    })
    let result = await response.json();

    if (response.status == 200) {
        alert("이메일을 확인해주세요.")
        window.location.replace(`${front_base_url}/templates/logintemp.html`)
    } else {
        alert(JSON.stringify(result))
        window.location.reload()
    }

}

// 로그인
async function handleLogin() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password1").value

    if (!username || !password) {
        alert("공란 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    }

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
        alert(JSON.stringify(result))
        alert("이메일인증먼저해주세요!")
        alert("아이디, 비밀번호를 다시 확인해주세요!")
        window.location.reload()
    }

}

// 로그인 연장
// async function refresh() {
//     const refresh = localStorage.getItem("refresh")

//     const response = await fetch(`${back_base_url}/users/token/refresh/`, {
//         headers: {
//             "Content-Type": "application/json",

//         },
//         method: 'POST',
//         body: JSON.stringify({
//             "refresh": refresh
//         })
//     })



//     if (response.status == 200) {
//         alert("연장되었습니다.")
//         window.location.href = `${front_base_url}`
//     } else {
//         alert(JSON.stringify(result))
//         window.location.reload()
//     }

// }


// 로그아웃
async function handleLogout() {
    alert("로그아웃!")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.reload()
}

// 비번변경-로그인된 상태에서
async function pschange() {
    const password1 = document.getElementById("password1").value
    const password2 = document.getElementById("password2").value

    if (password2 !== password1) {
        alert("비번 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    } else if (!password1 || !password2) {
        alert("공란 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    }

    const response = await fetch(`${back_base_url}/users/password/change/`, {
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

    if (response.status == 200) {
        alert("비밀번호가 변경되었습니다.")
        opener.parent.location.reload();
        window.close()
        opener.parent.location.reload();
        handleLogout()
        opener.parent.location.reload();
    } else {
        alert(JSON.stringify(result))
        window.location.reload()
    }

}

// 아이디 찾기
async function findID() {
    const email = document.getElementById("email").value

    if (!email) {
        alert("가입하신 이메일을 입력해주세요")
        window.location.reload()
    }

    const response = await fetch(`${back_base_url}/users/find/id/`, {
        headers: {

            "Content-Type": "application/json",

        },
        method: 'POST',
        body: JSON.stringify({
            "email": email
        })
    })

    const result = await response.json()

    if (response.status == 200) {
        alert("아이디는      " + result)
        if (confirm("로그인 페이지로 이동하시겠습니까?")) {
            window.location.href = `${front_base_url}/templates/logintemp.html`
        }

    } else {
        alert("가입된 이메일이 없습니다. 다시확인해주세요.")
        window.location.reload()
    }
}


// 비밀번호 재설정 이메일 보내기
async function handleResetPasswordEmail() {
    const email = document.getElementById("email").value

    if (!email) {
        alert("가입하신 이메일을 입력해주세요")
        window.location.reload()
    }

    const response = await fetch(`${back_base_url}/users/password/reset/`, {
        headers: {

            "Content-Type": "application/json",

        },
        method: 'POST',
        body: JSON.stringify({
            "email": email
        })
    })

    const result = await response.json()

    if (response.status == 200) {
        alert("비밀번호 재설정 링크를 보내드렸습니다. 이메일을 확인해주세요!")

    } else {
        alert("가입된 이메일이 없습니다. 다시확인해주세요.")
        window.location.reload()
    }
}

// 비밀번호 초기화 이메일 인증 후 비밀번호 수정
async function handleResetPasswordChange() {
    const userpk = new URLSearchParams(window.location.search).get("uid")

    const password1 = document.getElementById("password1").value
    const password2 = document.getElementById("password2").value

    if (password2 !== password1) {
        alert("비번 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    } else if (!password1 || !password2) {
        alert("공란 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    }
    const response = await fetch(`${back_base_url}/users/password/reset/`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: 'PUT',
        body: JSON.stringify({
            "new_password1": password1,
            "new_password2": password2,
            "user_id": userpk
        })

    })

    const result = await response.json()


    if (response.status == 200) {
        alert("비밀번호가 변경되었습니다.")
        win_close()
    } else {
        alert(JSON.stringify(result))
        window.location.reload()
    }
}