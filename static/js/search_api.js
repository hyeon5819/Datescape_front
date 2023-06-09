
async function getSearch(option, search) {
    const response = await fetch(`${back_base_url}/articles/article-search?option=${option}&search=${search}`)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패하였습니다.")
    }
}

async function submitSearch() {
    const urlParams = new URLSearchParams(location.search);
    option = urlParams.get('option');
    const search = document.getElementById('search').value
    window.location.href = `${front_base_url}/templates/search_list.html?option=${option}&search=${search}`
}

async function loadSearch() {
    const urlParams = new URLSearchParams(location.search);
    search = urlParams.get('search');
    option = urlParams.get('option');
    const response = await getSearch(option, search)
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
        <p class="card-text"><small>${article.user} | ${article.created_at}</small></p>
        </div>
        </div>
        </div>
        `
    });
    console.log(response.results)
}
loadSearch()


