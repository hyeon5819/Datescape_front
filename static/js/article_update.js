const searchInput = document.getElementById("tags");
const ul = document.getElementById("tag_ul")
let page_num = 0
// 문자열 형식
function testListTextGet() {
    let tagListText = ''
    const tagList = ul.childNodes
    for (let i = 1; i < tagList.length; i++) {
        tagListText += '#' + tagList[i].textContent
    }

    return tagListText
}
console.log("게시글수정로드")