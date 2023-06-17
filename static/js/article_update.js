const searchInput = document.getElementById("tags");

// 문자열 형식
function testListTextGet() {
    let tagListText = ''
    let ul = document.getElementById("tag_ul")
    const tagList = ul.childNodes
    for (let i = 1; i < tagList.length; i++) {
        tagListText += '$%#&#^)!()' + tagList[i].textContent
    }
    return tagListText
}
console.log("게시글수정로드")
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");
// 평점 range사용으로 게이지 연출 부분
document.querySelector('#score_in').addEventListener('input', element => {
    document.querySelector('#score_out').value = element.target.value;
});
// 평점 range로 수정한 범위 number type에 value값 주입
document.querySelector('#score_out').addEventListener('input', element => {
    document.querySelector('#score_in').value = element.target.value
})

// 게시글 정보 가져오기
async function articleLoad() {
    const response = await fetch(`${back_base_url}/articles/${articleId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET",
    });
    let data = await response.json()
    let title = document.getElementById("title")
    let content = document.getElementById("content")
    let score = document.getElementById("score_in")
    let savedLocation = document.getElementById("roadAddress")

    title.value = data.title
    content.value = data.content
    score.value = data.score
    savedLocation.value = data.road_address
    savedLocation.name = data.location

    let mainImageDiv = document.getElementById("main_image")
    const mainImage = document.createElement('img')
    mainImage.setAttribute('style', 'width: 150px; height: 150px; object-fit: cover; border-radius:10px;')
    mainImage.src = `${image_url}${data.main_image}`

    mainImageDiv.appendChild(mainImage)

    const articleImages = document.getElementById('images')
    data.image.forEach(element => {
        const articleImage = document.createElement('img')
        articleImage.src = `${image_url}${element.image}`
        articleImage.setAttribute('alt', `${element.id}`)
        articleImage.setAttribute('style', 'width: 130px; height: 130px; object-fit: cover; border-radius:10px;')
        articleImages.appendChild(articleImage)
    })

    const removeImages = document.getElementById('images_remove')
    const articleImgs = articleImages.childNodes
    console.log(articleImgs)
    articleImgs.forEach(element => {
        element.addEventListener('click', function () {
            const num = document.createElement('div')
            num.className = element.alt
            removeImages.appendChild(num)
            element.remove()
        })
    });

    console.log(data)
    console.log(response)
    // main_image.files = data.main_image
    // image = data.image

    // 기존태그 클릭시 제거하는거 추가 필요
    let ul = document.getElementById("tag_ul")
    data.tags.forEach(element => {
        const tag = document.createElement("div")
        tag.setAttribute('class','tag_add')
        tag.innerText = element.tag
        ul.appendChild(tag)
        tag.addEventListener('click', function () {
            tag.remove()
        })
    });

    // 저장버튼 클릭
    const updateButton = document.getElementById('update_article')
    updateButton.addEventListener('click', function () {
        articleUpdate(data)
    })
}


// 수정 요청
async function articleUpdate(articleData) {
    updateLocation = document.getElementById("roadAddress")

    const formData = new FormData();

    // 데이터 전송을 위한 변수 선언
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const score = document.getElementById("score_in").value;
    const image = document.getElementById("add_main_img").files[0];

    // 지도 변경이 있으면
    if (updateLocation.value != articleData.road_address) {
        const query = updateLocation.value
        formData.append('query', query)
    }

    formData.append('title', title)
    formData.append('content', content)
    formData.append('score', score)
    if (image != undefined) {
        formData.append('main_image', image)
    }
    formData.append('tags', testListTextGet())
    formData.append('location', parseInt(updateLocation.name))

    const images = document.getElementById("add_imgs").files;
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i])
    };

    // 제거 할 이미지 있으면 보내주기
    let imagesRmList = []

    const imagesRm = document.getElementById('images_remove')
    for (let i = 0; i < imagesRm.childNodes.length; i++) {
        imagesRmList.push(imagesRm.childNodes[i].className)
    }
    formData.append('images_rm', imagesRmList)
    console.log(imagesRmList)

    const response = await fetch(`${back_base_url}/articles/${articleId}/`, {

        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: formData,
    });
    const data = await response.json()
    if (response.status == 200) {
        alert('수정완료')
        window.location.href = `${front_base_url}/templates/article_detail.html?id=${articleId}`
    }
}



window.onload = function () {
    articleLoad()

    let ul = document.getElementById("tag_ul")

    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            // 엔터 키 입력
            let tagname = searchInput.value.trim()
    
            if (tagname == '') {
                alert('태그를 작성해주세요!')
            } else {
                if (testListTextGet().split('$%#&#^)!()').includes(tagname)) {
                    searchInput.value = ''
                    alert("이미 입력된 태그입니다!")
                } else {
                    const tagli = document.createElement('div')
                    tagli.setAttribute("class", "tag_add")
                    tagli.addEventListener('click', function () {
                        tagli.remove()
                    })
                    tagli.textContent = tagname
                    ul.appendChild(tagli)
                    searchInput.value = ''
                }
            }
        }
        if (event.key === 'Backspace') {
            const addedTags = document.getElementById('tag_ul').childNodes
            let lastNum = addedTags.length
            if (searchInput.value == ''){
                if (confirm("태그 삭제?")) {
                    addedTags[lastNum-1].remove()
                } else {
                    return false;
                }
            }
        }
    });
    document.getElementById("roadAddress").addEventListener("click", function () { //주소입력칸을 클릭하면
        //카카오 지도 발생
        new daum.Postcode({
            oncomplete: function (data) { //선택시 입력값 세팅
                document.getElementById("roadAddress").value = data.roadAddress // 도로명 주소 넣기
            }
        }).open()
    })
    document.getElementById("update_article").addEventListener("click", function () { //주소입력칸을 클릭하면

        // 데이터 전송을 위한 변수 선언
        const formData = new FormData();
        const data = document.getElementById("roadAddress").value;
        const title = document.getElementById("title").value;
        const image = document.getElementById("images").files;
        const main_image = document.getElementById("main_image").files;
        const content = document.getElementById("content").value;
        const score = document.getElementById("score_in").value;
    }
    )
}
