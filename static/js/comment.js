// 게시글 아이디
// const urlGetParams = new URLSearchParams(window.location.search);
// const articleId = urlGetParams.get("id"); // article_detail에서 이미 불러옴

// 토큰
const access = localStorage.getItem("access");

if (!localStorage.getItem("access")) {
    alert("로그인이 필요합니다.")
    window.location.href = `${front_base_url}/templates/logintemp.html`
} else {
    commentView()
}


// 입력창 엔터시 댓글 등록
const createInput = document.getElementById('comment_content')
createInput.addEventListener('keypress', function (event) {
    if (event.key == 'Enter') {
        commentCreate()
    }
})


// 이모티콘 보이기/숨기기
function emoticonToggle(emoticon_popup, emoticonbtn) {
    const emoticonPopup = document.getElementById(emoticon_popup.id)

    if (emoticonPopup.style.display == 'none') {
        emoticonPopup.style.display = 'block'
        const emotiBtn = document.getElementById(emoticonbtn.id)
        emotiBtn.setAttribute('class', 'btn btn-secondary')
        emotiBtn.innerText = '닫기'
    } else if (emoticonPopup.style.display == 'block') {
        emoticonPopup.style.display = 'none'
        const emotiBtn = document.getElementById(emoticonbtn.id)
        emotiBtn.setAttribute('class', 'btn btn-outline-secondary')//
        emotiBtn.innerText = '이모티콘'
    }
}


