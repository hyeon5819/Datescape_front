/*admin확인 */
access = localStorage.getItem("access")
if (!access) {
    alert("로그인이 필요합니다.")
    window.location.href = `${front_base_url}/templates/logintemp.html`
} else {
    // const payload = localStorage.getItem("payload");
    // const payloadParse = JSON.parse(payload)
    // console.log(payloadParse)
    // if (payloadParse.is_admin == false) {
    //     window.location.href = `${front_base_url}/`
    // }
    alert("관리자만 접근 가능할것입니다.") // 임시 오픈, 추후 위에걸로 바꾸기
}

/*list받기 */
async function categoryGet(ids) {
    serch_list = ids
    const response = await fetch(`${back_base_url}/reports/childcategory/?request_type=${serch_list}&/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access}`,
        },
    });

    if (response.status == 200) {
        response_data = await response.json()
        var datas = response_data["datas"]
        var names = response_data["name"]
        createList(datas, names)
        return;
    } else {
        alert(response.status);
    }
}
async function categorySave(datas) {
    const response = await fetch(`${back_base_url}/reports/category/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "request_datas": datas
        })

    });

    if (response.status == 200) {
        return;
    } else {
        alert(response.status);
    }
}

/*list 로 box만들기*/
function createList(lists, names) {
    if (!lists.length) {
        parant_card = createParentBox("0")
    }
    for (list in lists) {
        parant_card = document.getElementsByClassName("parent_id" + lists[list][1])
        if (parant_card.length == 0) {
            createParentBox(lists[list][1])
        }
        createChildBox(lists[list][1], lists[list][2], lists[list][0], lists[list][3])

    }

    for (id_name in names) {
        try {
            parent_name = document.getElementsByClassName("parent_id" + names[id_name][0])[0]
            parent_name.innerHTML = ' ' + names[id_name][1] + ' '
        } catch (error) { }

        try {
            child_names = document.getElementsByClassName("child_id" + names[id_name][0])
            for (i = 0; i < child_names.length; i++) {
                child_name = child_names[i]
                child_name.innerHTML = ' ' + names[id_name][1] + ' '
            }
        } catch (error) { }

    }

}
/*create list-box */
function createParentBox(id) {
    var col_category_detail = document.createElement("div")
    col_category_detail.className = "col category_detail"
    var card_h100 = document.createElement("div")
    card_h100.className = "card h-100"
    var card_body = document.createElement("div")
    card_body.className = "card-body"


    card_box.appendChild(col_category_detail)
    col_category_detail.appendChild(card_h100)
    card_h100.appendChild(card_body)
    var parent_is_html = document.createElement('il')
    parent_is_html.innerHTML = id
    var create_check = document.createElement("button")
    create_check.onclick = function (event) {
        child_list = event.target.parentNode.lastChild
        var child_name_check = document.createElement("input")
        child_name_check.type = "checkbox"
        child_name_check.onclick = change_input
        var child_name = document.createElement("il")
        child_name.innerHTML = " "
        child_name.className = "child_id"
        var child_parent = document.createElement("input")
        child_parent.type = "number"
        child_parent.value = 0
        child_parent.className = "child-parent"
        child_parent.style = "width:60px;height:20px;"
        var child_clear = document.createElement("input")
        child_clear.type = "checkbox"
        child_clear.className = "del-check"
        child_clear.onclick = child_delet
        var br = document.createElement("br")


        child_list.appendChild(br)
        child_list.appendChild(child_name_check)
        child_list.appendChild(child_name)
        child_list.appendChild(child_parent)
        child_list.appendChild(child_clear)
    }
    create_check.innerHTML = "생성하기"

    var next_line = document.createElement("div")
    var card_name_check = document.createElement("input")
    card_name_check.type = "checkbox"
    card_name_check.className = id
    card_name_check.onclick = change_input
    var card_name = document.createElement("il")
    card_name.innerHTML = " " + id + " "
    card_name.className = "parent_id" + id
    var card_clear = document.createElement("input")
    card_clear.type = "checkbox"
    card_clear.className = "del-check"
    card_clear.onclick = parent_delet
    var under_line = document.createElement("hr")
    var child_list = document.createElement("p")

    card_body.appendChild(parent_is_html)
    card_body.appendChild(create_check)
    card_body.appendChild(next_line)
    card_body.appendChild(card_name_check)
    card_body.appendChild(card_name)
    card_body.appendChild(card_clear)
    card_body.appendChild(under_line)
    card_body.appendChild(child_list)
}
/*자식창 만들기 */
function createChildBox(parent_id, child_id, list_id, child_parent_id) {
    child_list = document.getElementsByClassName("parent_id" + parent_id)[0].parentNode.lastChild
    var child_name_check = document.createElement("input")
    child_name_check.type = "checkbox"
    child_name_check.className = list_id
    child_name_check.onclick = change_input
    var child_name = document.createElement("il")
    child_name.innerHTML = " " + child_id + " "
    child_name.className = "child_id" + child_id
    var child_parent = document.createElement("input")
    child_parent.type = "number"
    child_parent.value = child_parent_id
    child_parent.className = "child-parent"
    child_parent.style = "width:60px;height:20px;"
    var child_clear = document.createElement("input")
    child_clear.type = "checkbox"
    child_clear.className = "del-check"
    child_clear.onclick = child_delet
    var br = document.createElement("br")


    child_list.appendChild(br)
    child_list.appendChild(child_name_check)
    child_list.appendChild(child_name)
    child_list.appendChild(child_parent)
    child_list.appendChild(child_clear)
}

/*수정*/
function change_input(event) {
    let result = '';
    if (event.target.checked) {
        var change_name = document.createElement('input')
        change_name.className = event.target.nextSibling.innerHTML
        change_name.placeholder = event.target.nextSibling.innerHTML
        event.target.parentNode.insertBefore(change_name, event.target.nextSibling)
        change_name.nextSibling.remove()
    } else {
        var change_name = document.createElement("il")
        change_name.innerHTML = event.target.nextSibling.className
        event.target.parentNode.insertBefore(change_name, event.target.nextSibling)
        change_name.nextSibling.remove()

    }
}
//자식삭제
function child_delet(event) {
    event.target.previousSibling.remove()
    event.target.previousSibling.remove()
    event.target.previousSibling.remove()
    event.target.previousSibling.remove()
    event.target.remove()
}
//부모삭제
function parent_delet(event) {
    if (event.target.checked) {
        del = document.createElement("del")
        del.appendChild(event.target.nextSibling.nextSibling)
        event.target.parentNode.appendChild(del)
    }
    else {
        back_list = event.target.nextSibling.nextSibling.firstChild
        event.target.nextSibling.nextSibling.remove()
        event.target.parentNode.appendChild(back_list)
    }
}

//list창 만들기
const create_list = document.getElementById('create-list-input');
const create_list_button = document.getElementById('create-list');
create_list.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        request_value()
    }
});
create_list_button.addEventListener('click', (e) => {
    request_value()

});
function request_value() {
    const request = document.getElementById('create-list-input').value;
    categoryGet(request)
    document.getElementById('create-list-input').value = ""
}


//save DB
const save_datas_button = document.getElementById("save-data")
save_datas_button.onclick = save_datas
function save_datas() {
    var send_datas = []

    list_boxs = document.getElementsByClassName("card-body")
    for (i = 0; i < list_boxs.length; i++) {
        list_box = list_boxs[i]
        if (list_box.lastChild.previousSibling.previousSibling.checked) {
        }
        else {
            var parent_id = list_box.firstChild.innerHTML
            var parent_name = check_info(list_box.firstChild.nextSibling.nextSibling.nextSibling)
            parent_data = [parent_id, parent_name]




            child_data = []
            child_boxs = list_box.getElementsByTagName("br")
            for (j = 0; j < child_boxs.length; j++) {
                child_id = child_boxs[j].nextSibling.className
                if (child_id.length == 0) {
                    child_id = 0
                }
                child_name = check_info(child_boxs[j].nextSibling)
                parent_child_data = child_boxs[j].nextSibling.nextSibling.nextSibling.value
                child_data = child_data.concat([[child_id, child_name, parent_child_data]])
            }
            send_datas = send_datas.concat([[parent_data, child_data]])

        }
    }
    categorySave(send_datas)
}

function check_info(html_place) {
    if (html_place.checked) {
        return_value = html_place.nextSibling.value
    }
    else {
        return_value = html_place.nextSibling.innerHTML
    }
    return return_value
}
