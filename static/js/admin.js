// 관리자 유저인지 확인
if (!localStorage.getItem("access")) {
    alert("로그인이 필요합니다.")
    window.location.href = `${front_base_url}/templates/logintemp.html`
} else{
    const payload = localStorage.getItem("payload");
    const payloadParse = JSON.parse(payload)

    if (payloadParse.is_admin == false){
        alert("관리자만 접근 가능합니다.")
        window.location.href = `${front_base_url}/`
    }
}
