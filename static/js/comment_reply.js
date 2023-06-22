// 대댓글 토글
function replyToggle(comment_id) {
    const toggle = document.getElementById(`reply_toggle${comment_id}`)

    if (toggle.style.display == "block") {
        toggle.style.display = "none"
    }
    else if (toggle.style.display == "none") {
        toggle.style.display = "block"
    }
}


// 대댓글 등록
async function replyCreate(comment_id) {
    const access = localStorage.getItem('access')

    const replyContent = document.getElementById(`reply_input${comment_id}`).value
    const replyEmoticon = document.getElementById("reply_use_emoticon").alt;


    if (replyContent == "") {
        if (replyEmoticon == "") {
            alert("내용을 입력해주세요!")
        }
        else {
            const formData = new FormData()

            formData.append('content', replyContent)
            formData.append('use_emoticon', replyEmoticon)

            const response = await fetch(`${back_base_url}/articles/${comment_id}/replys/`, {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                method: "POST",
                body: formData,
            })
            const data = await response.json()
            if (response.status == 200) {
                const beforeReply = document.getElementById(`reply_toggle${comment_id}`)
                beforeReply.remove()
                reply(comment_id)
            } else if (response.status == 400) {
                alert('잘못 된 요청입니다.')
            }
        }
    } else {
        const formData = new FormData()

        formData.append('content', replyContent)
        formData.append('use_emoticon', replyEmoticon)

        const response = await fetch(`${back_base_url}/articles/${comment_id}/replys/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "POST",
            body: formData,
        })
        const data = await response.json()
        if (response.status == 200) {
            const beforeReply = document.getElementById(`reply_toggle${comment_id}`)
            beforeReply.remove()
            reply(comment_id)
        } else if (response.status == 400) {
            alert('잘못 된 요청입니다.')
        }
    }
}


// 대댓글 수정 폼
async function replyUpdate(reply_id, reply, comment_id) {
    commentUpdate(reply_id, "reply", comment_id)
}


// 대댓글 수정 확인
async function replyUpdateConfirm(reply_id, reply, comment_id) {
    commentUpdateConfirm(reply_id, "reply", comment_id)
    reply(comment_id)
}



// 대댓글 삭제
async function replyDelete(comment_id, reply_id) {
    const access = localStorage.getItem('access')

    if (confirm("삭제하시겠습니까?")) {
        const formData = new FormData()
        formData.append('reply_id', reply_id)

        const response = await fetch(`${back_base_url}/articles/${comment_id}/replys/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "DELETE",
            body: formData,
        });
        if (response.status == 200) {
            alert("삭제되었습니다.");
            const beforeReply = document.getElementById(`reply_toggle${comment_id}`)
            beforeReply.remove()
            reply(comment_id)
        } else {
            alert("권한이 없습니다!");
        }
    } else {
        // 취소 버튼을 눌렀을 경우
        return false;
    }
}


