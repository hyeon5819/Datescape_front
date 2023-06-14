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


    // // 판매기록 전부 다 가져와서 판매 년 월 값 가져오기
    // const yearDiv = document.getElementById('year_pagenation')
    // const monthDiv = document.getElementById('month_pagenation')

    // let soldYear = []
    // let soldMonth = []

    // for (let i = 0; i < emoticon.sold_count.length; i++) {
    //     console.log('년도',emoticon.sold_count[i].created_at.split('-')[0])
    //     console.log('월',emoticon.sold_count[i].created_at.split('-')[1])

    //     if(soldYear.includes(emoticon.sold_count[i].created_at.split('-')[0])){
    //     }else {
    //         soldYear.push(emoticon.sold_count[i].created_at.split('-')[0])
    //     }

    //     if(soldMonth.includes(emoticon.sold_count[i].created_at.split('-')[1])){
    //     }else {
    //         soldMonth.push(emoticon.sold_count[i].created_at.split('-')[1])
    //     }
    // }
    // // 기록조회 버튼 넣어주기
    // console.log(soldYear)
    // console.log(soldMonth)
}


window.onload = async function () {
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
    searchButton.addEventListener('click', function () {
        // 입력으로 조회
        const yearInput = document.getElementById('year')
        const monthInput = document.getElementById('month')

        console.log(yearInput.value)
        console.log(monthInput.value)

        console.log(response.sold_count[0].created_at.split('-'))

        // 월별 판매량
        let sellNum = 0

        for (let i = 0; i < response.sold_count.length; i++) {
            console.log('년도', response.sold_count[i].created_at.split('-')[0])
            console.log('월 int변환', parseInt(response.sold_count[i].created_at.split('-')[1]))

            if (yearInput.value == response.sold_count[i].created_at.split('-')[0]) {
                if (monthInput.value == parseInt(response.sold_count[i].created_at.split('-')[1])) {
                    sellNum += 1
                } else {
                    alert('해당 월 기록 없음!')
                }
            } else {
                alert('해당 년도 기록 없음!')
            }
            console.log(sellNum)
        }

        //
        const amountTbody = document.getElementById('amount_div')

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
    })

}
