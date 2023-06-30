async function emoticonCreatorList() {
    const access = localStorage.getItem('access')

    const response = await fetch(`${back_base_url}/emoticons/creator/1/nickname/`, {
        method: "GET",
    })

    const data = await response.json()

    const creatorName = document.getElementById('creator')

    for (let i = 0; i < data.length; i++) {
        const col = document.createElement('div')
        col.setAttribute('class', 'col')
        col.setAttribute('style', 'width: 20%; height:220px')
        creatorName.appendChild(col)

        const card = document.createElement('div')
        card.setAttribute('class', 'card h-100 mx-auto')
        col.appendChild(card)

        const cardBody = document.createElement('div')
        cardBody.setAttribute('class', 'card-body emoticon_creator')
        cardBody.setAttribute('style', 'display: flex; flex-direction: column;')
        cardBody.addEventListener('click', function () {
            window.location.href = `${front_base_url}/templates/emoticon_creator_list.html?id=${data[i].id}&/`
        })
        card.appendChild(cardBody)

        const mainImage = document.createElement('img')
        let profileimage = data[i].profileimage
        let profileimageurl = data[i].profileimageurl
        mainImage.setAttribute('class', 'card-img-top')
        mainImage.setAttribute('style', 'height: 130px; object-fit: cover;')
        if (profileimage !== null) {
            mainImage.setAttribute("src", `${image_url}` + profileimage)
        }
        else if (profileimage == null) {
            mainImage.setAttribute("src", profileimageurl)
        }
        else {
            mainImage.setAttribute("src", "../static/images/default.png")
        }
        cardBody.appendChild(mainImage)

        const creator = document.createElement('p')
        creator.setAttribute('class', 'card-text')
        creator.setAttribute('style', 'margin-bottom: 0px; margin-top: auto;')
        creator.innerText = "제작자: " + data[i].nickname
        cardBody.appendChild(creator)
    }
}

emoticonCreatorList()
