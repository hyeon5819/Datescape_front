var IMP = window.IMP;

var today = new Date();
var hours = today.getHours(); // 시
var minutes = today.getMinutes();  // 분
var seconds = today.getSeconds();  // 초
var milliseconds = today.getMilliseconds();
var makeMerchantUid = hours + minutes + seconds + milliseconds;


function requestPay() {
    console.log('usr_id', userId)
    console.log('emo_id', emoticonId)
    
    const emoticonName = document.getElementById('title').innerText

    IMP.init("imp55467334"); // 가맹점 식별코드
    IMP.request_pay({
        pg: 'kakaopay.TC0ONETIME', // PG사 코드표에서 선택
        pay_method: 'card', // 결제 방식
        merchant_uid: "IMP" + makeMerchantUid, // 결제 고유 번호
        name: `${emoticonName}`, // 제품명
        amount: 1004, // 가격
        // buyer_email : 'test@test.com',
        // buyer_name : '르탄이',
        // buyer_tel : '010-1234-5678',
        // buyer_addr : '서울특별시 강남구 삼성동',
        // buyer_postcode : '123-456',
        // m_redirect_url : `${front_base_url}/`, // 예: https://www.my-service.com/payments/complete/mobile
        // bypass : {
        //     site_logo : '{상점의 로고가 있는 정확한 URL}'  // 설정 시 결제 창 왼쪽 상단에 로고를 띄웁니다. 결제 창 호출이 느려질 수 있으며 150 X 50 미만 GIF, JPG 파일만 지원.
        // }
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
        } else {
            alert('뭔가 잘못됐을걸요.. 이거 만나면 알려주세요..')
            console.log(rsp);
        }
    });
}
