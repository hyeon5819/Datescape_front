if (!localStorage.getItem("access")) {
    alert("로그인이 필요합니다.")
    window.location.href = `${front_base_url}/templates/logintemp.html/`
}
const myPage = document.getElementById("my_page")
// let access = localStorage.getItem("access")
function detail_page(article_id) {
    location.href = `${front_base_url}/templates/article_detail.html?id=${article_id}&/`
}
async function GetArticle(formData) {
    const myPage = document.getElementById("my_page")
    myPage.innerHTML = `
    <div class="col" style="cursor: pointer;" onclick="detail_page)">
        <div class="card">

            <div class="card-body">
                <h5 class="card-title"> 작성한 게시글이 존재하지 않습니다</h5>
                <p class="card-text content"></p>
            </div>

        </div>
    </div><!-- e:col -->
    `
    articleHtml = ``
    const response = await fetch(`${back_base_url}/users/profile/article/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
        body: formData,
    })
    if (response.status == 200) {
        data = await response.json();
        myPage.innerHTML = ``
        for (let i = 0; i < data.length; i++) {
            const article = data[i]
            articleHtml = `
            <div class="col" style="cursor: pointer;" onclick="detail_page(${article.id})">
                <div class="card">
                    <img src="${image_url}${article.main_image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text content" id="content-${article.id}"></p>
                    </div>
                    <div class="card-footer" style="text-align: center;>
                        <small class="text-muted"">Name : ${article.user}</small>
                    </div>
                </div>
            </div><!-- e:col -->
            `

            myPage.innerHTML += articleHtml
            const article_content = document.getElementById(`content-${article.id}`)
            article_content.innerText = article.content
        }
        return;
    } else {
        alert(response.status);
    }
}
async function GetComment(formData) {
    const myPage = document.getElementById("my_page")
    myPage.innerHTML = `
    <div class="col" style="cursor: pointer;" onclick="detail_page)">
        <div class="card">

            <div class="card-body">
                <h5 class="card-title"> 작성한 댓글이 존재하지 않습니다</h5>
                <p class="card-text content"></p>
            </div>

        </div>
    </div><!-- e:col -->
    `
    commentHtml = ``
    const response = await fetch(`${back_base_url}/users/profile/comment/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
        body: formData,
    })
    if (response.status == 200) {
        const myPage = document.getElementById("my_page")
        myPage.innerHTML = ``
        data = await response.json();
        for (let i = 0; i < data.length; i++) {
            const comment = data[i]
            commentHtml = `
            <div class="col" style="cursor: pointer;" onclick="detail_page(${comment.article_id})">
                <div class="card">
                    <img src="${image_url}${comment.article_main_image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${comment.article_title}</h5>
                        <p class="card-text content" id="comment-${comment.article_id}"></p>
                    </div>
                    <div class="card-footer" style="text-align: center;>
                        <small class="text-muted">Name : ${comment.username}</small>
                    </div>
                </div>
            </div><!-- e:col -->
            `
            myPage.innerHTML += commentHtml
            const comment_content = document.getElementById(`comment-${comment.article_id}`)
            comment_content.innerText = comment.article_content

        }
        return;
    } else {
        alert(response.status);
    }
}
async function GetBookmark(formData) {
    const myPage = document.getElementById("my_page")
    myPage.innerHTML = `
    <div class="col" style="cursor: pointer;" onclick="detail_page)">
        <div class="card">

            <div class="card-body">
                <h5 class="card-title"> 북마크를 한 적이 없습니다</h5>
                <p class="card-text content"></p>
            </div>

        </div>
    </div><!-- e:col -->
    `
    bookmarkHtml = ``
    const response = await fetch(`${back_base_url}/users/profile/bookmark/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
        body: formData,
    })
    if (response.status == 200) {
        data = await response.json();
        myPage.innerHTML = ``
        for (let i = 0; i < data.length; i++) {
            const bookmark = data[i]
            bookmarkHtml = `
            <div class="col" style="cursor: pointer;" onclick="detail_page(${bookmark.article_id})">
                <div class="card">
                    <img src="${image_url}${bookmark.article_main_image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${bookmark.article_title}</h5>
                        <p class="card-text content" id="bookmark-${bookmark.article_id}"></p>
                    </div>
                    <div class="card-footer" style="text-align: center;>
                        <small class="text-muted">작성자 : ${bookmark.article_user}</small>
                    </div>
                </div>
            </div><!-- e:col -->
            `
            myPage.innerHTML += bookmarkHtml
            const bookmark_content = document.getElementById(`bookmark-${bookmark.article_id}`)
            bookmark_content.innerText = bookmark.article_content

        }
        return;
    } else {
        alert(response.status);
    }
}
async function GetEmoticonBuy(formData) {
    const response = await fetch(`${back_base_url}/users/profile/emoticon/buy`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
        body: formData,
    })
    if (response.status == 200) {
        data = await response.json();

        return;
    } else {
        alert(response.status);
    }
}