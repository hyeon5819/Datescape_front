async function getSearch(option, search, page) {
    const response = await fetch(`${back_base_url}/articles/article-search/?option=${option}&search=${search}&page=${page}`)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패하였습니다.")
    }
}

function selectOption(x) {
    if (x == 1) {
        document.getElementById('option').innerHTML = "article"
    } else if (x == 2) {
        document.getElementById('option').innerHTML = "tag"
    } else {
        document.getElementById('option').innerHTML = "location"
    }
}

async function submitSearch() {
    const option = document.getElementById('option').innerHTML
    const search = document.getElementById('search').value
    window.location.href = `${front_base_url}/templates/search_list.html?option=${option}&search=${search}&page=1`
}