// 댓글 불러오기
async function getComment() {
    const response = await fetch(`${back_base_url}/articles/${articleId}/comments/`, {
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


// 유저가 가진 이모티콘들 가져오기
async function getUserEmoticon() {
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


// 이모티콘 버튼에 리스트 만들기
async function emoticonButtonList(user_emoticon_list, emoticon_popup, emoticonbtn, emoticon_images, use_emoticon, update_emojis, input_type) {
    if (document.getElementById(update_emojis)) {
        const updateEmojis = update_emojis
        const updateCommentId = document.getElementById(update_emojis).getAttribute('name')
        putEmoji(updateEmojis, updateCommentId, input_type)
    }
    const emoticonPopup = document.getElementById(emoticon_popup)
    // 유저가 가진 이모티콘 가져오기
    if (localStorage.getItem("access")) {
        const userId = JSON.parse(localStorage.getItem("payload")).user_id

        // 유저가 가진 이모티콘 리스트 추가
        const response_useremoticon = await getUserEmoticon();
        const userEmoticonList = document.getElementById(user_emoticon_list)


        response_useremoticon.forEach(user_emoticon => {
            const userEmoticon = document.createElement('li')
            userEmoticon.setAttribute('class', 'nav-item')
            userEmoticonList.appendChild(userEmoticon)

            const userEmoticonButton = document.createElement('button')
            userEmoticonButton.setAttribute('style', 'border: none;')

            userEmoticonButton.addEventListener('click', function () {
                const emoticonImages = document.getElementById(emoticon_images)

                while (emoticonImages.firstChild) {
                    emoticonImages.firstChild.remove();
                }
                user_emoticon.images.forEach(image => {
                    const emoticonImage = document.createElement('img')
                    emoticonImage.setAttribute('src', `${image_url}${image.image}`)
                    emoticonImage.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover;')
                    emoticonImage.setAttribute('class', 'emoticon')
                    // 이모티콘 클릭했을때 입력창에 넣어주기
                    const image_input_box = document.getElementById(use_emoticon)
                    emoticonImage.addEventListener('click', function () {
                        if (!image_input_box.alt == 'none') {
                            image_input_box.removeAttribute('src')
                            image_input_box.removeAttribute('alt')
                            image_input_box.removeAttribute('style')

                            image_input_box.setAttribute('src', `${image_url}${image.image}`)
                            image_input_box.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover; margin: auto;')
                            image_input_box.setAttribute('id', use_emoticon)
                            image_input_box.setAttribute('alt', `${image.id}`)
                            image_input_box.addEventListener('click', function () {
                                image_input_box.removeAttribute('src')
                                image_input_box.removeAttribute('alt')
                                image_input_box.removeAttribute('style')
                            })
                        } else {
                            image_input_box.setAttribute('src', `${image_url}${image.image}`)
                            image_input_box.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover; margin: auto;')
                            image_input_box.setAttribute('id', use_emoticon)
                            image_input_box.setAttribute('alt', `${image.id}`)
                            image_input_box.addEventListener('click', function () {
                                image_input_box.removeAttribute('src')
                                image_input_box.removeAttribute('alt')
                                image_input_box.removeAttribute('style')
                            })
                        }
                        // emoticonToggle(emoticonPopup)
                    })
                    emoticonImages.appendChild(emoticonImage)
                });
            });

            userEmoticon.appendChild(userEmoticonButton)

            const userEmoticonButtonSpan = document.createElement('span')
            userEmoticonButtonSpan.setAttribute('class', 'emoticon')
            userEmoticonButtonSpan.innerText = user_emoticon.title
            userEmoticonButton.appendChild(userEmoticonButtonSpan)
        });
        const getEmoticonGo = document.createElement('li')
        getEmoticonGo.setAttribute('class', 'nav-item')
        getEmoticonGo.setAttribute('style', 'margin-right: 0px; margin-left: auto;')
        userEmoticonList.appendChild(getEmoticonGo)

        const getEmoticonButton = document.createElement('button')
        getEmoticonButton.setAttribute('style', 'border: none;')
        getEmoticonGo.appendChild(getEmoticonButton)
        getEmoticonButton.addEventListener('click', function () {
            if (confirm("이모티콘 상점으로 이동하시겠습니까?")) {
                window.location.href = `${front_base_url}/templates/emoticon_list.html`
            } else {
                return false;
            }
        })

        const getEmoticonSpan = document.createElement('span')
        getEmoticonSpan.setAttribute('class', 'emoticon')
        getEmoticonSpan.innerText = '+이모티콘 구경하기'
        getEmoticonButton.appendChild(getEmoticonSpan)
    }
    emoticonPopup.style.display = 'block'
    const emotiBtn = document.getElementById(emoticonbtn)
    emotiBtn.setAttribute('onclick', `emoticonToggle(${emoticonPopup.id}, ${emotiBtn.id})`)
    emotiBtn.setAttribute('class', 'btn btn-secondary')
    emotiBtn.innerText = '닫기'
}

// 댓글 등록
async function commentCreate() {
    if (localStorage.getItem("access")) {
        const commentContent = document.getElementById("comment_content").value;
        const commentEmoticon = document.getElementById("use_emoticon").alt;

        if (commentContent == "") {
            if (commentEmoticon == "") {
                alert("내용을 입력해주세요!")
            }
            else {
                const formData = new FormData();
                formData.append("comment", commentContent);
                if (commentEmoticon == 'egg') {
                    formData.append("use_emoticon", '');
                } else {
                    formData.append("use_emoticon", commentEmoticon);
                }

                const response = await fetch(`${back_base_url}/articles/${articleId}/comments/`, {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();

                if (response.status == 200) {
                    alert("등록 완료!")
                    window.location.reload()
                } else {
                    alert("잘못 된 요청입니다.");
                }
            }
        } else {
            const formData = new FormData();
            if (commentEmoticon == 'egg') {
                formData.append("comment", '!#%&(*^$@' + commentContent);
                formData.append("use_emoticon", '');
            } else {
                formData.append("comment", commentContent);
                formData.append("use_emoticon", commentEmoticon);
            }

            const response = await fetch(`${back_base_url}/articles/${articleId}/comments/`, {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            if (response.status == 200) {
                alert("등록 완료!")
                window.location.reload()
            } else {
                alert("잘못 된 요청입니다.");
            }
        }
    } else {
        alert('로그인 사용자만 등록 가능합니다.')
    }
}

// 댓글 수정 폼
async function commentUpdate(type_id, type, parent_id) {
    const comment = document.getElementById(`${type}${type_id}`)
    let comment_save = document.getElementById(`${type}${type_id}`).innerHTML

    const commentP = document.getElementById(`${type}_contentP${type_id}`)
    const commentPValue = commentP.innerText

    const commentUsedEmoticon = comment.childNodes[1].firstChild
    const commentUsedEmoticonId = commentUsedEmoticon.alt
    const commentUsedEmoticonSrc = commentUsedEmoticon.src
    commentUsedEmoticon.style.display = 'none'

    const emoticonDiv = document.createElement('div')
    emoticonDiv.setAttribute('class', 'card text-center')

    const updateCommentEmoticon = document.createElement('img')
    updateCommentEmoticon.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover; margin: auto;')
    updateCommentEmoticon.setAttribute('class', 'emoticon')
    updateCommentEmoticon.setAttribute('id', `${type}_update_use_emoticon`)
    if (commentUsedEmoticonSrc == undefined | commentUsedEmoticonSrc == '') {
        updateCommentEmoticon.removeAttribute('src')
        updateCommentEmoticon.removeAttribute('alt')
        updateCommentEmoticon.removeAttribute('style')
    } else {
        updateCommentEmoticon.src = commentUsedEmoticonSrc
        updateCommentEmoticon.alt = commentUsedEmoticonId

    }
    updateCommentEmoticon.addEventListener('click', function () {
        updateCommentEmoticon.removeAttribute('src')
        updateCommentEmoticon.removeAttribute('alt')
        updateCommentEmoticon.removeAttribute('style')
    });

    const updateEmoticonButton = document.createElement('button')
    updateEmoticonButton.innerText = '이모티콘'
    updateEmoticonButton.setAttribute('class', 'btn btn-outline-secondary')
    updateEmoticonButton.setAttribute('id', `${type}_update_emoticon_button`)
    updateEmoticonButton.setAttribute('onclick', `emoticonButtonList("${type}_update_emoticon_list", "${type}_update_emoticon_popup", "${type}_update_emoticon_button", "${type}_update_emoticon_images", "${type}_update_use_emoticon", "${type}_update_emojis", "${type}_update_input")`)

    const popupParentsDiv = document.createElement('div')
    popupParentsDiv.setAttribute('style', 'height: 0px;')

    const popupDiv = document.createElement('div')
    popupDiv.setAttribute('class', 'card text-center;')
    popupDiv.setAttribute('style', 'position: relative; z-index: 1; display: none;')
    popupDiv.setAttribute('id', `${type}_update_emoticon_popup`)
    popupParentsDiv.appendChild(popupDiv)

    const chDiv = document.createElement('div')
    chDiv.setAttribute('class', 'card-header')
    popupDiv.appendChild(chDiv)

    const updateEmoticonList = document.createElement('ul')
    updateEmoticonList.setAttribute('class', 'nav nav-tabs card-header-tabs mb-3')
    updateEmoticonList.setAttribute('id', `${type}_update_emoticon_list`)
    chDiv.appendChild(updateEmoticonList)

    const kkkk = document.createElement('div')
    kkkk.setAttribute('class', 'row row-cols-1 row-cols-md-2')
    chDiv.appendChild(kkkk)

    const updateEmoticonImages = document.createElement('div')
    updateEmoticonImages.setAttribute('class', 'row row-cols-5 row-cols-md-5')
    updateEmoticonImages.setAttribute('style', 'overflow-y: scroll; width: 53%;height: 220px;')
    updateEmoticonImages.setAttribute('id', `${type}_update_emoticon_images`)
    kkkk.appendChild(updateEmoticonImages)

    const llll = document.createElement('div')
    llll.setAttribute('style', 'overflow-y: scroll; width: 47%;height: 220px;')
    llll.setAttribute('id', `${type}_update_emojis`)
    llll.setAttribute('name', `${type_id}`)
    kkkk.appendChild(llll)

    emoticonDiv.appendChild(updateEmoticonButton)
    emoticonDiv.appendChild(popupParentsDiv)

    const updateCommentInput = document.createElement('input')
    updateCommentInput.setAttribute('type', 'text')
    updateCommentInput.setAttribute('class', 'form-control')
    updateCommentInput.setAttribute('id', `${type}_update_input${type_id}`)
    updateCommentInput.value = commentPValue

    comment.childNodes[1].insertBefore(updateCommentEmoticon, comment.childNodes[1].lastChild)
    comment.childNodes[1].insertBefore(updateCommentInput, comment.childNodes[1].lastChild)
    comment.childNodes[1].insertBefore(emoticonDiv, comment.childNodes[1].lastChild)

    commentP.style.display = 'none'

    const updateButton = comment.childNodes[2].firstChild
    updateButton.setAttribute('onclick', `${type}UpdateConfirm(${type_id}, "${type}", ${parent_id})`)

    const cancelButton = comment.childNodes[2].lastChild
    cancelButton.innerText = '취소'
    cancelButton.setAttribute('onclick', ``)
    cancelButton.addEventListener('click', function () {
        comment.innerHTML = comment_save
    });
}


// 수정 확인
async function commentUpdateConfirm(type_id, type, parent_id) {
    const commentUpdateContent = document.getElementById(`${type}_update_input${type_id}`).value;
    const commentUpdateEmoticon = document.getElementById(`${type}_update_use_emoticon`).alt;

    if (commentUpdateContent == "") {
        if (commentUpdateEmoticon == "") {
            alert("내용을 입력해주세요!")
        } else {
            const formData = new FormData();
            if (type == "comment") {
                formData.append(`comment`, commentUpdateContent);
            } else if (type == "reply") {
                formData.append(`content`, commentUpdateContent);
            }
            formData.append(`${type}_id`, `${type_id}`);
            formData.append(`use_emoticon`, commentUpdateEmoticon);

            const response = await fetch(`${back_base_url}/articles/${parent_id}/${type}s/`, {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                method: "PUT",
                body: formData,
            });

            if (response.status == 200) {
                alert("수정 완료!")
                window.location.reload()
            } else {
                alert("잘못 된 요청입니다.");
            }
        }
    } else {
        const formData = new FormData();
        if (type == "comment") {
            formData.append(`comment`, commentUpdateContent);
        } else if (type == "reply") {
            formData.append(`content`, commentUpdateContent);
        }
        formData.append(`${type}_id`, `${type_id}`);
        formData.append(`use_emoticon`, commentUpdateEmoticon);

        const response = await fetch(`${back_base_url}/articles/${parent_id}/${type}s/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "PUT",
            body: formData,
        });

        if (response.status == 200) {
            alert("수정 완료!")
            window.location.reload()
        } else {
            alert("잘못 된 요청입니다.");
        }
    }
}


// 댓글 삭제
async function commentDelete(comment_id) {
    if (confirm("삭제하시겠습니까?")) {
        const formData = new FormData()
        formData.append('comment_id', comment_id)

        const response = await fetch(
            `${back_base_url}/articles/${articleId}/comments/`,
            {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                method: "DELETE",
                body: formData,
            }
        );
        if (response.status == 204) {
            alert("삭제되었습니다.");
            window.location.reload()
        } else {
            alert("권한이 없습니다!");
        }
    } else {
        // 취소 버튼을 눌렀을 경우
        return false;
    }
}


// 댓글 보여주기
async function commentView() {
    const response_comment = await getComment();

    // 등록버튼 함수 넣어주기
    const commentCreateButton = document.getElementById("comment_create")

    commentCreateButton.setAttribute('onclick', `commentCreate()`)

    // 댓글 리스트 보여주기
    const commentContent = document.getElementById("comment");


    response_comment.forEach(element => {
        const cardDiv = document.createElement("div")
        cardDiv.setAttribute('class', 'card mt-3')
        cardDiv.setAttribute('style', 'width: 100%; flex-direction: row;')
        cardDiv.setAttribute('id', 'comment' + `${element.id}`)
        cardDiv.setAttribute('value', element.id)
        commentContent.appendChild(cardDiv)

        const nicknameDiv = document.createElement("div")
        nicknameDiv.setAttribute('style', 'width: 15%;display: flex; flex-direction: column;')
        nicknameDiv.innerText = element.username
        cardDiv.appendChild(nicknameDiv)

        //신고하기
        const reportButton = document.createElement("button")
        reportButton.setAttribute('style', 'width: 30%; margin: 40px auto auto auto; border: none;')
        reportButton.setAttribute('onclick', `Report_button(3,${element.id})`)
        reportButton.setAttribute('class', "btn btn-light btn-sm")
        reportButton.innerText = '🚨'
        nicknameDiv.appendChild(reportButton)

        const commentDiv = document.createElement("div")
        commentDiv.setAttribute('class', 'card-body')
        commentDiv.setAttribute('id', 'content_body')
        commentDiv.setAttribute('style', 'width: 68%;')

        const commentEmoticon = document.createElement('img')
        if (element.use_emoticon == null) {
        } else {
            commentEmoticon.setAttribute('src', `${image_url}${element.emoticon_image}`)
            commentEmoticon.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover;')
            commentEmoticon.setAttribute('class', 'emoticon')
            commentEmoticon.setAttribute('id', `comment_use_emoticon${element.use_emoticon}`)
            commentEmoticon.setAttribute('alt', `${element.use_emoticon}`)
            commentDiv.appendChild(commentEmoticon)
        }

        if (element.comment.includes('!#%&(*^$@')) {
            commentEmoticon.setAttribute('src', `https://lh3.googleusercontent.com/RxYXrd8Owa7gSCTtHtrxVpwoZwTgq8MwGgIWpdXGyfesLm6ecoMl2u5BkWuClujC6YvL`)
            commentEmoticon.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover;')
            commentEmoticon.setAttribute('class', 'emoticon')
            commentDiv.appendChild(commentEmoticon)

            const commentP = document.createElement("p")
            commentP.innerText = element.comment.split('!#%&(*^$@')[1]
            commentP.setAttribute('style', 'font-size: 20px;')
            commentP.setAttribute('id', `comment_contentP${element.id}`)
            commentDiv.appendChild(commentP)
        } else {
            const commentP = document.createElement("p")
            commentP.innerText = element.comment
            commentP.setAttribute('style', 'font-size: 20px;')
            commentP.setAttribute('id', `comment_contentP${element.id}`)
            commentDiv.appendChild(commentP)
        }


        const replyDiv = document.createElement("div")
        replyDiv.setAttribute('id', `comment_reply${element.id}`)
        commentDiv.appendChild(replyDiv)

        const replyButtonDiv = document.createElement('div')
        replyButtonDiv.setAttribute('class', 'reply')
        replyDiv.appendChild(replyButtonDiv)

        const replyButtonDivHr = document.createElement('hr')
        replyButtonDivHr.setAttribute('class', 'reply_hr')
        replyButtonDiv.appendChild(replyButtonDivHr)

        const replyButton = document.createElement('button')
        replyButton.setAttribute('class', 'reply_btn')
        replyButton.setAttribute('id', `comment_reply_button${element.id}`)
        if (element.reply_count == 0) {
            replyButton.innerText = '답글 달기'
        } else {
            replyButton.innerText = element.reply_count + '개의 답글 보기'
        }
        replyButton.setAttribute('onclick', `reply(${element.id})`)
        replyButtonDiv.appendChild(replyButton)

        cardDiv.appendChild(commentDiv)

        const buttonDiv = document.createElement("div")
        cardDiv.appendChild(buttonDiv)
        buttonDiv.setAttribute('style', 'width: 10%; display:flex;align-items:center; justify-content:space-evenly')

        if (localStorage.getItem("access")) {
            const userId = JSON.parse(localStorage.getItem("payload")).user_id

            if (element.writer == userId) {
                const updateButton = document.createElement("button")
                updateButton.setAttribute('onclick', `commentUpdate(${element.id}, "comment", ${articleId})`)
                updateButton.setAttribute('class', 'btn btn-light btn-sm')
                updateButton.setAttribute('style', 'margin: 20px 0px auto 0px')
                updateButton.innerText = '수정'
                buttonDiv.appendChild(updateButton)

                const deleteButton = document.createElement("button")
                deleteButton.setAttribute('onclick', `commentDelete(${element.id})`)
                deleteButton.setAttribute('class', 'btn btn-light btn-sm')
                deleteButton.setAttribute('style', 'margin: 20px 0px auto 0px')
                deleteButton.innerText = '삭제'
                buttonDiv.appendChild(deleteButton)
            }
        }

        // 댓글 좋아요
        const userId = JSON.parse(localStorage.getItem("payload")).user_id

        let likeButton = document.createElement("button")
        cardDiv.appendChild(likeButton)
        likeButton.setAttribute('style', 'width: 7%;background: transparent;border: 1px solid #aaa;margin: 10px 20px auto;border-radius: 25px;padding: 10px;')
        likeButton.setAttribute('class', 'hover_btn')
        likeButton.innerText = `🤍\n${element.likers.length}`
        for (let i = 0; i < element.likers.length; i++) {
            if (userId == element.likers[i].likers) {
                likeButton.innerText = `❤️\n${element.likers.length}`
                break;
            } else {
                likeButton.innerText = `🤍\n${element.likers.length}`
            }
        }
        likeButton.setAttribute('onclick', `commentLike(${element.id})`)
        likeButton.setAttribute('id', `like${element.id}`)
    });
}


// 댓글 좋아요
async function commentLike(comment_id) {
    const formData = new FormData()

    formData.append('comment_id', comment_id)

    const responseLike = await fetch(`${back_base_url}/articles/comments/like/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "POST",
        body: formData,
    })
    const data = await responseLike.json();

    if (responseLike.status == 200) {
        const heart = document.getElementById(`like${comment_id}`)
        if (data.message == "좋아요!") {
            heart.innerText = `❤️\n${data.comment_likes}`
        } else if (data.message == "좋아요 취소!") {
            heart.innerText = `🤍\n${data.comment_likes}`
        }
    } else {
        alert("잘못 된 요청입니다.");
    }
}


// 이모지 텍스트로 넣어주기
const commentInputBox = document.getElementById("comment_content");

commentInputBox.addEventListener("input", function () {
    const valueSplit = commentInputBox.value.split(":")
    if (valueSplit.length >= 2) {
        for (let i = 1; i < valueSplit.length; i++) {
            if (valueSplit[i - 1] in emojiTagDic) {
                let emojiNum = i - 1
                valueSplit[emojiNum] = emojiTagDic[valueSplit[emojiNum]]

                let commentInputChange = ''
                for (let a = 0; a < valueSplit.length; a++) {
                    if (a == emojiNum) {
                        commentInputChange += valueSplit[emojiNum]
                    }
                    else if (a == emojiNum - 1) {
                        commentInputChange += valueSplit[a]
                    }
                    else if (a == emojiNum + 1) {
                        commentInputChange += valueSplit[a]
                    }
                    else {
                        commentInputChange += valueSplit[a] + ':'
                    }
                };
                commentInputBox.value = commentInputChange
                break
            }
            else if (valueSplit[i - 1] == 'egg') {
                let emojiNum = i - 1
                valueSplit[emojiNum] = '🥚'

                let commentInputChange = ''
                for (let a = 0; a < valueSplit.length; a++) {
                    if (a == emojiNum) {
                        commentInputChange += valueSplit[emojiNum]

                        const image_input_box = document.getElementById('use_emoticon')

                        if (image_input_box.alt != 'none') {
                            image_input_box.removeAttribute('src')
                            image_input_box.removeAttribute('alt')
                            image_input_box.removeAttribute('style')

                            image_input_box.setAttribute('src', `https://lh3.googleusercontent.com/RxYXrd8Owa7gSCTtHtrxVpwoZwTgq8MwGgIWpdXGyfesLm6ecoMl2u5BkWuClujC6YvL`)
                            image_input_box.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover; margin: auto;')
                            image_input_box.setAttribute('id', 'use_emoticon')
                            image_input_box.setAttribute('alt', `egg`)
                            image_input_box.addEventListener('click', function () {
                                image_input_box.removeAttribute('src')
                                image_input_box.removeAttribute('alt')
                                image_input_box.removeAttribute('style')
                            })
                        } else {
                            image_input_box.setAttribute('src', `https://lh3.googleusercontent.com/RxYXrd8Owa7gSCTtHtrxVpwoZwTgq8MwGgIWpdXGyfesLm6ecoMl2u5BkWuClujC6YvL`)
                            image_input_box.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover; margin: auto;')
                            image_input_box.setAttribute('id', 'use_emoticon')
                            image_input_box.setAttribute('alt', `egg`)
                            image_input_box.addEventListener('click', function () {
                                image_input_box.removeAttribute('src')
                                image_input_box.removeAttribute('alt')
                                image_input_box.removeAttribute('style')
                            })
                        }
                    }
                    else if (a == emojiNum - 1) {
                        commentInputChange += valueSplit[a]
                    }
                    else if (a == emojiNum + 1) {
                        commentInputChange += valueSplit[a]
                    }
                    else {
                        commentInputChange += valueSplit[a] + ':'
                    }
                };
                commentInputBox.value = commentInputChange
                break
            }
        };
    }
});
