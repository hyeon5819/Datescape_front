async function commentReport(comment_id) {
    const access = localStorage.getItem("access")

    if (confirm("신고 하시겠습니까?")) {
        const formData = new FormData();
        formData.append('request_type', "comment")
        formData.append('report_id', comment_id)
        const response = await fetch(`${back_base_url}/reports/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.status == 200) {
            alert('신고 완료!')
        } else {
            alert(data.message)
        }
    } else {
        // 취소 버튼을 눌렀을 경우
        return false;
    }
}
