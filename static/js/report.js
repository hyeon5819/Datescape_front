async function userReport() {

    const formData = new FormData();
    formData.append('report_type', "user/article/comment")
    formData.append('report_id', 1)
    const response = await fetch(`${back_base_url}/reports/`, {
        // headers: {
        //     Authorization: `Bearer ${access}`,
        // },
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    console.log(response.status)
}