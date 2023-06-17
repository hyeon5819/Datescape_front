
//카테고리 가져요기
access = localStorage.getItem("access")
async function categoryDetailGet(category) {
    var id_name = category.id
    const response = await fetch(`${back_base_url}/reports/category/?id=${id_name}&/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
    });

    if (response.status == 200) {
        response_json = await response.json();
        create_category = createDetailCategory(response_json, 0)
        category.appendChild(create_category)
        return response_json;
    } else {
        alert(response.status);
    }
}

var category_class = document.getElementsByClassName("category-detail")
for (var i = 0; i < category_class.length; i++) {
    var category = category_class[i]
    categoryDetailGet(category)
}
function createDetailCategory(cateory_list, times) {
    var details = document.createElement('details')
    var summary = document.createElement('summary')
    summary.innerText = cateory_list[1]

    for (let i = 0; i < cateory_list[2].length; i++) {
        if (cateory_list[2][i].length == 2) {
            li = document.createElement('li')
            li.innerText = `test     `.repeat(times) + cateory_list[2][i][1]
            details.appendChild(li)

        }
        else {
            var child_category = createDetailCategory(cateory_list[2][i], times + 1)
            details.appendChild(child_category)
            // console.log(detail)
        }
    }
    details.appendChild(summary)

    return details
}

