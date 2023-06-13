// 게시글 id
const urlGetParams = new URLSearchParams(window.location.search);
const articleId = urlGetParams.get("id");


// 이모티콘 보이기/숨기기
function emoticonToggle(emoticon_popup) {
    const emoticonPopup = document.getElementById(emoticon_popup.id)

    if (emoticonPopup.style.display == 'none') {
        emoticonPopup.setAttribute('style', 'position: relative; z-index: 1; margin-top: -17px; display: block;')
    } else if (emoticonPopup.style.display == 'block') {
        emoticonPopup.setAttribute('style', 'position: relative; z-index: 1; margin-top: -17px; display: none;')
    }
}


// 댓글 불러오기
async function getComment() {
    const access = localStorage.getItem("access");

    const response = await fetch(`${back_base_url}/articles/${articleId}/comments/`,{
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
    });

    if (response.status == 200) {
        response_json = await response.json();
        console.log('댓글', response_json)
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
        console.log('구매한 이모티콘', response_json)
        return response_json;
    } else {
        alert(response.status);
    }
}


// 이모티콘 버튼에 리스트 만들기
async function emoticonButtonList(user_emoticon_list, emoticon_popup, emoticonbtn, emoticon_images, use_emoticon, comment_content) {
    const emoticonPopup = document.getElementById(emoticon_popup)
    // 유저가 가진 이모티콘 가져오기
    if (localStorage.getItem("access")) {
        const userId = JSON.parse(localStorage.getItem("payload")).user_id

        //리스트 첫번째에 이모지 넣어주기
        baseEmojiList(user_emoticon_list, emoticon_popup, emoticonbtn, emoticon_images, comment_content)

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
                        emoticonToggle(emoticonPopup)
                    })
                    emoticonImages.appendChild(emoticonImage)
                });
            });

            userEmoticon.appendChild(userEmoticonButton)

            const userEmoticonButtonSpan = document.createElement('span')
            userEmoticonButtonSpan.innerText = user_emoticon.title
            userEmoticonButton.appendChild(userEmoticonButtonSpan)
        });
    }
    emoticonPopup.style.display = 'block'
    const emotiBtn = document.getElementById(emoticonbtn)
    emotiBtn.setAttribute('onclick', `emoticonToggle(${emoticonPopup.id})`)
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
                const access = localStorage.getItem("access");

                const formData = new FormData();
                formData.append("comment", commentContent);
                formData.append("use_emoticon", commentEmoticon);

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
            const access = localStorage.getItem("access");

            const formData = new FormData();
            formData.append("comment", commentContent);
            formData.append("use_emoticon", commentEmoticon);

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
async function commentUpdate(comment_id) {
    const comment = document.getElementById(`comment${comment_id}`)
    let comment_save = document.getElementById(`comment${comment_id}`).innerHTML

    const commentP = comment.childNodes[1].lastChild
    const commentPValue = commentP.innerText

    const commentUsedEmoticon = comment.childNodes[1].firstChild
    const commentUsedEmoticonId = commentUsedEmoticon.alt
    const commentUsedEmoticonSrc = commentUsedEmoticon.src

    console.log(commentUsedEmoticonSrc)
    const emoticonDiv = document.createElement('div')
    emoticonDiv.setAttribute('class', 'card text-center')

    const updateCommentEmoticon = document.createElement('img')
    updateCommentEmoticon.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover; margin: auto;')
    updateCommentEmoticon.setAttribute('id', 'update_use_emoticon')
    if (commentUsedEmoticonSrc == undefined) {
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
    emoticonDiv.appendChild(updateCommentEmoticon)
    commentUsedEmoticon.style.display = 'none'

    const updateEmoticonButton = document.createElement('button')
    updateEmoticonButton.innerText = '이모티콘'
    updateEmoticonButton.setAttribute('class', 'mb-3')
    updateEmoticonButton.setAttribute('id', 'update_emoticon_button')
    updateEmoticonButton.setAttribute('onclick', `emoticonButtonList("update_emoticon_list", "update_emoticon_popup", "update_emoticon_button", "update_emoticon_images", "update_use_emoticon", "update_input${comment_id}")`)

    const popupParentsDiv = document.createElement('div')
    popupParentsDiv.setAttribute('style', 'height: 0px;')

    const popupDiv = document.createElement('div')
    popupDiv.setAttribute('class', 'card text-center;')
    popupDiv.setAttribute('style', 'position: relative; z-index: 1; margin-top: -17px; display: none;')
    popupDiv.setAttribute('id', 'update_emoticon_popup')
    popupParentsDiv.appendChild(popupDiv)

    const chDiv = document.createElement('div')
    chDiv.setAttribute('class', 'card-header')
    popupDiv.appendChild(chDiv)

    const updateEmoticonList = document.createElement('ul')
    updateEmoticonList.setAttribute('class', 'nav nav-tabs card-header-tabs mb-3')
    updateEmoticonList.setAttribute('id', 'update_emoticon_list')
    chDiv.appendChild(updateEmoticonList)

    const updateEmoticonImages = document.createElement('div')
    updateEmoticonImages.setAttribute('class', 'row row-cols-5 row-cols-md-5')
    updateEmoticonImages.setAttribute('style', 'overflow-y: scroll; height: 220px;')
    updateEmoticonImages.setAttribute('id', 'update_emoticon_images')
    chDiv.appendChild(updateEmoticonImages)

    emoticonDiv.appendChild(updateEmoticonButton)
    emoticonDiv.appendChild(popupParentsDiv)

    comment.childNodes[1].appendChild(emoticonDiv)

    const updateCommentInput = document.createElement('input')
    updateCommentInput.setAttribute('type', 'text')
    updateCommentInput.setAttribute('class', 'form-control')
    updateCommentInput.setAttribute('id', `update_input${comment_id}`)
    updateCommentInput.value = commentPValue
    comment.childNodes[1].appendChild(updateCommentInput)
    commentP.style.display = 'none'

    const updateButton = comment.childNodes[2].firstChild
    updateButton.setAttribute('onclick', `commentUpdateConfirm(${comment_id})`)

    const cancelButton = comment.childNodes[2].lastChild
    cancelButton.innerText = '취소'
    cancelButton.setAttribute('onclick', ``)
    cancelButton.addEventListener('click', function () {
        comment.innerHTML = comment_save
    });
}


// 수정 확인
async function commentUpdateConfirm(comment_id) {
    const commentUpdateContent = document.getElementById(`update_input${comment_id}`).value;
    const commentUpdateEmoticon = document.getElementById(`update_use_emoticon`).alt;

    if (commentUpdateContent == "") {
        if (commentUpdateEmoticon == "") {
            alert("내용을 입력해주세요!")
        } else {
            const access = localStorage.getItem("access");

            const formData = new FormData();
            formData.append("comment", commentUpdateContent);
            formData.append("comment_id", `${comment_id}`);
            formData.append("use_emoticon", commentUpdateEmoticon);

            const response = await fetch(`${back_base_url}/articles/${articleId}/comments/`, {
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
        const access = localStorage.getItem("access");

        const formData = new FormData();
        formData.append("comment", commentUpdateContent);
        formData.append("comment_id", `${comment_id}`);
        formData.append("use_emoticon", commentUpdateEmoticon);

        const response = await fetch(`${back_base_url}/articles/${articleId}/comments/`, {
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
    const access = localStorage.getItem("access");

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


window.onload = async function () {    
    const access = localStorage.getItem("access");

    const response_comment = await getComment();

    // 이모티콘 이미지 보기

    // 등록버튼 함수 넣어주기
    const commentCreateButton = document.getElementById("comment_create")

    commentCreateButton.setAttribute('onclick', `commentCreate()`)

    // 댓글 리스트 보여주기
    const commentContent = document.getElementById("comment");

    // 이모티콘 이미지 다 가져오기
    const response_emoticon = await fetch(`${back_base_url}/emoticons/images/`, {
        method: "GET",
    });
    const data = await response_emoticon.json();
    try{
        response_comment.forEach(element => {
            const cardDiv = document.createElement("div")
            cardDiv.setAttribute('class', 'card')
            cardDiv.setAttribute('style', 'width: 100%; flex-direction: row;')
            cardDiv.setAttribute('id', 'comment' + `${element.id}`)
            cardDiv.setAttribute('value', element.id)
            commentContent.appendChild(cardDiv)

            const nicknameDiv = document.createElement("div")
            nicknameDiv.setAttribute('style', 'width: 15%;display: flex; flex-direction: column;')
            nicknameDiv.innerText = element.username
            cardDiv.appendChild(nicknameDiv)

            //신고하기
            //위치만 넣어놈
            const reportButton = document.createElement("button")
            reportButton.setAttribute('style', 'width: 50%; margin: auto auto 5px auto; font-size: 20px; border: none;')
            reportButton.setAttribute('onclick', `commentReport(${element.id})`)
            reportButton.innerText = '🚨'
            nicknameDiv.appendChild(reportButton)
            //신고하기

            const commentDiv = document.createElement("div")
            commentDiv.setAttribute('class', 'card-body')
            commentDiv.setAttribute('style', 'width: 75%;')

            const commentEmoticon = document.createElement('img')

            data.forEach(usedImage => {
                if (usedImage.id == element.use_emoticon) {
                    const usedemoticonimage = `${image_url}${usedImage.image}`
                    commentEmoticon.setAttribute('src', usedemoticonimage)
                    commentEmoticon.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover;')
                    commentEmoticon.setAttribute('id', `comment_use_emoticon${usedImage.id}`)
                    commentEmoticon.setAttribute('alt', `${usedImage.id}`)
                    commentDiv.appendChild(commentEmoticon)
                }
            });

            const commentP = document.createElement("p")
            commentP.innerText = element.comment
            commentP.setAttribute('style', 'font-size: 20px;')
            commentDiv.appendChild(commentP)
            cardDiv.appendChild(commentDiv)

            const buttonDiv = document.createElement("div")
            cardDiv.appendChild(buttonDiv)
            buttonDiv.setAttribute('style', 'width: 10%;')

            if (localStorage.getItem("access")) {
                const userId = JSON.parse(localStorage.getItem("payload")).user_id

                if (element.writer == userId) {
                    const updateButton = document.createElement("button")
                    updateButton.setAttribute('onclick', `commentUpdate(${element.id})`)
                    updateButton.setAttribute('class', 'mt-3')
                    updateButton.innerText = '수정'
                    buttonDiv.appendChild(updateButton)

                    const deleteButton = document.createElement("button")
                    deleteButton.setAttribute('onclick', `commentDelete(${element.id})`)
                    deleteButton.setAttribute('class', 'mt-3')
                    deleteButton.innerText = '삭제'
                    buttonDiv.appendChild(deleteButton)
                }
            }

            // 댓글 좋아요
            console.log('좋아요 수', element.likers.length)

            const userId = JSON.parse(localStorage.getItem("payload")).user_id

            let likeButton = document.createElement("button")
            cardDiv.appendChild(likeButton)
            likeButton.setAttribute('style', 'width: 10%; border: none;')

            likeButton.innerText = `🤍\n${element.likers.length}`



            for (let i = 0; i < element.likers.length; i++) {
                if(userId == element.likers[i].likers){
                    likeButton.innerText = `❤️\n${element.likers.length}`
                    break;
                }else{
                    likeButton.innerText = `🤍\n${element.likers.length}`
                }
            }

            likeButton.setAttribute('onclick', `commentLike(${element.id})`)
            likeButton.setAttribute('id', `like${element.id}`)

        });
    } catch (err) {
        console.log('err')
    }
};


// 댓글 좋아요
async function commentLike(comment_id){
    const access = localStorage.getItem("access")

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
        if (data.message == "좋아요!"){
            heart.innerText = `❤️\n${data.comment_likes}`
        }else if(data.message == "좋아요 취소!"){
            heart.innerText = `🤍\n${data.comment_likes}`
        }
    } else {
        alert("잘못 된 요청입니다.");
    }
}

const commentInputBox = document.getElementById("comment_content");

// 이모지 텍스트로 넣어주기
commentInputBox.addEventListener("input", function () {
    const valueSplit = commentInputBox.value.split(":")
    if (valueSplit.length >= 2){
        for (let i = 1; i < valueSplit.length; i++) {
            if(valueSplit[i-1] in emojiTagDic){
                valueSplit[i-1] = emojiTagDic[valueSplit[i-1]]

                // 리스트 마지막 '' 제거
                valueSplit.splice(i,1)

                commentInputBox.value = ''
                for (let i = 0; i < valueSplit.length; i++) {
                        if(i >= valueSplit.length-2){
                            commentInputBox.value += valueSplit[i]
                        } else {
                            commentInputBox.value += valueSplit[i] + ":"
                        }
                };
                break
            }
        };
    }
});
