const urlParams = new URLSearchParams(window.location.search);
const emoticonId = urlParams.get("emoticon_id");

const userId = JSON.parse(localStorage.getItem("payload")).user_id;

// 이모티콘 가져오기
async function getEmoticon(emoticon_id) {
    const access = localStorage.getItem("access");

    const response = await fetch(`${back_base_url}/emoticons/${emoticon_id}`, {
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

window.onload = async function () {
    const response = await getEmoticon(emoticonId)

    console.log(response.buy)
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

    //구매했는지 여부 표시하기
    const boughtEmoticon = document.getElementById('buy_emoticon')
    if (response.buy == true){
        boughtEmoticon.innerText = '구매완료'
        boughtEmoticon.disabled = true
    }
    // else {
        
    // }

}
