
//카테고리 가져요기
var response_ids = {}
access = localStorage.getItem("access")
async function categorySelectGet(category) {
    var id_name = category.id
    const response = await fetch(`${back_base_url}/reports/category/?id=${id_name}&/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
    });

    if (response.status == 200) {
        response_ids[id_name] = await response.json();
        create_category = createSelectCategory(response_ids[id_name])
        category.appendChild(create_category)

        return;
    } else {
        alert(response.status);
    }
}

var category_class = document.getElementsByClassName("category-select")
for (var i = 0; i < category_class.length; i++) {
    var category = category_class[i]
    categorySelectGet(category)
}

function createSelectCategory(category_list) {
    var select = document.createElement('select')
    select.id = category_list[0]
    select.size = '7'
    var optgroup = document.createElement('optgroup')
    optgroup.label = category_list[1]
    select.appendChild(optgroup)

    category_list[2].forEach(function (element) {
        var option = document.createElement('option')
        option.innerText = element[1]

        option.addEventListener("click", function () {
            while (true) {
                if (option.parentElement.parentElement.nextSibling == null) {
                    break;
                }
                option.parentElement.parentElement.nextSibling.remove()
            }
            if (element.length == 3) {
                var child_category = createSelectCategory(element)
                option.parentElement.parentElement.parentElement.appendChild(child_category)
            }
        })

        optgroup.appendChild(option)
    });
    return select

}