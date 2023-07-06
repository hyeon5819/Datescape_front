let access = localStorage.getItem("access")

window.onload = async function () {
    getmyprofile()
}

// 프로필 수정페이지 팝업
function profileedit_win_open() {
    let url = "/templates/profileedit.html";
    let name = "프로필 수정 페이지";
    let option = "width = 550, height = 600, top = 100, left = 200, location = no";
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