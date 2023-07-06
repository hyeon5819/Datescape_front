let search
let option

async function loadSearch() {
  const urlParams = new URLSearchParams(location.search);
  search = urlParams.get('search');
  option = urlParams.get('option');
  let options = {
    "article": "제목+내용",
    "all": "전체",
    "tag": "태그",
    "location": "지역",
    "user": "작성자"
  }
  const page = urlParams.get('page');
  const response = await getSearch(option, search, page)
  const searched = document.getElementById('search')
  searched.value = search
  document.getElementById('option').innerHTML = options[option]
  const search_list = document.getElementById('search-list')
  search_list.innerHTML = ''
  if (response.count === 0) {
    search_list.innerHTML += `<h4>'${search}'에 대한 검색 결과가 없습니다.</h4>`
  } else {
    response.results.forEach(article => {
      var jibun = article.jibun_address
      var place = jibun.split(' ')
      searchHTML = `
        <div class="col" >
        <div class="card text-bg-dark border-light rounded-4" style="height:300px; justify-content: center;" onclick="location.href='${front_base_url}/templates/article_detail.html?id=${article.id}&/';">
        <img src="${article.main_image}" class="card-img cardimg mh-100 rounded-4" alt="..." >
        <div class="card-img-overlay img-cover rounded-4" style="padding: 30px;">
        <h4 class="card-title cardtitle mt-3" id=search-title-${article.id}></h4>
        <p class="card-text content mb-5" id=search-${article.id}></p>
        <ul class="d-flex list-unstyled mt-auto pt-5 mb-0 align-items-end">
              <li class="me-auto">
                <small id=search-user-${article.id}></small>
              </li>
              <li class="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" fill="currentColor" class="bi bi-geo-alt-fill me-1" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
</svg>
                <small>${place[0]}</small >
              </li >
            </ul >
    
        </div>
        </div>
        </div>
        `

      search_list.innerHTML += searchHTML
      const search_content = document.getElementById(`search-${article.id}`)
      search_content.innerText = article.content
      const search_title = document.getElementById(`search-title-${article.id}`)
      search_title.innerText = article.title
      const search_user = document.getElementById(`search-user-${article.id}`)
      search_user.innerText = article.user
    });
    createPagination(Math.ceil(response.count / 9), page) // 페이지 수 수정
  }
}
loadSearch()

// 페이징

async function getPageData(event) {
  event.preventDefault()
  const page = event.target.getAttribute('data-page')
  window.location.href = `${front_base_url}/templates/search_list.html?option=${option}&search=${search}&page=${page}&/`
}

function createPagination(totalPages, currentPage) {
  const wrapper = document.querySelector('.pagination-wrapper')
  wrapper.innerHTML = ''

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
      prevLink.setAttribute('data-page', 1)
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
      nextLink.setAttribute('data-page', totalPages)
      nextLink.innerHTML = '&raquo'
      nextLink.addEventListener('click', getPageData)
      next.appendChild(nextLink)
    }
  }
}


