let access = localStorage.getItem("access")


window.onload = async function () {
    console.log("profile 페이지!!")
    getmyprofile()
}

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
    console.log(payload_parse.login_type)

    const login_type = payload_parse.login_type

    const response = await fetch(`${back_base_url}/users/profile/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: 'GET',
    })

    const result = await response.json()

    // console.log(result)
    // console.log(result.email)
    // console.log(result.username)
    console.log(result.profileimage)
    // console.log(result.profileimageurl)
    // console.log(result.profileimage.split('/media/')[1])
    // console.log(result.profileimage.split('/media/'), 1)
    const email = document.getElementById('email')
    const username = document.getElementById('username')
    const profileimage = document.getElementById('profileimage')

    email.innerText = result['email']
    username.innerText = result['username']

    // profileimage.setAttribute("imageURL", "result.profileimage.split('/media/')[1]")

    if (login_type == "normal") {
        profileimage.setAttribute("src", `${image_url}` + result.profileimage)

    }
    else if (login_type == "kakao" || "google" || "github" || "naver") {
        profileimage.setAttribute("src", result.profileimageurl)
    }
    else {
        profileimage.setAttribute("src", "../static/images/default.png")
    }



}

// 프로필 정보 수정
async function profileedit() {
    const formData = new FormData();

    const username = document.getElementById("username").value
    const profileimage = document.getElementById("profileimage").files[0]

    formData.append("username", username);
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

    console.log(result)

    if (response.status == 200) {
        console.log(response)
        alert("프로필수정완료!")
        win_close()
    } else {
        console.log(result)
        console.log(response.status)
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