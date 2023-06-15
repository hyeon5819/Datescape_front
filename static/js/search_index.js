function selectOption(x) {
    if (x == 1) {
        document.getElementById('option').innerHTML = "article"
    } else {
        document.getElementById('option').innerHTML = "tag"
    }
}

async function submitSearch() {
    const option = document.getElementById('option').innerHTML
    const search = document.getElementById('search').value
    window.location.href = `${front_base_url}/templates/search_list.html?option=${option}&search=${search}`
}

async function loadMain() {
    response_1 = await getSearch('article', 'hi')
    const articles1 = document.getElementById('articles-1')
    articles1.innerHTML = ''
    response_1.results.forEach(article => {
        articles1.innerHTML += `
        <div class="col " >
        <div class="card text-bg-dark border-light" style="height:17rem; justify-content: center;" onclick="location.href='${front_base_url}/index.html';">
        <img src="https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg" class="card-img cardimg mh-100" alt="..." >
        <div class="card-img-overlay img-cover p-4 ">
        <h4 class="card-title">${article.title}</h4>
        <p class="card-text content">${article.content}</p>
        <p class="card-text text-end"><small>${article.user} | ${article.created_at}</small></p>
        </div>
        </div>
        </div>
        `
    });
    response_2 = await getSearch('article', '제목')
    const articles2 = document.getElementById('articles-2')
    articles2.innerHTML = ''
    response_2.results.forEach(article => {
        articles2.innerHTML += `
        <div class="col " >
        <div class="card text-bg-dark border-light" style="height:17rem; justify-content: center;" onclick="location.href='${front_base_url}/index.html';">
        <img src="https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg" class="card-img cardimg mh-100" alt="..." >
        <div class="card-img-overlay img-cover p-4 ">
        <h4 class="card-title">${article.title}</h4>
        <p class="card-text content">${article.content}</p>
        <p class="card-text text-end"><small>${article.user} | ${article.created_at}</small></p>
        </div>
        </div>
        </div>
        `
    });
}
loadMain()
                    // <div class="card text-bg-dark " style="height: 19rem">
                    //     <img src="..." class="card-img" alt="...">
                    //     <div class="card-img-overlay">
                    //         <h5 class="card-title">Card title</h5>
                    //         <p class="card-text">This is a wider card with supporting text below as a natural lead-in to
                    //         </p>
                    //         <p class="card-text text-end"><small>Last updated 3 mins
                    //                 ago</small></p>
                    //     </div>
                    // </div>
