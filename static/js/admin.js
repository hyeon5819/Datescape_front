// 관리자 유저인지 확인
if (!localStorage.getItem("access")) {
    alert("로그인이 필요합니다.")
    window.location.href = `${front_base_url}/templates/logintemp.html`
} else {
    // const payload = localStorage.getItem("payload");
    // const payloadParse = JSON.parse(payload)
    // console.log(payloadParse)
    // if (payloadParse.is_admin == false) {
    //     window.location.href = `${front_base_url}/`
    // }
    alert("관리자 전용 입니다.\n현재 임시로 일반유저 진입 허용을 위한 버튼 노출 및 읽기전용 상태입니다.") // 임시 오픈, 추후 위에걸로 바꾸기
}
