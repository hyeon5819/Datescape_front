let token = localStorage.getItem("access")

if (token) {
    alert("접근할수 없는 페이지 입니다.")
    window.location.href = `${front_base_url}/`
}



/** 이메일 유효성 검사 */
function CheckEmail(str) {
    var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg_email.test(str)) {
        return false;
    } else {
        return true;
    }
}

/** 아이디 유효성 검사 */
function checkID(str) {
    console.log("아이디유효성검사")
    var regExp = /^[a-z]+[a-z0-9]{5,19}$/g;
    if (!regExp.test(str)) {
        return false;
    } else {
        return true;
    }
}


function win_close() {
    window.close()
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

    if (!checkID(username)) {
        alert("아이디는 소문자, 소문자+숫자 조합만 사용가능합니다.")
        window.location.reload()
        return false;
    }

    if (!email || !username || !password1 || !password2) {
        alert("공란 잘못된입력입니다. 확인해주세요.");
        window.location.reload();
        return false
    }
    if (!CheckEmail(email)) {
        email_.focus();
        alert("이메일 형식이 아닙니다.");
        window.location.reload();
        return false
    }
    if (password2 !== password1) {
        alert("비번 잘못된입력입니다. 확인해주세요.");
        window.location.reload();
        return false
    }
    if (!checkPw(password2)) {
        window.location.reload();
        return false
    } else if (true) {
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
        alert("로그인전에 가입하신 이메일 주소로 인증메일이 도착했습니다.          10분 내로 확인해 주세요!")
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
        alert("인증이메일은 확인하셨나요? 아이디, 비밀번호를 정확히 입력해주세요.")
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

    alert("⏳잠시만 기다려 주세요")

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
    var regExp = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
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

    else if (!regExp.test(password2)) {
        alert("비번 유효성 검사 실패")
        return false;
    }

    alert("⏳잠시만 기다려 주세요")

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
    alert("⏳잠시만 기다려 주세요")

    const result = await response.json()

    if (response.status == 200) {
        alert("⏳잠시만 기다려 주세요")
        alert("비밀번호가 변경되었습니다.")
        win_close()
    } else {
        alert("⏳잠시만 기다려 주세요")
        alert(JSON.stringify(result))
        window.location.reload()
    }
}