// 대댓글 보기
async function reply(comment_id) {
    const access = localStorage.getItem('access')

    const response = await fetch(`${back_base_url}/articles/${comment_id}/replys/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
    })
    const data = await response.json()

    const replyDiv = document.getElementById(`comment_reply${comment_id}`)

    const replyCreateDiv = document.createElement('div')
    replyCreateDiv.setAttribute('id', `reply_toggle${comment_id}`)
    replyCreateDiv.setAttribute('style', 'display: block')
    replyDiv.appendChild(replyCreateDiv)

    const inputDiv = document.createElement('div')
    replyCreateDiv.appendChild(inputDiv)

    const emoticonDiv = document.createElement('div')
    emoticonDiv.setAttribute('class', 'card text-center')

    const replyInput = document.createElement('input')
    replyInput.setAttribute('id', `reply_input${comment_id}`)

    // 입력창 엔터시 댓글 등록
    replyInput.addEventListener('keypress', function (event) {
        if (event.key == 'Enter') {
            replyCreate(comment_id)
        }
    })

    emoticonDiv.appendChild(replyInput)

    const replyBtnDiv = document.createElement('div')
    emoticonDiv.appendChild(replyBtnDiv)


    const replyEmoticonButton = document.createElement('button')
    replyEmoticonButton.innerText = '이모티콘'
    replyEmoticonButton.setAttribute('class', 'btn btn-outline-secondary')
    replyEmoticonButton.setAttribute('id', 'reply_emoticon_button')
    replyEmoticonButton.setAttribute('onclick', `emoticonButtonList("reply_emoticon_list", "reply_emoticon_popup", "reply_emoticon_button", "reply_emoticon_images", "reply_use_emoticon", "reply_emojis", "reply_input")`)
    replyBtnDiv.appendChild(replyEmoticonButton)

    const replyCreateButton = document.createElement('button')
    replyCreateButton.innerText = '등록'
    replyCreateButton.setAttribute('class', 'btn btn-outline-secondary')
    replyCreateButton.setAttribute('onclick', `replyCreate(${comment_id})`)
    replyBtnDiv.appendChild(replyCreateButton)

    const popupParentsDiv = document.createElement('div')
    popupParentsDiv.setAttribute('style', 'height: 0px;')

    const popupDiv = document.createElement('div')
    popupDiv.setAttribute('class', 'card text-center;')
    popupDiv.setAttribute('style', 'position: relative; z-index: 1; display: none;')
    popupDiv.setAttribute('id', 'reply_emoticon_popup')
    popupParentsDiv.appendChild(popupDiv)

    const chDiv = document.createElement('div')
    chDiv.setAttribute('class', 'card-header')
    popupDiv.appendChild(chDiv)

    const replyEmoticonList = document.createElement('ul')
    replyEmoticonList.setAttribute('class', 'nav nav-tabs card-header-tabs mb-3')
    replyEmoticonList.setAttribute('id', 'reply_emoticon_list')
    chDiv.appendChild(replyEmoticonList)

    const kkkk = document.createElement('div')
    kkkk.setAttribute('class', 'row row-cols-1 row-cols-md-2')
    chDiv.appendChild(kkkk)

    const replyEmoticonImages = document.createElement('div')
    replyEmoticonImages.setAttribute('class', 'row row-cols-5 row-cols-md-5')
    replyEmoticonImages.setAttribute('style', 'overflow-y: scroll; width: 53%;height: 220px;')
    replyEmoticonImages.setAttribute('id', 'reply_emoticon_images')
    kkkk.appendChild(replyEmoticonImages)

    const llll = document.createElement('div')
    llll.setAttribute('style', 'overflow-y: scroll; width: 47%;height: 220px;')
    llll.setAttribute('id', 'reply_emojis')
    llll.setAttribute('name', `${comment_id}`)
    kkkk.appendChild(llll)

    emoticonDiv.appendChild(popupParentsDiv)

    replyCreateDiv.insertBefore(emoticonDiv, replyCreateDiv.firstChild)

    const replyEmoticon = document.createElement('img')
    replyEmoticon.setAttribute('id', 'reply_use_emoticon')
    replyCreateDiv.insertBefore(replyEmoticon, replyCreateDiv.firstChild)

    data.forEach(element => {
        const replyBox = document.createElement('div')
        replyBox.setAttribute('class', 'card mt-3')
        replyBox.setAttribute('style', 'width: 100%; flex-direction: row;')
        replyBox.setAttribute('id', `reply${element.id}`)

        const replyWriter = document.createElement('div')
        replyWriter.setAttribute('class', 'card-body')
        replyWriter.setAttribute('style', 'width: 15%; display: flex; flex-direction: column;')
        replyWriter.innerText = element.writer_name
        replyBox.appendChild(replyWriter)

        const replyContent = document.createElement('div')
        replyContent.setAttribute('class', 'card-body')
        replyContent.setAttribute('style', 'width: 70%;')
        replyContent.setAttribute('id', 'reply')
        replyBox.appendChild(replyContent)

        const replyUseEmoticon = document.createElement('img')
        replyUseEmoticon.setAttribute('style', 'width: 100px; height: 100px; object-fit: cover;')
        if (element.emoticon_image == null) {
            replyUseEmoticon.style.display = 'none'
        } else {
            replyUseEmoticon.src = `${image_url}${element.emoticon_image}`
            replyUseEmoticon.alt = `${element.use_emoticon}`
        }
        replyContent.appendChild(replyUseEmoticon)

        const replyContentP = document.createElement('p')
        replyContentP.setAttribute('id', `reply_contentP${element.id}`)
        replyContentP.innerText = element.content
        replyContent.appendChild(replyContentP)


        // 삭제 기능 넣어야됨
        const btnDiv = document.createElement('div')
        btnDiv.setAttribute('style', 'width: 10%;')

        const replyUpdateBtn = document.createElement('button')
        replyUpdateBtn.setAttribute('class', 'btn btn-light btn-sm')
        replyUpdateBtn.setAttribute('style', 'margin: 10px auto auto auto')
        replyUpdateBtn.setAttribute('onclick', `replyUpdate(${element.id}, "reply", ${comment_id})`)
        replyUpdateBtn.innerText = '수정'

        const replyDeleteBtn = document.createElement('button')
        replyDeleteBtn.setAttribute('class', 'btn btn-light btn-sm')
        replyDeleteBtn.setAttribute('style', 'margin: 10px auto auto auto')
        replyDeleteBtn.setAttribute('onclick', `replyDelete(${comment_id}, ${element.id})`)
        replyDeleteBtn.innerText = '삭제'
        if (JSON.parse(localStorage.getItem("payload")).user_id != element.writer) {
            replyUpdateBtn.disabled = true
            replyUpdateBtn.style.display = 'none'
            replyDeleteBtn.disabled = true
            replyDeleteBtn.style.display = 'none'
        }

        replyBox.appendChild(btnDiv)
        btnDiv.appendChild(replyUpdateBtn)
        btnDiv.appendChild(replyDeleteBtn)

        replyCreateDiv.appendChild(replyBox)
    });

    const replyButton = document.getElementById(`comment_reply_button${comment_id}`)
    replyButton.setAttribute('onclick', `replyToggle(${comment_id})`)
}
