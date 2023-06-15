console.log("js연결!")

token = localStorage.getItem("access")
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");
window.onload = async () => {
    const response = await fetch(`${back_base_url}/articles/${articleId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET",
    });
    let data = await response.json()
    let add_html = document.querySelector('#add_html')
    let articleHtml = ``

    console.log(data)
    console.log(response)


    if (response.status == 200) {
        console.log(data)
        articleHtml = `
            <div class="detail_box">
                <div class="title_box">
                    <div class="title_left">
                        <p class="user">
                            작성자: ${data.user}
                        </p><!-- e:user -->
                        <p class="title">
                            제목 : ${data.title}
                        </p><!-- e:title -->
                    </div><!-- e:title_left -->
                    <div class="title_right">
                        <button class="btn btn-outline-secondary" type="button">수정</button>
                        <button class="btn btn-outline-secondary" type="button">삭제</button>
                        <button class="btn btn-outline-secondary" type="button">목록</button>
                    </div><!-- e:title_right -->
                </div><!-- e:title_box -->
                <div id="image_box">

                </div><!-- e:image_box -->
                <div class="content_box">
                    ${data.content}
                </div><!-- e:content_box -->
                <div class="map_box">
                    <div class="map_title">
                        주소 : ${data.road_address}
                    </div>
                    <div class="map_content">
                        위도 : ${data.coordinate_x}
                        경도 : ${data.coordinate_y}
                    </div>
                </div><!-- e:map_box -->
                <div class="comment_box">
                    댓글
                </div><!-- e:comment_box -->
            </div><!-- e:detail_box -->
                `
    }
    add_html.innerHTML = articleHtml
    //다중이미지 출력부분
    let image_box = document.querySelector('#image_box')
    let imageHtml = ``
    for (let i = 0; i < await data.image.length; i++) {
        console.log(data.image[i])
        imageHtml += `
        <img src="${back_base_url}${data.image[i]}" alt="자동추가되게하자~">
        `
        // tag_add += '#' + data.results[i].tags[a].tag + ' '
    }
    image_box.innerHTML = imageHtml
}

