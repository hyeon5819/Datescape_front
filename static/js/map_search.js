window.onload = function () {
    document.getElementById("address_kakao").addEventListener("click", function () { //주소입력칸을 클릭하면
        //카카오 지도 발생
        new daum.Postcode({
            oncomplete: function (data) { //선택시 입력값 세팅
                document.getElementById("address_kakao_input").value = data.address // 주소 넣기
                document.getElementById("jibunAddress").value = data.jibunAddress // 지번 주소 넣기
                document.getElementById("roadAddress").value = data.roadAddress // 도로명 주소 넣기

            }
        }).open()
    })
    document.getElementById("save_db").addEventListener("click", function () { //주소입력칸을 클릭하면
        //카카오 지도 발생
        // 데이터 전송을 위한 변수 선언
        const formData = new FormData();
        data = document.getElementById("jibunAddress").value
        formData.append('query', data)

        fetch(`${back_base_url}/articles/search/`, {
            // headers: {
            //     Authorization: `Bearer ${access}`,
            // },
            method: "POST",
            body: formData,
        })
            .then(response => {
                console.log(response, "response")
                console.log(data, "data")
                if (!response.ok) {
                    throw new Error('저장실패');
                }
                return document.getElementById("jibunAddress").value;
            })
            .then(data => {
                console.log('data', data);
                console.log('저장완료', data);
            })
            .catch(error => {
                console.error(error);
            });

    })

}

