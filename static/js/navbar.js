// includeHTML파일 대신 fetch로 뿌려주기 (컴포넌트화, 프로젝트 아키텍쳐)
async function injectNavbar() {
    fetch("../navbar.html").then(response => {
        return response.text()
    })
        .then(data => {
            document.querySelector("header").innerHTML = data;
        })
    let navbarHtml = await fetch("../navbar.html")
    let data = await navbarHtml.text()
    document.querySelector("header").innerHTML = data;

    // 1시간 마다 새로고침
    window.setTimeout('window.location.reload()', 3600000);

    const payload = localStorage.getItem("payload");

    if (payload == null) {
        injectFooter()
    }

    if (payload) {
        let payload_parse = JSON.parse(payload);
        let current_ = Math.floor((new Date()).getTime() / 1000)
        let exp = payload_parse.exp
        if (current_ > exp) {
            alert("대기 시간 초과로 자동 로그아웃 되었습니다.")
            handleLogout()
        }

        else if (exp - current_ < 100) {
            if (confirm("곧 자동 로그아웃됩니다. 연장하시겠습니까?")) {
                refresh()
            }
        }

    }

    if (payload) {
        const payload_parse = JSON.parse(payload)

        const intro = document.getElementById("intro")
        intro.innerText = `${payload_parse.nickname}님`

        const mypage = document.getElementById("mypage")
        mypage.innerText = "마이페이지"
        mypage.setAttribute("href", "/templates/profile.html")

        let navbarRight = document.getElementById("navbar-right")
        let newLi = document.createElement("li")
        newLi.setAttribute("class", "nav-item")

        let logoutBtn = document.createElement("button")
        logoutBtn.setAttribute("class", "nav-link btn text-white")
        logoutBtn.innerText = "로그아웃"
        logoutBtn.setAttribute("onClick", "handleLogout()")

        newLi.appendChild(logoutBtn)

        navbarRight.appendChild(newLi)


        let signInButton = document.getElementById("navbar-signin")
        signInButton.style.display = "none";
        let signUpButton = document.getElementById("navbar-signup")
        signUpButton.style.display = "none";

        if (payload_parse.is_admin == true) {
            const adminButton = document.getElementById("admin")
            adminButton.style.display = "block"
        }

        const access = localStorage.getItem('access')
        const response = await fetch(`${back_base_url}/alarms/unread/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "GET",
        })
        const data = await response.json()
        const alarmA = document.getElementById('alarm')
        if (data.unread == true) {
            alarmA.href = `${front_base_url}/user_alarm.html`
            alarmA.childNodes[0].src = "../static/images/new_alarm.png"
            alarmA.setAttribute('style', 'visibility: visible;')
        }
        else {
            alarmA.href = `${front_base_url}/user_alarm.html`
            alarmA.childNodes[0].src = "../static/images/none_alarm.png"
            alarmA.setAttribute('style', 'visibility: visible;')
        }
        injectFooter(alarmA.childNodes[0].src)
    }
}


async function injectFooter(img) {
    fetch("../footer.html").then(response => {
        return response.text()
    })
        .then(data => {
            document.querySelector("footer").innerHTML = data;
        })
    let footerHtml = await fetch("../navbar.html")
    let data = await footerHtml.text()

    if (img != undefined) {
        const alarmPopup = document.getElementById('alarm_popup')
        alarmPopup.href = `${front_base_url}/user_alarm.html`
        alarmPopup.setAttribute('style', 'visibility: visible;')
        if (img.split('/')[img.split('/').length - 1] == "new_alarm.png") {
            alarmPopup.childNodes[1].src = `${front_base_url}/static/images/new.png`
        } else {
            alarmPopup.childNodes[1].src = `${front_base_url}/static/images/none.png`
        }
    }

    // const payLoad = localStorage.getItem("payload")
    // if (payLoad) {
    //     const chatButton = document.getElementById('chat_popup')
    //     chatButton.setAttribute('style', 'visibility: visible;')
    //     chatButton.addEventListener('click', function () {
    //         window.open(`${front_base_url}/room.html`, "chat", "width=500, height=620, top=50, left=50")
    //     })
    // }
}


// async function noninjectFooter() {
//     fetch("../footer.html").then(response => {
//         return response.text()
//     })
//         .then(data => {
//             document.querySelector("footer").innerHTML = data;
//         })
//     let footerHtml = await fetch("../navbar.html")
// }

// function handleLogout() {
//     localStorage.removeItem("access")
//     localStorage.removeItem("refresh")
//     localStorage.removeItem("payload")
//     window.location.reload()
// }

async function handleLogout() {
    const refresh = localStorage.getItem("refresh")
    const response = await fetch(`${back_base_url}/users/logout/`, {
        headers: {
            "Content-Type": "application/json",

        },
        method: 'POST',
        body: JSON.stringify({
            "refresh": refresh
        })
    })

    const result = await response.json()

    if (response.status == 200) {
        alert("서비스를 이용해 주셔서 감사합니다.")
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        localStorage.removeItem("payload")
        window.location.href = `${front_base_url}`
    } else {
        alert(JSON.stringify(result))
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        localStorage.removeItem("payload")
        window.location.href = `${front_base_url}`
    }
}

injectNavbar();
// 로그인 연장
async function refresh() {
    const refresh = localStorage.getItem("refresh")

    const response = await fetch(`${back_base_url}/users/token/refresh/`, {
        headers: {
            "Content-Type": "application/json",

        },
        method: 'POST',
        body: JSON.stringify({
            "refresh": refresh
        })
    })
    const result = await response.json()

    if (response.status == 200) {
        localStorage.setItem("access", result.access);

        const base64Url = result.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload);
        alert("연장되었습니다.")
        window.location.href = `${front_base_url}`
    } else {
        alert(JSON.stringify(result))
        window.location.reload()
    }

}

async function isLogin() {
    let access = localStorage.getItem("access")

    // if (!access) {
    //     alert("isLn: 로그인 후 이용가능합니다.");
    //     window.location.href = `${front_base_url}/templates/logintemp.html`
    // } else {
    // alert("isLn: 확인중");
    if (access) {
        const response = await fetch(`${back_base_url}/users/islogin/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "GET",
        });
        const result = await response.json()

        if (response.status == 200) {
            localStorage.setItem("is_admin", result.is_admin)
            return result.is_admin;
        } else {
            // alert(response.status);
            alert("isLogin: 접근할수 없는 페이지 입니다.");
            window.location.href = `${front_base_url}/templates/logintemp.html`
        }
    }

    // }
}

// isLogin();

// var is_admin = isLogin()


// const h1 = document.createElement("h1");
// document.querySelector("body").prepend(h1);

// const getTime = () => {
//     const now = new Date();
//     let hours = now.getHours();
//     let minutes = now.getMinutes();
//     let seconds = now.getSeconds();
//     hours = hours < 10 ? `0${hours}` : hours;
//     minutes = minutes < 10 ? `0${minutes}` : minutes;
//     seconds = seconds < 10 ? `0${seconds}` : seconds;
//     h1.innerText = `${hours}:${minutes}:${seconds}`;
// };

// getTime();
// setInterval(getTime, 1000);
