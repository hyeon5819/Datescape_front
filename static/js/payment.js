var IMP = window.IMP;

var today = new Date();
var hours = today.getHours(); // 시
var minutes = today.getMinutes();  // 분
var seconds = today.getSeconds();  // 초
var milliseconds = today.getMilliseconds();
var makeMerchantUid = `${hours}` + `${minutes}` + `${seconds}` + `${milliseconds}`;

function kcpRequestPay(useremail, username, price) {
    if (localStorage.getItem("access")) { // 회원만 결제 가능
        if (confirm("구매 하시겠습니까?")) { // 구매 클릭시 한번 더 확인하기

            const emoticonName = document.getElementById('title').innerText

            IMP.init("imp55467334"); // 가맹점 식별코드
            IMP.request_pay({
                pg: 'kcp', // PG사 코드표에서 선택
                pay_method: 'card', // 결제 방식
                merchant_uid: "IMP" + makeMerchantUid + username, // 결제 고유 번호
                name: `${emoticonName}`, // 제품명
                amount: price, // 가격
                //구매자 정보 ↓
                buyer_email: `${useremail}`,
                buyer_name: `${username}`,
                // buyer_tel : '010-1234-5678',
                // buyer_addr : '서울특별시 강남구 삼성동',
                // buyer_postcode : '123-456'
            }, async function (rsp) { // callback
                if (rsp.success) { //결제 성공시
                    console.log(rsp);
                    const access = localStorage.getItem("access");
                    const userId = JSON.parse(localStorage.getItem("payload")).user_id;

                    //결제 성공시 DB저장, 새로고침
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

                    if (response.status == 200) { // DB저장 성공시
                        alert('결제 완료!')
                        window.location.reload();
                    } else { // 결제완료 후 DB저장 실패시
                        alert(`error:[${response.status}]\n결제요청이 승인된 경우 관리자에게 문의바랍니다.`);
                        // DB저장 실패시 status에 따라 추가적인 작업 가능성
                    }
                } else if (rsp.success == false) { // 결제 실패시
                    alert(rsp.error_msg)
                }
            });
        } else { // 구매 확인 알림창 취소 클릭시 돌아가기
            return false;
        }
    } else { // 비회원 결제 불가            
        alert('로그인이 필요합니다!')
    }
}
