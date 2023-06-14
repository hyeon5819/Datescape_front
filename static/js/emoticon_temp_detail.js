const urlParams = new URLSearchParams(window.location.search);
const emoticonId = urlParams.get("emoticon_id");

const userId = JSON.parse(localStorage.getItem("payload")).user_id;

// 이모티콘 가져오기
async function getEmoticon(emoticon_id) {
    const access = localStorage.getItem("access");

    const response = await fetch(`${back_base_url}/emoticons/${emoticon_id}/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
    });

    if (response.status == 200) {
        response_json = await response.json();
        return response_json;
    } else {
        alert(response.status);
    }
}

// 이모티콘 삭제
async function emoticonDelete(emoticon_id, creator) {
    const access = localStorage.getItem("access");

    if (userId == creator) {
        if (confirm("삭제하시겠습니까?")) {
            const formData = new FormData()

            formData.append("emoticon_id", emoticonId)

            const response = await fetch(`${back_base_url}/emoticons/`, {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                method: "DELETE",
                body: formData,
            }
            );
            if (response.status == 204) {
                alert("삭제되었습니다.");
                window.location.href = `${front_base_url}/templates/emoticon_templist.html`
            } else {
                alert("권한이 없습니다!");
            }
        } else {
            // 취소 버튼을 눌렀을 경우
            return false;
        }
    } else {
        alert("삭제 권한이 없습니다!")
    }
}
// 이모티콘 수정
async function emoticonUpdate(emoticon_id, creator) {

    if (userId == creator) {
        console.log('수정')
        let emoticons = document.getElementById('images')
        let emoticonImages = emoticons.childNodes

        let emoticonTitle = document.getElementById('title')
        let titleValue = emoticonTitle.innerText
        emoticonTitle.innerText = ''
        let titleInput = document.createElement('input')
        titleInput.setAttribute('id', 'title_input')
        titleInput.placeholder = titleValue
        emoticonTitle.appendChild(titleInput)


        // 이모티콘 누르면 제거
        const removeImages = document.getElementById('remove_images') //제거할 리스트
        emoticonImages.forEach(element => {
            element.addEventListener('click', function () {
                const num = document.createElement('div')
                num.className = element.alt
                removeImages.appendChild(num)
                element.remove()
            })
        });

        // 수정할때 이미지만 받기 검증
        // 용량 확인하기

        const imageInput = document.getElementById('image_input')
        const updateImageInput = document.createElement('input')
        updateImageInput.setAttribute('type', 'file')
        updateImageInput.setAttribute('id', 'image')
        updateImageInput.setAttribute('accept', 'image/*')
        // 이모티콘 이미지파일만 받기
        const acceptFile = ['xbm', 'tif', 'pjp', 'apng', 'svgz', 'jpg', 'jpeg', 'ico', 'tiff', 'gif', 'svg', 'jfif', 'webp', 'png', 'bmp', 'pjpeg', 'avif']

        updateImageInput.addEventListener("change", function () {
            let fileList = updateImageInput.files;

            // 이미지 파일인지 검증
            for (let i = 0; i < fileList.length; i++) {
                let fileName = fileList[i].name.split('.')

                if (acceptFile.includes(fileName[fileName.length - 1])) {
                } else {
                    alert(`이미지 파일만 가능합니다!\n가능 확장자명: ${acceptFile}`)
                    updateImageInput.value = []
                }
            }
        });

        updateImageInput.setAttribute('multiple', 'true')
        const updateImageLabel = document.createElement('label')
        updateImageLabel.innerText = '추가할 이미지 : '
        updateImageLabel.setAttribute('class', 'mb-3')
        imageInput.appendChild(updateImageLabel)
        imageInput.appendChild(updateImageInput)



        let updateConfirmButton = document.getElementById('update_button')
        updateConfirmButton.setAttribute('onclick', `emoticonUpdateConfirm(${emoticon_id})`)

        let cancelConfirmButton = document.getElementById('delete_button')
        cancelConfirmButton.setAttribute('onclick', 'location.reload()')
        cancelConfirmButton.innerText = '취소'
    } else {
        alert("수정 권한이 없습니다!")
    }
}

// 수정 확인
async function emoticonUpdateConfirm(emoticon_id) {
    const access = localStorage.getItem("access");
    // 제거할 이미지 선택
    const removeImages = document.getElementById('remove_images').childNodes
    const removeImagesList = []
    removeImages.forEach(element => {
        removeImagesList.push(element.className)
    });
    // 제목 수정
    let title = document.getElementById('title_input').value
    if (title == '') {
        title = document.getElementById('title_input').placeholder
    }
    // 이미지 추가
    const addImages = document.getElementById('image').files

    const formData = new FormData()

    formData.append("title", title)
    formData.append("emoticon_id", emoticonId)
    formData.append("remove_images", removeImagesList)
    for (let i = 0; i < addImages.length; i++) {
        formData.append("images", addImages[i]);
        console.log(addImages[i].size)
        formData.append("file_size", addImages[i].size);
    }

    const response = await fetch(`${back_base_url}/emoticons/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "PUT",
        body: formData,
    });
    const data = await response.json();

    if (response.status == 200) {
        alert("수정 완료!");
        window.location.href = `${front_base_url}/templates/emoticon_temp_detail.html?emoticon_id=${emoticon_id}`;
    } else {
        alert("잘못 된 요청입니다.");
    }
}

window.onload = async function () {
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

    const parentsDiv = document.getElementById('parents')

    const updateButton = document.createElement('button')
    updateButton.innerText = '수정'
    updateButton.setAttribute('onclick', `emoticonUpdate(${emoticonId}, ${response.creator})`)
    updateButton.setAttribute('id', 'update_button')
    if (response.creator == userId) {
        updateButton.setAttribute('style', 'display:inline')
    } else {
        updateButton.setAttribute('style', 'display:none')
    }
    parentsDiv.appendChild(updateButton)

    const deleteButton = document.createElement('button')
    deleteButton.innerText = '삭제'
    deleteButton.setAttribute('onclick', `emoticonDelete(${emoticonId}, ${response.creator})`)
    deleteButton.setAttribute('id', 'delete_button')
    if (response.creator == userId) {
        deleteButton.setAttribute('style', 'display:inline')
    } else {
        deleteButton.setAttribute('style', 'display:none')
    }
    parentsDiv.appendChild(deleteButton)
}
