window.onload = async function () {
    console.log("profile 페이지!!")
    getmyprofile()
}

// my프로필 정보 가져오기
async function getmyprofile() {
    let payload = localStorage.getItem("payload")
    let payload_parse = JSON.parse(payload);
    let access = localStorage.getItem("access")
    console.log(payload_parse.login_type)

    const imageorurl = payload_parse.login_type

    const response = await fetch(`${back_base_url}/users/profile/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
    })

    const result = await response.json()

    // console.log(result)
    // console.log(result.email)
    // console.log(result.username)
    // console.log(result.profileimage)
    // console.log(result.profileimageurl)
    // console.log(result.profileimage.split('/media/')[1])
    // console.log(result.profileimage.split('/media/'), 1)
    const email = document.getElementById('email')
    const username = document.getElementById('username')
    const profileimage = document.getElementById('profileimage')

    email.innerText = result['email']
    username.innerText = result['username']

    // profileimage.setAttribute("imageURL", "result.profileimage.split('/media/')[1]")

    if (imageorurl == "normal") {
        profileimage.setAttribute("src", `${image_url}` + result.profileimage)
    }
    else if (result.profileimage == '/media/profile/default.png') {
        profileimage.setAttribute("src", result.profileimageurl)
    }
    else {
        profileimage.setAttribute("src", `${image_url}` + result.profileimage)
    }



}

// 프로필 정보 수정
async function profileedit() {
    let url = "/templates/profileedit.html";
    let name = "프로필 수정 페이지";
    let option = "width = 500, height = 500, top = 100, left = 200, location = no";
    window.open(url, name, option)

    const response = await fetch(`${back_base_url}/users/profile/`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${access}`,
        },

    })




}

function win_close() {
    window.close()
}