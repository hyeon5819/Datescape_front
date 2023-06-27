token = localStorage.getItem("access")
function detail_page(article_id) {
    location.href = `${front_base_url}/templates/article_detail.html?id=${article_id}&/`
}

window.onload = async () => {
    let card_box = document.querySelector('#card_box')

    function handleScoreFilter(event) {
        event.preventDefault();

        const score = event.target.dataset.score;
        fetchArticles(1, score);
    }

    document.querySelectorAll('.dropdown-item').forEach((item) => {
        item.addEventListener('click', handleScoreFilter);
    });

    async function fetchArticles(pageNumber, score = null) {
        let url = `${back_base_url}/articles/?page=${pageNumber}`;

        if (score !== null) {
            url += `&score=${score}`;
        }

        articleHtml = '' // 변수 초기화
        const response = await fetch(url, {
            method: 'GET',
        })
        const data = await response.json()

        if (response.status === 200) {
            for (let i = 0; i < data.results.length; i++) {
                const article = data.results[i]
                let tag_add = ''
                for (let a = 0; a < article.tags.length; a++) {
                    tag_add += '#' + article.tags[a].tag + ' '
                }

                articleHtml += `
            <div class="col article_detail" onclick="detail_page(${article.id})">
                <div class="card h-100">
                <div style="width: 282px; height: 234px;" >
                    <img text-align:center;" src="${image_url}${article.main_image}" class="card-img-top cardimg" alt="...">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title cardtitle">${article.title}</h5>
                        <p class="card-text content" style="color:gray;">${article.content}</p>
                        <span class="text-muted"><small class="content">${tag_add}</small></span>
                        </div><!-- e:body -->
                    <div class="card-footer d-flex justify-content-between">
                        <span class="text-muted">${article.user}</span>
                        <span  style="color:#FFBF00;">⭐️ ${article.score}</span>
                    </div><!-- e:footer -->
                </div>
            </div>
            `
            }
            card_box.innerHTML = articleHtml



            // 페이징 업데이트
            createPagination(Math.ceil(data.count / 9), pageNumber) // 페이지 수 수정
        } else {
        }
    }

    async function getPageData(event) {
        event.preventDefault()
        const page = event.target.getAttribute('data-page')
        await removeArticles()
        fetchArticles(page)
    }
    async function removeArticles() {
        const articleList = document.querySelector('#card_box')
        while (articleList.firstChild) {
            articleList.removeChild(articleList.firstChild)
        }
    }
    function createPagination(totalPages, currentPage) {
        const wrapper = document.querySelector('.pagination-wrapper')
        wrapper.innerHTML = ''
        currentPage = Number(currentPage)
        totalPages = Number(totalPages)
        if (totalPages > 1) {
            const pagination = document.createElement('ul')
            pagination.setAttribute('class', 'pagination justify-content-center')
            wrapper.appendChild(pagination)

            if (currentPage > 1) {
                const prev = document.createElement('li')
                prev.className = 'previous'
                pagination.appendChild(prev)

                const prevLink = document.createElement('a')
                prevLink.href = '#'
                prevLink.setAttribute('data-page', currentPage - 1)
                prevLink.innerHTML = '&laquo'
                prevLink.addEventListener('click', getPageData)
                prev.appendChild(prevLink)
            }

            for (let i = 1; i <= totalPages; i++) {
                const page = document.createElement('li')
                if (i == currentPage) {
                    page.classList.add('active')
                }
                pagination.appendChild(page)

                const link = document.createElement('a')
                link.href = '#'
                link.setAttribute('data-page', i)
                link.innerHTML = i
                link.addEventListener('click', getPageData)
                page.appendChild(link)
            }

            if (currentPage < totalPages) {
                const next = document.createElement('li')
                next.className = 'next'
                pagination.appendChild(next)

                const nextLink = document.createElement('a')
                nextLink.href = '#'
                nextLink.setAttribute('data-page', currentPage + 1)
                nextLink.innerHTML = '&raquo'
                nextLink.addEventListener('click', getPageData)
                next.appendChild(nextLink)
            }
        }
    }

    fetchArticles(1)
}