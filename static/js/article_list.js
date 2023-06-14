console.log("js연결")
token = localStorage.getItem("access")
window.onload = async () => {
    const response = await fetch(`${back_base_url}/articles/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET",
    });
    let data = await response.json()
    let card_box = document.querySelector('#card_box')
    let articleHtml = ``
    console.log(data.results.length)
    console.log(response)


    if (response.status == 200) {
        for (let i = 0; i < await data.results.length; i++) {
            let article = data.results[i]
            console.log(article)
            let tag_add = ''
            for (let a = 0; a < await data.results[i].tags.length; a++) {
                console.log(data.results[i].tags[a].tag)
                tag_add += '#' + data.results[i].tags[a].tag + ' '
            }

            articleHtml += `
            <div class="col article_detail me-5">
                <div class="card h-50">
                    <img text-align:center;" src="${back_base_url}${article.main_image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.content}</p>
                    </div><!-- e:body -->
                    <div class="card-footer d-flex justify-content-between">
                        <span class="text-muted">${article.user}</span>
                        <span class="text-muted">${tag_add}</span>
                    </div><!-- e:footer -->
                </div>
            </div>
            `
        }
        card_box.innerHTML = articleHtml
    }
}
