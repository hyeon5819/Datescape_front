function detail_page(article_id) {
  if (localStorage.getItem("payload")) {
    location.href = `${front_base_url}/templates/article_detail.html?id=${article_id}&/`
  } else {
    alert('로그인이 필요합니다!')
    location.href = `${front_base_url}/templates/logintemp.html`
  }
}

function create_page() {
  if (localStorage.getItem("payload")) {
    location.href = `${front_base_url}/templates/article_create.html`
  } else {
    alert('로그인이 필요합니다!')
    location.href = `${front_base_url}/templates/logintemp.html`
  }
}

async function getWeeklyTags() {
  const response = await fetch(`${back_base_url}/articles/weekly-tags/`)

  if (response.status == 200) {
    const response_json = await response.json()
    return response_json
  } else {
    alert("불러오는데 실패하였습니다.")
  }
}
async function loadMain() {
  const weeklytags = await getWeeklyTags()
  tag_name = document.getElementById("today-tag")
  tag_name.innerHTML = "오늘의 태그 #" + weeklytags[0]['tag']

  tag_name = document.getElementById("tomorrow-tag")
  tag_name.innerHTML = "내일의 태그 #" + weeklytags[1]['tag']

  response_1 = await getRandom('article')
  const articles1 = document.getElementById('articles-1')
  articles1.innerHTML = ''
  response_1.results.forEach(article => {
    var jibun = article.jibun_address
    var place = jibun.split(' ')
    articles1HTML = `
        <div class="col " >
        <div class="card text-bg-dark border-light rounded-4" style="height:17rem; justify-content: center;" onclick="detail_page(${article.id})">
        <img class="cardimg rounded-4" src="${article.main_image}" alt="..." >
        <div class="d-flex flex-column card-img-overlay img-cover p-4 text-shadow-1 rounded-4">
        <h4 class="card-title cardtitle fw-bold" id="article1-title-${article.id}"></h4>
        <p class="card-text content mb-5" id="content1-${article.id}"></p>
        <ul class="d-flex list-unstyled mt-auto pt-5 mb-0">
              <li class="me-auto">
                <small id="article1-user-${article.id}"></small>
              </li>
              <li class="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" fill="currentColor" class="bi bi-geo-alt-fill me-1" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
</svg>
                <small>${place[0]}</small >
              </li >
            </ul >
        </div >
        </div >
        </div >
        `
    articles1.innerHTML += articles1HTML
    const article1_content = document.getElementById(`content1-${article.id}`)
    article1_content.innerText = article.content
    const article1_title = document.getElementById(`article1-title-${article.id}`)
    article1_title.innerText = article.title
    const article1_user = document.getElementById(`article1-user-${article.id}`)
    article1_user.innerText = article.user
  });
  response_2 = await getRandom('tag')
  const articles2 = document.getElementById('articles-2')
  articles2.innerHTML = ''
  response_2.results.forEach(article => {
    var jibun = article.jibun_address
    var place = jibun.split(' ')
    articles2HTML = `
    <div class="col " >
    <div class="card text-bg-dark border-light rounded-4" style="height:17rem; justify-content: center;" onclick="detail_page(${article.id})">
    <img class="card-img cardimg rounded-4 mh-100" src="${article.main_image}" alt="..." >
    <div class="d-flex flex-column card-img-overlay img-cover p-4 text-shadow-1 rounded-4">
    <h4 class="card-title cardtitle fw-bold" id="article2-title-${article.id}"></h4>
    <p class="card-text content mb-5" id="content2-${article.id}"></p>
    <ul class="d-flex list-unstyled mt-auto pt-5 mb-0">
          <li class="me-auto">
            <small id="article2-user-${article.id}"></small>
          </li>
          <li class="d-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" fill="currentColor" class="bi bi-geo-alt-fill me-1" viewBox="0 0 16 16">
<path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
</svg>
            <small>${place[0]}</small >
          </li >
        </ul >
    </div >
    </div >
    </div >
        `
    articles2.innerHTML += articles2HTML
    const article2_content = document.getElementById(`content2-${article.id}`)
    article2_content.innerText = article.content
    const article2_title = document.getElementById(`article2-title-${article.id}`)
    article2_title.innerText = article.title
    const article2_user = document.getElementById(`article2-user-${article.id}`)
    article2_user.innerText = article.user

  });

  response_3 = await getRandom('update')
  const articles3 = document.getElementById('articles-3')
  articles3.innerHTML = ''
  response_3.results.forEach(article => {
    var jibun = article.jibun_address
    var place = jibun.split(' ')
    articles3HTML = `
    <div class="col " >
    <div class="card text-bg-dark border-light rounded-4" style="height:17rem; justify-content: center;" onclick="detail_page(${article.id})">
    <img class="card-img cardimg rounded-4 mh-100" src="${article.main_image}" alt="..." >
    <div class="d-flex flex-column card-img-overlay img-cover p-4 text-shadow-1 rounded-4">
    <h4 class="card-title cardtitle fw-bold" id="article3-title-${article.id}"></h4>
    <p class="card-text content mb-5" id="content3-${article.id}"></p>
    <ul class="d-flex list-unstyled mt-auto pt-5 mb-0">
          <li class="me-auto">
            <small id="article3-user-${article.id}"></small>
          </li>
          <li class="d-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" fill="currentColor" class="bi bi-geo-alt-fill me-1" viewBox="0 0 16 16">
<path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
</svg>
            <small>${place[0]}</small >
          </li >
        </ul >
    </div >
    </div >
    </div >
        `
    articles3.innerHTML += articles3HTML
    const article3_content = document.getElementById(`content3-${article.id}`)
    article3_content.innerText = article.content
    const article3_title = document.getElementById(`article3-title-${article.id}`)
    article3_title.innerText = article.title
    const article3_user = document.getElementById(`article3-user-${article.id}`)
    article3_user.innerText = article.user
  });
}
loadMain()
