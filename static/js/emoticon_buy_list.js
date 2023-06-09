if (!localStorage.getItem("access")) {
    alert("로그인이 필요합니다.")
    window.location.href = `${front_base_url}/templates/logintemp.html`
}

async function emoticonBuyList() {
    const access = localStorage.getItem("access");

    const response = await fetch(`${back_base_url}/emoticons/`, {
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
            detailButton.setAttribute('onclick', `location.href='${front_base_url}/templates/emoticon_detail.html?emoticon_id=${element.id}&/'`)
            detailButton.setAttribute('class', 'btn btn-outline-dark btn-sm mt-3')
            detailButton.innerText = '보러가기'

            emoticons.appendChild(col)
            col.appendChild(card)
            card.appendChild(emoticonImage)
            card.appendChild(cardBody)
            cardBody.appendChild(emoticonTitle)
            cardBody.appendChild(emoticonCreator)
            cardBody.appendChild(detailButton)
        });

    } else {
        alert(response.status);
    }
}


emoticonBuyList()
