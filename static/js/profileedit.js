let access = localStorage.getItem("access")

let passwordbutton = document.getElementById("pschange")
passwordbutton.style.display = "block";

if (login_type !== "normal") {
    passwordbutton.style.display = "none";
}

function reg_imagefile() {
    var imgFile = $('#profileimage').val();
    var fileForm = /(.*?)\.(jpg|jpeg|png)$/;
    var maxSize = 3 * 1024 * 1024;
    var fileSize;

    if (imgFile != "" && imgFile != null) {
        fileSize = document.getElementById("profileimage").files[0].size;
        if (!imgFile.match(fileForm)) {
            alert("jpg, jpeg, png 파일만 업로드 가능합니다.")
            window.location.reload()
            return false;
        }
        else if (fileSize > maxSize) {
            alert("이미지 파일 사이즈는 3MB까지 가능합니다.")
            window.location.reload()
            return false;
        }
    }

}

// 프로필 정보 수정
async function profileedit() {
    const formData = new FormData();
    const pattern = /^[a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{3,20}$/;
    const nickname = document.getElementById("nickname").value
    const profileimage = document.getElementById("profileimage").files[0];
    if (!nickname && !profileimage) {
        alert("닉네임이나 프로필이미지를 변경해주세요.")
        return false
    }
    if (nickname) {
        if (!pattern.test(nickname)) {
            alert("닉네임은 한글, 영문, 숫자 3~20자 이내로 작성해주세요.")
            window.location.reload()
            return false;
        }

    }
    if (profileimage) {
        if (false === reg_imagefile(profileimage)) {
            window.location.reload()
            return false;
        }
        else if (true) {
            // alert("이미지 유효성 검사 완료!")
            formData.append("profileimage", profileimage);
        }
    }
    formData.append("nickname", nickname);

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

/** 회원탈퇴 */
function dropaccount() {
    if (window.confirm("DateScape를 ESCAPE하시겠습니까?")) {
        if (confirm("진짜로 탈퇴하실건가요?")) {
            if (confirm("다시한번 생각해보시겠어요?")) {
                // alert("다시 생각해 주세요")
                deleteaccount()
            } else {
                alert("다행입니다. 계속 저희 서비스를 이용해주세요!^*^!")
            }
        } else {
            alert("다행입니다. 계속 저희 서비스를 이용해주세요!^*^!")
        }
    } else {
        alert("다행입니다. 계속 저희 서비스를 이용해주세요!^*^!")
    }
}

function handleLogout() {
    // alert("로그아웃!")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    opener.location.href = `${front_base_url}/`
}

async function deleteaccount() {
    const response = await fetch(`${back_base_url}/users/profile/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: 'DELETE',
    })

    const result = await response.json()

    if (response.status == 200) {
        handleLogout()
        alert("그동안 DateScape를 이용해주셔서 감사합니다.")
        win_close()

    } else {
        alert(JSON.stringify(result))
        window.location.reload()
    }
}