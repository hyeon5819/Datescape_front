const searchInput = document.getElementById("tags");
const ul = document.getElementById("tag_ul")
let page_num = 0
// 문자열 형식
function testListTextGet() {
    let tagListText = ''
    const tagList = ul.childNodes
    for (let i = 1; i < tagList.length; i++) {
        tagListText += '$%#&#^)!()' + tagList[i].textContent
    }

    return tagListText
}


window.onload = function () {
    // 엔터로 태그 추가
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            // 엔터 키 입력
            let tagname = searchInput.value.trim()

            if (tagname == '') {
                alert('태그를 작성해주세요!')
            } else {
                if (testListTextGet().split('$%#&#^)!()').includes(tagname)) {
                    searchInput.value = ''
                    alert("이미 입력된 태그입니다!")
                } else {
                    const tagli = document.createElement('li')
                    tagli.addEventListener('click', function () {
                        tagli.remove()
                    })
                    tagli.textContent = tagname
                    ul.appendChild(tagli)
                    searchInput.value = ''
                }
            }
        }
    });
    //주소가져오기
    //게시글을저장하면 작성한 게시글 페이지로 이동 시키기
    document.getElementById("roadAddress").addEventListener("click", function () { //주소입력칸을 클릭하면
        //카카오 지도 발생
        new daum.Postcode({
            oncomplete: function (data) { //선택시 입력값 세팅
                document.getElementById("roadAddress").value = data.roadAddress // 도로명 주소 넣기
            }
        }).open()
    })
    const access = localStorage.getItem("access");
    async function GetArticleId(article_id) {
        const response = await fetch(`${back_base_url}/articles/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: 'GET',
        })
        const data = await response.json()
        page_num = data.count
        window.location.href = `${front_base_url}/templates/article_detail.html?id=${page_num}`
    }
    // GetArticleId(page_num)
    //저장
    document.getElementById("save_db").addEventListener("click", function () { //주소입력칸을 클릭하면

        // 데이터 전송을 위한 변수 선언
        const formData = new FormData();
        const data = document.getElementById("roadAddress").value;
        const title = document.getElementById("title").value;
        const image = document.getElementById("images").files;
        const main_image = document.getElementById("main_image").files;
        const content = document.getElementById("content").value;
        const score = document.getElementById("score").value;
        const tags = testListTextGet();
        //formData.append('query', data)
        formData.append('query', data);
        formData.append('title', title);
        formData.append('content', content);
        for (let i = 0; i < image.length; i++) {
            formData.append("images", image[i]);
        }
        for (let i = 0; i < image.length; i++) {
            formData.append("main_image", main_image[i]);
        }
        formData.append('score', score);
        formData.append('tags', tags);
        fetch(`${back_base_url}/articles/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "POST",
            body: formData,
        })
            .then(response => {
                console.log(response, "response")
                console.log(data, "data")
                if (!response.ok) {
                    throw new Error('저장실패');
                }
                return document.getElementById("roadAddress").value;
            })
            .then(data => {
                console.log('data', data);
                console.log('저장완료', data);
                GetArticleId(page_num)
                alert("게시완료")
            })
            .catch(error => {
                console.error(error);
            });

    })
}

