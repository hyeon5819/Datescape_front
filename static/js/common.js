/** 권한 확인 - 현재 로그인된 유저 정보 확인*/
async function isLogin() {
    let access = localStorage.getItem("access")

    // if (!access) {
    //     alert("isLn: 로그인 후 이용가능합니다.");
    //     window.location.href = `${front_base_url}/templates/logintemp.html`
    // } else {
    // alert("isLn: 확인중");
    const response = await fetch(`${back_base_url}/users/islogin/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
    });

    const result = await response.json()

    if (response.status == 200) {
        console.log("common")
        console.log("is_admin:" + result.is_admin)
        console.log(result)
        localStorage.setItem("is_admin", result.is_admin)
        return result.is_admin;
    } else {
        // alert(response.status);
        alert("isLogin: 접근할수 없는 페이지 입니다.");
        window.location.href = `${front_base_url}/templates/logintemp.html`
    }
    // }


}

// isLogin();

var is_admin = isLogin()
console.log(is_admin)
// function islogin() {
//     let token = localStorage.getItem("access")

//     if (!token) {
//         alert("isLn: 접근할수 없는 페이지 입니다.");
//         window.location.href = `${front_base_url}/templates/logintemp.html`
//     }
// }

// islogin()