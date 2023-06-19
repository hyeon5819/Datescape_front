const urlParams = new URLSearchParams(window.location.search);
const emoticonId = urlParams.get("emoticon_id");


// 이모티콘 가져오기
async function getEmoticon(emoticon_id) {
    if (localStorage.getItem("access")) {
        const access = localStorage.getItem("access");

        const response = await fetch(`${back_base_url}/emoticons/${emoticon_id}/`, {
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
    } else {
        const response = await fetch(`${back_base_url}/emoticons/${emoticon_id}/`, {
            method: "GET",
        })
        if (response.status == 200) {
            response_json = await response.json();
            return response_json;
        } else {
            alert(response.status);
        }
    }
}


// 유저가 가진 이모티콘들 가져오기
async function getUserEmoticon() {
    const access = localStorage.getItem("access");

    const response = await fetch(`${back_base_url}/emoticons/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
    });

    if (response.status == 200) {
        response_json = await response.json();
        return response_json;
    } else {
        alert(response.status);
    }
}


// 이모티콘 상세보기
async function emoticonDetail() {
    const response = await getEmoticon(emoticonId)

    const emoticonTitle = document.getElementById('title')
    emoticonTitle.innerText = response.title

    const emoticonImages = document.getElementById('images')
    response.images.forEach(element => {
        const emoticonImage = document.createElement('img')
        emoticonImage.src = `${image_url}${element.image}`
        emoticonImage.setAttribute('alt', `${element.id}`)
        emoticonImage.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover;')
        emoticonImages.appendChild(emoticonImage)
    });

    // 결제 정보
    const userEmail = response.req_user_email
    const userName = response.req_username
    const emoticonPrice = response.price[0]

    // 결제창 함수 넣어주기
    const buyButton = document.getElementById('buy_emoticon')
    buyButton.setAttribute('onclick', `kcpRequestPay('${userEmail}', '${userName}', '${emoticonPrice}')`)
    buyButton.setAttribute('class', "btn btn-primary")

    // 구매했는지 여부 표시하기
    if (response.buy == true) {
        buyButton.setAttribute('class', "btn btn-black")
        buyButton.innerText = '구매완료'
        buyButton.disabled = true
    } else {
        buyButton.innerText = '구매하기'
        buyButton.disabled = false
    }

    // 금액
    const price = document.getElementById('price')
    price.innerText = `💳${response.price}`
}


emoticonDetail()
