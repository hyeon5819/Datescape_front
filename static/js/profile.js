let access = localStorage.getItem("access")


window.onload = async function () {
    getmyprofile()
    if (access) {
        onuser_activite()
    }

}
async function handleLogout() {
    alert("로그아웃!")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.href = `${front_base_url}/index.html`;
}

// 테스트
function autologout() {
    confirm("60초뒤 로그아웃 됩니다. 연장을 원하시면 확인을 눌러주세요")
}

// 자동로그인 테스트
var logoutUser = false;
var timeoutHnd = null;
var logouTimeInterval = 24 * 60 * 60 * 1000; // 24 hour -> ms
function onuser_activite() {
    if (logoutUser) {
        OnTimeoutReached();
    }
    else {
        ResetLogOutTimer();
    }
}

// 타임아웃 도달
function OnTimeoutReached() {
    logoutUser = true;
    handleLogout()
    alert("자동로그아웃되었습니다. 다시 로그인 해주세요!");
    window.location.href = "/";
}
function ResetLogOutTimer() {
    clearTimeout(timeoutHnd);
    // set new timer
    timeoutHnd = setTimeout('OnTimeoutReached();', logouTimeInterval);
}


document.body.onclick = onuser_activite;
timeoutHnd = setTimeout('OnTimeoutReached();', logouTimeInterval);


// 프로필 수정페이지 팝업
function profileedit_win_open() {
    let url = "/templates/profileedit.html";
    let name = "프로필 수정 페이지";
    let option = "width = 500, height = 500, top = 100, left = 200, location = no";
    window.open(url, name, option)
}

// my프로필 정보 가져오기
async function getmyprofile() {
    let payload = localStorage.getItem("payload")
    let payload_parse = JSON.parse(payload);
    let access = localStorage.getItem("access")
    const login_type = payload_parse.login_type

    const response = await fetch(`${back_base_url}/users/profile/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: 'GET',
    })

    const result = await response.json()

    let profileimage = result.profileimage
    let profileimageurl = result.profileimageurl


    const email = document.getElementById('email')
    const username = document.getElementById('username')
    const nickname = document.getElementById('nickname')
    const image = document.getElementById('image')

    email.innerText = result['email']
    username.innerText = result['username']
    nickname.innerText = result['nickname']

    if (profileimage !== null) {
        image.setAttribute("src", `${image_url}` + result.profileimage)

    }
    else if (profileimage == null) {
        image.setAttribute("src", result.profileimageurl)
    }
    else {
        image.setAttribute("src", "../static/images/default.png")
    }
}

// 일반로그인 회원 => 프로필이미지 있음
// 소셜로그인 회원 => 초기 세팅 - 프로필이미지 없음, 프로필이미지url있음
// 프로필수정시, 프로필 이미지 있음
// 프로필 이미지, 프로필url 모두 없으면 default이미지

// 프로필 정보 수정
async function profileedit() {
    const formData = new FormData();

    const nickname = document.getElementById("nickname").value
    const profileimage = document.getElementById("profileimage").files[0]

    formData.append("nickname", nickname);
    if (profileimage) {
        formData.append("profileimage", profileimage);
    }

    const response = await fetch(`${back_base_url}/users/profile/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: 'PUT',
        body: formData
    })

    const result = await response.json()

    if (response.status == 200) {
        localStorage.setItem("access", result[2]);
        localStorage.setItem("refresh", result[1]);

        const base64Url = result[2].split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload);
        alert("프로필수정완료!")
        win_close()
        opener.location.reload();
    } else {
        alert(JSON.stringify(result))
        window.location.reload()
    }
}

/* 썸네일 미리보기 함수 */
function setThumbnail(event) {
    var reader = new FileReader();

    reader.onload = function (event) {
        // 화살표 추가
        let icon = document.createElement("text");
        icon.innerText = '▼   ▼   ▼   ▼   ▼';
        icon.style.font = "50px solid";
        icon.style.margin = "0 50px 0 50px";
        icon.style.textAlign = "center";
        icon.style.color = "red";

        var img = document.createElement("img");
        img.setAttribute("src", event.target.result);

        // 썸네일 크기 조절
        img.style.width = "300px"; // 너비 200px로 설정
        img.style.height = "auto"; // 높이 자동 설정
        img.style.border = "3px dashed red";
        img.style.margin = "0 50px 0 50px";
        document.querySelector("div#image_container").appendChild(icon);
        document.querySelector("div#image_container").appendChild(img);
    };

    reader.readAsDataURL(event.target.files[0]);
}