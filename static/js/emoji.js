function baseEmojiList(user_emoticon_list, emoticon_popup, emoticonbtn, emoticon_images, comment_content){
    const userEmoticonList = document.getElementById(user_emoticon_list)
    console.log(userEmoticonList)
    const emoticonPopup = document.getElementById(emoticon_popup)

    // 댓글입력 이모티콘버튼 이모지생성
    let emojiDiv = document.querySelector(`#${emoticon_images}`)
    const emojiInstance = baseEmoji.split(' ')
    emojiInstance.forEach(element => {
        const emojiSpan = document.createElement('span')
        emojiSpan.textContent = element
        // emojiSpan.setAttribute('style','cursor: pointer;')
        emojiDiv.appendChild(emojiSpan)
    });

    // 이모지 클릭시 인풋에 입력
    let emojis = emojiDiv.childNodes
    emojis.forEach(element => {
        element.addEventListener('click', function () {
            let commentInput = document.getElementById(comment_content)
            let nowInput = commentInput.value
            commentInput.value = nowInput + element.innerText
            emoticonToggle(emoticonPopup)
        })
    });

    // 
    const emoji = document.createElement('li')
    emoji.setAttribute('class', 'nav-item')
    userEmoticonList.appendChild(emoji)

    const emojiButton = document.createElement('button')
    emojiButton.setAttribute('style', 'border: none;')
    emoji.appendChild(emojiButton)
    emojiButton.addEventListener('click', function() {
        const emoticonImages = document.getElementById(emoticon_images)

        while (emoticonImages.firstChild) {
            emoticonImages.firstChild.remove();
        }
        let emojiDiv = document.querySelector(`#${emoticon_images}`)
        //이모지 넣을때 split해서 넣기
        const emojiInstance = baseEmoji.split(' ')
        emojiInstance.forEach(element => {
        const emojiSpan = document.createElement('span')
        emojiSpan.textContent = element
        // emojiSpan.setAttribute('style','cursor: pointer;')
        emojiDiv.appendChild(emojiSpan)
    });

        let emojis = emojiDiv.childNodes
        emojis.forEach(element => {
            element.addEventListener('click', function () {
                let commentInput = document.getElementById(comment_content)
                let nowInput = commentInput.value
                commentInput.value = nowInput + element.innerText
                emoticonToggle(emoticonPopup)
            })
        });
    })

    const emojiButtonSpan = document.createElement('span')
    emojiButtonSpan.innerText = '이모지'
    emojiButton.appendChild(emojiButtonSpan)

    emoticonPopup.style.display = 'block'
    const emotiBtn = document.getElementById(emoticonbtn)
    emotiBtn.setAttribute('onclick', `emoticonToggle(${emoticonPopup.id})`)
}
