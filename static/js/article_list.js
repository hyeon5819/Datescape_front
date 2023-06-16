console.log("js연결")
token = localStorage.getItem("access")
function detail_page(article_id) {
    location.href = `${front_base_url}/templates/article_detail.html?id=${article_id}`
}
window.onload = async () => {
    let card_box = document.querySelector('#card_box')

    async function fetchArticles(pageNumber) {
        articleHtml = '' // 변수 초기화
        const response = await fetch(`${back_base_url}/articles/?page=${pageNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'GET',
        })
        const data = await response.json()
        console.log(data)

        if (response.status === 200) {
            for (let i = 0; i < data.results.length; i++) {
                const article = data.results[i]
                let tag_add = ''
                for (let a = 0; a < article.tags.length; a++) {
                    tag_add += '#' + article.tags[a].tag + ' '
                }

                articleHtml += `
                <div class="col article_detail me-5" onclick="detail_page(${article.id})">
                    <div class="card h-50">
                        <img text-align:center;" src="${image_url}${article.main_image}" class="card-img-top" alt="...">
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

            // 페이징 업데이트
            createPagination(Math.ceil(data.count / 5), pageNumber) // 페이지 수 수정
        } else {
            console.error(data.detail)
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

        if (totalPages > 1) {
            const pagination = document.createElement('ul')
            pagination.className = 'pagination'
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
                if (i === currentPage) {
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
