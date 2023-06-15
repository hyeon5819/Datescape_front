async function loadSearch() {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search');
    const option = urlParams.get('option');
    const response = await getSearch(option, search)
    const searched = document.getElementById('search')
    searched.value = search
    document.getElementById('option').innerHTML = option
    const search_list = document.getElementById('search-list')
    search_list.innerHTML = ''
    response.results.forEach(article => {
        var jibun = article.jibun_address
        var place = jibun.split(' ')
        search_list.innerHTML += `
        <div class="col" >
        <div class="card text-bg-dark border-light rounded-4" style="height:300px; justify-content: center;" onclick="location.href='${front_base_url}/templates/article_detail.html?id=${article.id}/';">
        <img src="${article.main_image}" class="card-img cardimg mh-100 rounded-4" alt="..." >
        <div class="card-img-overlay img-cover rounded-4" style="padding: 30px;">
        <h4 class="card-title cardtitle mt-3">${article.title}</h4>
        <p class="card-text content mb-5">${article.content}</p>
        <ul class="d-flex list-unstyled mt-auto pt-5 mb-0 align-items-end">
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
    
        </div>
        </div>
        </div>
        `
    });
}
loadSearch()


