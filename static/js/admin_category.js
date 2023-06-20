/*admin확인 */
access = localStorage.getItem("access")
if (!access) {
    alert("로그인이 필요합니다.")
    window.location.href = `${front_base_url}/templates/logintemp.html`
} else {
    const payload = localStorage.getItem("payload");
    const payloadParse = JSON.parse(payload)

    if (payloadParse.is_admin == false) {
        alert("관리자만 접근 가능합니다.")
        window.location.href = `${front_base_url}/`
    }
}
/*list받기 */
async function categoryGet() {
    serch_list = '1,2'
    const response = await fetch(`${back_base_url}/reports/childcategory?request_type=${serch_list}&/`, {
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
categoryGet()

var card_box = document.getElementById("card_box")
function createParent(id) {
    var col_category_detail = document.createElement("div")
    col_category_detail.className = "col category_detail"
    var card_h100 = document.createElement("div")
    card_h100.className = "card h-100"
    var card_body = document.createElement("div")
    card_body.className = "card-body"

    card_box.appendChild(col_category_detail)
    col_category_detail.appendChild(card_h100)
    card_h100.appendChild(card_body)

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

    card_body.appendChild(card_name_check)
    card_body.appendChild(card_name)
    card_body.appendChild(card_clear)
    card_body.appendChild(under_line)
    card_body.appendChild(child_list)
}

function createChild(parent_id, child_id) {
    child_list = document.getElementsByClassName("parent_id" + parent_id)[0].parentNode.lastChild
    var child_name_check = document.createElement("input")
    child_name_check.type = "checkbox"
    child_name_check.onclick = change_input
    var child_name = document.createElement("il")
    child_name.innerHTML = " " + child_id + " "
    child_name.className = "child_id" + child_id
    var child_clear = document.createElement("input")
    child_clear.type = "checkbox"
    child_clear.className = "del-check"
    child_clear.onclick = child_delet
    var br = document.createElement("br")


    child_list.appendChild(br)
    child_list.appendChild(child_name_check)
    child_list.appendChild(child_name)
    child_list.appendChild(child_clear)
}
function createList(lists, names) {

    for (list in lists) {
        parant_card = document.getElementsByClassName("parent_id" + lists[list][1])
        if (parant_card.length == 0) {
            createParent(lists[list][1])
        }
        createChild(lists[list][1], lists[list][2])
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
//부모 삭
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

    console.log("work")
}
//자식 삭제함수
function child_delet(event) {
    event.target.previousSibling.remove()
    event.target.previousSibling.remove()
    event.target.previousSibling.remove()
    event.target.remove()
}

function parent_delet(event) {
    console.log("1")
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