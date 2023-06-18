var IMP = window.IMP;

var today = new Date();
var hours = today.getHours(); // 시
var minutes = today.getMinutes();  // 분
var seconds = today.getSeconds();  // 초
var milliseconds = today.getMilliseconds();
var makeMerchantUid = `${hours}` + `${minutes}` + `${seconds}` + `${milliseconds}`;

function kcpRequestPay(useremail, username) {
    if(localStorage.getItem("access")){
        const emoticonName = document.getElementById('title').innerText

        IMP.init("imp55467334"); // 가맹점 식별코드
        IMP.request_pay({
            pg : 'kcp', // PG사 코드표에서 선택
            pay_method : 'card', // 결제 방식
            merchant_uid: "IMP"+makeMerchantUid, // 결제 고유 번호
            name : `${emoticonName}`, // 제품명
            amount : 100, // 가격
            //구매자 정보 ↓
            buyer_email : `${useremail}`,
            buyer_name : `${username}`,
            // buyer_tel : '010-1234-5678',
            // buyer_addr : '서울특별시 강남구 삼성동',
            // buyer_postcode : '123-456'
        }, async function (rsp) { // callback
            if (rsp.success) {
                console.log(rsp);
                console.log(typeof rsp);
                const access = localStorage.getItem("access");

                //결제성공시 DB저장, 새로고침

                const formData = new FormData();

                formData.append('emoticon_id', emoticonId)
                formData.append('user_id', userId)

                const response = await fetch(`${back_base_url}/emoticons/payment/`, {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();

                if (response.status == 200) {
                    alert('결제 완료!')
                    window.location.reload();
                } else if (response.status == 401) {
                    alert("로그인한 사용자만 이용 가능합니다.");
                } else {
                    alert("잘못 된 요청입니다.");
                }
            } else if (rsp.success == false) {
                alert(rsp.error_msg)
            } else {
                alert('뭔가 잘못됐을걸요.. 이거 만나면 알려주세요..')
                console.log(rsp);
            }
        });
    }
    else {
        alert('로그인이 필요합니다!')
    }
}
