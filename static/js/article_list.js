console.log("js연결")
token = localStorage.getItem("access")
function detail_page(article_id) {
    location.href = `${front_base_url}/templates/article_detail.html?id=${article_id}/`
}
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
    // console.log(data.results.length)
    // console.log(response)


    if (response.status == 200) {
        console.log(data)

        for (let i = 0; i < await data.results.length; i++) {
            let article = data.results[i]
            let tag_add = ''
            for (let a = 0; a < await data.results[i].tags.length; a++) {
                console.log(data.results[i].tags[a].tag)
                tag_add += '#' + data.results[i].tags[a].tag + ' '
            }

            articleHtml += `
            <div class="col article_detail me-5" onclick="detail_page(${article.id})">
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

    function createPagination(totalPages, currentPage) {
        console.log(data)
        const wrapper = document.querySelector('.pagination-wrapper');
        const pagination = document.createElement('ul');
        pagination.className = 'pagination';
        wrapper.appendChild(pagination);

        const prev = document.createElement('li');
        prev.className = 'previous';
        pagination.appendChild(prev);

        const prevLink = document.createElement('a');
        prevLink.href = 'http://127.0.0.1:5500/templates/article_list.html';
        prevLink.innerHTML = '&laquo;';
        prev.appendChild(prevLink);

        const next = document.createElement('li');
        next.className = 'next';
        pagination.appendChild(next);

        const nextLink = document.createElement('a');
        nextLink.href = '#';
        nextLink.innerHTML = '&raquo;';
        next.appendChild(nextLink);

        for (let i = 1; i <= totalPages; i++) {
            const page = document.createElement('li');
            if (currentPage === i) {
                page.className = 'active';
            }
            pagination.insertBefore(page, next);

            const link = document.createElement('a');
            link.href = `http://127.0.0.1:5500/templates/article_list.html`;
            link.innerHTML = i;
            page.insertBefore(link, null);
        }
    }

    const totalPages = 5;
    const currentPage = 1;

    createPagination(totalPages, currentPage);
}
