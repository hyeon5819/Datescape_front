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



// 이모티콘 리스트 가져오기
async function getAdminEmoticonList(){
    const access = localStorage.getItem("access");

    const response = await fetch(`${back_base_url}/emoticons/payment/admin/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
    });

    if (response.status == 200) {
        response_json = await response.json();

        let emoticons = document.getElementById('emoticons')

        response_json.forEach(element => {
            let col = document.createElement('div')
            col.setAttribute('class', 'col')

            let card = document.createElement('div')
            card.setAttribute('class', 'card')

            let emoticonImage = document.createElement('img')
            if (element.images.length == 0) {
                let mainImage = ''
                emoticonImage.setAttribute('src', `${image_url}${mainImage}`)
            } else {
                let mainImage = element.images[0].image
                emoticonImage.setAttribute('src', `${image_url}${mainImage}`)
            }
            emoticonImage.setAttribute('class', 'card-img-top')
            emoticonImage.setAttribute('style', 'height: 200px; object-fit: cover;')

            let cardBody = document.createElement('div')
            cardBody.setAttribute('class', 'card-body')

            let emoticonTitle = document.createElement('h5')
            emoticonTitle.setAttribute('class', 'card-title')
            emoticonTitle.innerText = element.title

            let emoticonCreator = document.createElement('p')
            emoticonCreator.setAttribute('class', 'card-text')
            emoticonCreator.innerText = '제작자: ' + element.creator_name

            let detailButton = document.createElement('button')
            detailButton.innerText = '판매 중'
            if (element.db_status == 2){
                detailButton.innerText = '판매 중단'
                detailButton.disabled = true
            }

            let soldCount = document.createElement('p')
            if (element.sold_count == null){
                soldCount.innerText = '누적 판매량: ' + 0
            } else {
                soldCount.innerText = '누적 판매량: ' + element.sold_count.length
            }
            soldCount.setAttribute('class', 'mt-3 mb-0')

            let detailCount = document.createElement('button')
            detailCount.setAttribute('onclick', `location.href='${front_base_url}/templates/admin_emoticon_detail_count.html?emoticon_id=${element.id}&/'`)
            detailCount.innerText = '상세'

            let price = document.createElement('p')
            price.innerText = '💳' + element.price

            emoticons.appendChild(col)
            col.appendChild(card)
            card.appendChild(emoticonImage)
            card.appendChild(cardBody)
            cardBody.appendChild(emoticonTitle)
            cardBody.appendChild(emoticonCreator)
            cardBody.appendChild(price)
            cardBody.appendChild(detailButton)
            cardBody.appendChild(soldCount)
            cardBody.appendChild(detailCount)
        });
    } else if (response.status == 403){
        alert('관리자만 접근 가능합니다!');
        location.href = '/'
    }
}



getAdminEmoticonList()
