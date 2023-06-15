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

const urlParams = new URLSearchParams(window.location.search);
const emoticonId = urlParams.get("emoticon_id");
const userId = JSON.parse(localStorage.getItem("payload")).user_id;


// 이모티콘 가져오기
async function getEmoticon(emoticon_id) {
    const access = localStorage.getItem("access");

    const response = await fetch(`${back_base_url}/emoticons/payment/admin/${emoticon_id}/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
    })

    if (response.status == 200) {
        response_json = await response.json();
        return response_json;
    } else {
        alert(response.status);
    }
}


// 판매량
function totalAmount(emoticon) {
    // console.log(emoticon)
    const amountTbody = document.getElementById('amount_div')

    const amountTr = document.createElement('tr')

    const monthTd = document.createElement('td')

    monthTd.innerText = '누적 총 계'

    const priceTd = document.createElement('td')
    priceTd.innerText = emoticon.price

    const countTd = document.createElement('td')
    if (emoticon.sold_count == null) {
        countTd.innerText = 0
    } else {
        countTd.innerText = emoticon.sold_count.length
    }

    const saleAmountTd = document.createElement('td')
    saleAmountTd.innerText = emoticon.price * emoticon.sold_count.length

    amountTbody.appendChild(amountTr)
    amountTr.appendChild(monthTd)
    amountTr.appendChild(priceTd)
    amountTr.appendChild(countTd)
    amountTr.appendChild(saleAmountTd)
    
    const tempTr = document.createElement('tr')
    amountTbody.appendChild(tempTr)
}


// 월별 판매량 검색
async function searchMonth(rsp) {
    const response = await rsp
    // 입력으로 조회
    const yearInput = document.getElementById('year')
    const monthInput = document.getElementById('month')

    console.log(yearInput.value)
    console.log(monthInput.value)

    console.log(response)
    // console.log(response.sold_count[0].created_at.split('-'))

    // 월별 판매량
    let sellNum = 0

    let alertStatus = ""

    for (let i = 0; i < response.sold_count.length; i++) {
        if (yearInput.value == response.sold_count[i].created_at.split('-')[0]) {
            if (monthInput.value == parseInt(response.sold_count[i].created_at.split('-')[1])) {
                sellNum += 1
            } else {
                alertStatus = "month_null"
            }
        } else {
            alertStatus = "year_null"
        }
    }
    if (alertStatus == "year_null"){
        alert('해당 년도 기록 없음!')
    } else if (alertStatus == "month_null"){
        alert('해당 월 기록 없음!')
    } else {
        //
        const amountTbody = document.getElementById('amount_div')

        amountTbody.childNodes[3].remove()

        const amountTr = document.createElement('tr')

        const monthTd = document.createElement('td')

        monthTd.innerText = yearInput.value + '/' + monthInput.value

        const priceTd = document.createElement('td')
        priceTd.innerText = response.price

        const countTd = document.createElement('td')
        countTd.innerText = response.sold_count.length

        const saleAmountTd = document.createElement('td')
        saleAmountTd.innerText = response.price * response.sold_count.length

        amountTbody.appendChild(amountTr)
        amountTr.appendChild(monthTd)
        amountTr.appendChild(priceTd)
        amountTr.appendChild(countTd)
        amountTr.appendChild(saleAmountTd)
    }
}


// 이모티콘 디테일
async function emoticonDeail() {
    const response = await getEmoticon(emoticonId)

    const emoticonTitle = document.getElementById('title')
    emoticonTitle.innerText = response.title

    const emoticonImages = document.getElementById('images')
    response.images.forEach(element => {
        const emoticonImage = document.createElement('img')
        emoticonImage.src = `${back_base_url}${element.image}`
        emoticonImage.setAttribute('alt', `${element.id}`)
        emoticonImage.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover;')
        emoticonImages.appendChild(emoticonImage)
    });

    totalAmount(response)

    const searchButton = document.getElementById('searchButton')
    searchButton.addEventListener('click', function(){
        if (response.sold_count == 0){
            alert('판매 기록이 없습니다!')
        } else{
            searchMonth(response)
        }
    })
}


emoticonDeail()
