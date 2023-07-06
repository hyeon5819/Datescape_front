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
            <div class="col article_detail" style = "cursor: pointer;" onclick="detail_page(${article.id})">
                <div class="card h-100">
                <div style="width: 254px; height: 234px;" >
                    <img text-align:center;" src="${image_url}${article.main_image}" class="card-img-top cardimg" alt="...">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title cardtitle" id ="article-title-${article.id}"></h5>
                        <p class="card-text content" id="content-${article.id}" style="color:gray;"></p>
                        </div><!-- e:body -->
                    <div class="card-footer d-flex justify-content-between">
                        <span class="text-muted" id="article-user-${article.id}"></span>
                    </div><!-- e:footer -->
                </div>
            </div>
            `

            myPage.innerHTML += articleHtml
            const article_content = document.getElementById(`content-${article.id}`)
            article_content.innerText = article.content
            const article_title = document.getElementById(`article-title-${article.id}`)
            article_title.innerText = article.title
            const article_user = document.getElementById(`article-user-${article.id}`)
            article_user.innerText = article.user
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
            <div class="col article_detail" style = "cursor: pointer;" onclick="detail_page(${comment.article_id})">
                <div class="card h-100">
                <div style="width: 254px; height: 234px;" >
                    <img text-align:center;" src="${image_url}${comment.article_main_image}" class="card-img-top cardimg" alt="...">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title cardtitle" id ="comment-title-${comment.article_id}"></h5>
                        <p class="card-text content" id="comment-${comment.article_id}" style="color:gray;"></p>
                        </div><!-- e:body -->
                    <div class="card-footer d-flex justify-content-between">
                        <span class="text-muted" id="comment-user-${comment.article_id}"></span>
                </div >
            </div >
                `
            myPage.innerHTML += commentHtml
            const comment_content = document.getElementById(`comment-${comment.article_id}`)
            comment_content.innerText = comment.article_content
            const comment_title = document.getElementById(`comment-title-${comment.article_id}`)
            comment_title.innerText = comment.article_title
            const comment_user = document.getElementById(`comment-user-${comment.article_id}`)
            comment_user.innerText = comment.article_user

        }
        return;
    } else {
        alert(response.status);
    }
}
async function GetBookmark(formData) {
    const myPage = document.getElementById("my_page")
    myPage.innerHTML = `
                <div div class="col" style = "cursor: pointer;"" >
                    <div class="card">

                        <div class="card-body">
                            <h5 class="card-title"> 북마크를 한 적이 없습니다</h5>
                            <p class="card-text content"></p>
                        </div>

                    </div>
    </div>
                `
    bookmarkHtml = ``
    const response = await fetch(`${back_base_url}/users/profile/bookmark/`, {
        headers: {
            Authorization: `Bearer ${access} `,
        },
        method: "GET",
        body: formData,
    })
    if (response.status == 200) {
        data = await response.json();
        myPage.innerHTML = ``
        for (let i = 0; i < data.length; i++) {
            const bookmark = data[i]
            console.log(bookmark)
            bookmarkHtml = `
            <div class="col article_detail" style = "cursor: pointer;" onclick="detail_page(${bookmark.article_id})">
                <div class="card h-100">
                <div style="width: 254px; height: 234px;" >
                    <img text-align:center;" src="${image_url}${bookmark.article_main_image}" class="card-img-top cardimg" alt="...">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title cardtitle" id ="bookmark-title-${bookmark.article_id}"></h5>
                        <p class="card-text content" id="bookmark-${bookmark.article_id}" style="color:gray;"></p>
                        </div><!-- e:body -->
                    <div class="card-footer d-flex justify-content-between">
                        <span class="text-muted" id="bookmark-user-${bookmark.article_id}"></span>
                </div >
            </div >
                `
            myPage.innerHTML += bookmarkHtml
            const bookmark_content = document.getElementById(`bookmark-${bookmark.article_id}`)
            bookmark_content.innerText = bookmark.article_content
            const bookmark_title = document.getElementById(`bookmark-title-${bookmark.article_id}`)
            bookmark_title.innerText = bookmark.article_title
            const bookmark_user = document.getElementById(`bookmark-user-${bookmark.article_id}`)
            bookmark_user.innerText = bookmark.article_user

        }
        return;
    } else {
        alert(response.status);
    }
}
async function GetEmoticonBuy(formData) {
    const response = await fetch(`${back_base_url} /users/profile / emoticon / buy`, {
        headers: {
            Authorization: `Bearer ${access} `,
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