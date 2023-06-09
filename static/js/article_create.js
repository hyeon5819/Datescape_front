async function articleCreate() {

    const formData = new FormData();
    formData.append('title', "제목1")
    formData.append('content', "내용1")
    formData.append('images', "img.png")
    formData.append('score', "9.9")



    const response = await fetch(`${back_base_url}/articles/`, {
        // headers: {
        //     Authorization: `Bearer ${access}`,
        // },
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    console.log(response.status)
}