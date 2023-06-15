async function getSearch(option, search) {
    const response = await fetch(`${back_base_url}/articles/article-search/?option=${option}&search=${search}`)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패하였습니다.")
    }
}