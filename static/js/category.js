
//카테고리 가져요기
access = localStorage.getItem("access")
async function categoryGet(id) {
    const formData = new FormData();
    formData.append("id", 5)
    const response = await fetch(`${back_base_url}/reports/category/?id=${id}`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
    });

    if (response.status == 200) {
        response_json = await response.json();
        create_category = createCategory(response_json)
        category.appendChild(create_category)
        return response_json;
    } else {
        alert(response.status);
    }
}

category_class = document.getElementsByClassName("category")
for (var i = 0; i < category_class.length; i++) {
    category = category_class[i]
    categoryGet(category.id)
}
function createCategory(cateory_list) {

    var details = document.createElement('details')
    var summary = document.createElement('summary')
    summary.innerText = cateory_list[1]

    for (let i = 0; i < cateory_list[2].length; i++) {
        if (cateory_list[2][i].length == 2) {
            li = document.createElement('li')
            li.innerText = cateory_list[2][i][1]
            details.appendChild(li)

        }
        else {
            var child_category = createCategory(cateory_list[2][i])
            details.appendChild(child_category)
            // console.log(detail)
        }
    }
    details.appendChild(summary)

    return details
}



window.onload = function () { }