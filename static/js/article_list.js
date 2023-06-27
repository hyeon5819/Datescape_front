token = localStorage.getItem("access")
/*상세보기 url */
function detail_page(article_id) {
    location.href = `${front_base_url}/templates/article_detail.html?id=${article_id}&/`
}

list_range_html = document.getElementById('list-range-html')
window.onload = async () => {
    let get_list = document.getElementById('get-list')
    get_list.onclick = function (e) {
        const min_score = inputLeft.value;
        const max_score = inputRight.value;
        fetchArticles(1, min_score, max_score);
    }


    async function fetchArticles(pageNumber, min_score = null, max_score = null) {
        let url = `${back_base_url}/articles/?page=${pageNumber}`;

        if (min_score !== null) {
            url += `&score=${min_score},${max_score}`;
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


var inputLeft = document.getElementById('input-left')
var inputRight = document.getElementById('input-right')

var thumbLeft = document.querySelector('.slider>.thumb.left')
var thumbRight = document.querySelector('.slider>.thumb.right')
var range = document.querySelector('.slider>.range')

function setLeftValue() {
    var _this = inputLeft,
        min = parseInt(_this.min),
        max = parseInt(_this.max);

    _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value));
    console.log(_this.value)
    var percent = ((_this.value - min) / (max - min)) * 100;
    thumbLeft.style.left = percent + "%";
    range.style.left = percent + "%";
    list_range_html.innerHTML = inputLeft.value + "-" + inputRight.value
}
setLeftValue();

function setRightValue() {
    var _this = inputRight,
        min = parseInt(_this.min),
        max = parseInt(_this.max);
    console.log(_this.value)
    _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value));

    var percent = ((_this.value - min) / (max - min)) * 100;

    thumbRight.style.right = (100 - percent) + "%";
    range.style.right = (100 - percent) + "%";
    list_range_html.innerHTML = inputLeft.value + "-" + inputRight.value
}
setRightValue();


inputLeft.addEventListener("input", setLeftValue)
inputRight.addEventListener("input", setRightValue)

inputLeft.addEventListener("mouseover", function () {
    thumbLeft.classList.add("hover")
})
inputLeft.addEventListener("mouseout", function () {
    thumbLeft.classList.remove("hover")
})
inputLeft.addEventListener("mousedown", function () {
    thumbLeft.classList.add("active")
})
inputLeft.addEventListener("mouseup", function () {
    thumbLeft.classList.remove("active")
})


inputRight.addEventListener("mouseover", function () {
    thumbRight.classList.add("hover")
})
inputRight.addEventListener("mouseout", function () {
    thumbRight.classList.remove("hover")
})
inputRight.addEventListener("mousedown", function () {
    thumbRight.classList.add("active")
})
inputRight.addEventListener("mouseup", function () {
    thumbRight.classList.remove("active")
})
