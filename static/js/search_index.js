function detail_page(article_id) {
  location.href = `${front_base_url}/templates/article_detail.html?id=${article_id}&/`
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

  response_1 = await getRandom('article')
  const articles1 = document.getElementById('articles-1')
  articles1.innerHTML = ''
  response_1.results.forEach(article => {
    var jibun = article.jibun_address
    var place = jibun.split(' ')
    articles1.innerHTML += `
        <div class="col " >
        <div class="card text-bg-dark border-light rounded-4" style="height:17rem; justify-content: center;" onclick="location.href='${front_base_url}/templates/article_detail.html?id=${article.id}&/';">
        <img class="cardimg rounded-4" src="${article.main_image}" alt="..." >
        <div class="d-flex flex-column card-img-overlay img-cover p-4 text-shadow-1 rounded-4">
        <h4 class="card-title cardtitle fw-bold">${article.title}</h4>
        <p class="card-text content mb-5">${article.content}</p>
        <ul class="d-flex list-unstyled mt-auto pt-5 mb-0">
              <li class="me-auto">
                <small>${article.user}</small>
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
  });
  response_2 = await getRandom('tag')
  const articles2 = document.getElementById('articles-2')
  articles2.innerHTML = ''
  response_2.results.forEach(article => {
    var jibun = article.jibun_address
    var place = jibun.split(' ')
    articles2.innerHTML += `
    <div class="col " >
    <div class="card text-bg-dark border-light rounded-4" style="height:17rem; justify-content: center;" onclick="location.href='${front_base_url}/templates/article_detail.html?id=${article.id}&/';">
    <img class="card-img cardimg rounded-4 mh-100" src="${article.main_image}" alt="..." >
    <div class="d-flex flex-column card-img-overlay img-cover p-4 text-shadow-1 rounded-4">
    <h4 class="card-title cardtitle fw-bold">${article.title}</h4>
    <p class="card-text content mb-5">${article.content}</p>
    <ul class="d-flex list-unstyled mt-auto pt-5 mb-0">
          <li class="me-auto">
            <small>${article.user}</small>
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
  });

  response_3 = await getRandom('update')
  const articles3 = document.getElementById('articles-3')
  articles3.innerHTML = ''
  response_3.results.forEach(article => {
    var jibun = article.jibun_address
    var place = jibun.split(' ')
    articles3.innerHTML += `
    <div class="col " >
    <div class="card text-bg-dark border-light rounded-4" style="height:17rem; justify-content: center;" onclick="location.href='${front_base_url}/templates/article_detail.html?id=${article.id}&/';">
    <img class="card-img cardimg rounded-4 mh-100" src="${article.main_image}" alt="..." >
    <div class="d-flex flex-column card-img-overlay img-cover p-4 text-shadow-1 rounded-4">
    <h4 class="card-title cardtitle fw-bold">${article.title}</h4>
    <p class="card-text content mb-5">${article.content}</p>
    <ul class="d-flex list-unstyled mt-auto pt-5 mb-0">
          <li class="me-auto">
            <small>${article.user}</small>
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
  });
}
loadMain()
