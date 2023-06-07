// if (!localStorage.getItem("access")) {
//     alert("로그인이 필요합니다.")
//     window.location.href = `${front_base_url}/templates/login.html`
// }

window.onload = async function () {
    // const access = localStorage.getItem("access");

    const response = await fetch(`${back_base_url}/emoticons/temp/`, {
        // headers: {
        //     Authorization: `Bearer ${access}`,
        // },
        method: "GET",
    });

    if (response.status == 200) {
        response_json = await response.json();

        let emoticons = document.querySelector('#emoticons')
        let emoticonHtml = ``

        for (let i = 1; i < await response_json.length; i++) {
            let emoticon = response_json[i]
            let mainImage = emoticon.images[0].image
            emoticonHtml += `
            <div class="col">
                <div class="card">
                    <img src="${back_base_url}${mainImage}" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${emoticon.title}</h5>
                        <button onclick="location.href='${front_base_url}/templates/emoticon_detail.html?emoticon_id=${emoticon.id}'">보러가기</button>
                    </div>
                </div>
            </div>
            `
        }
        emoticons.innerHTML = emoticonHtml
    } else {
        alert(response.status);
    }
}
