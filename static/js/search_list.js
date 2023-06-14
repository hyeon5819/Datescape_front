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
        search_list.innerHTML += `
        <div class="col" >
        <div class="card text-bg-dark border-light" style="height:300px; justify-content: center;" onclick="location.href='${front_base_url}/index.html';">
        <img src="${article.images}" class="card-img cardimg mh-100" alt="..." >
        <div class="card-img-overlay img-cover p-4">
        <h5 class="card-title">${article.title}</h5>
        <p class="card-text content">${article.content}</p>
        <p class="card-text text-end"><small>${article.user} | ${article.created_at}</small></p>
        </div>
        </div>
        </div>
        `
    });
}
loadSearch()


