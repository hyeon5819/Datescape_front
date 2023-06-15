// 이모지 넣기
function putEmoji(emojidiv_id, input_id){
    console.log('확인용ㅇㅇㅇㅇㅇㅇㅇ',parseInt(input_id), isNaN(parseInt(input_id)))
    const emojiBox = document.getElementById(emojidiv_id)

    //이모지 넣을때 split해서 넣기
    const emojiInstance = baseEmoji.split(' ')
    emojiInstance.forEach(element => {
        const emojiIconSpan = document.createElement('span')
        emojiIconSpan.textContent = element
        emojiIconSpan.setAttribute('style','font-size: 30px')
        emojiBox.appendChild(emojiIconSpan)
    });

    //이모지 클릭시 인풋에 넣기
    let emojiIcons = emojiBox.childNodes
    emojiIcons.forEach(element => {
        element.addEventListener('click', function () {
            if(isNaN(parseInt(input_id))){
                let commentInput = document.getElementById(input_id)
                let nowInput = commentInput.value
                commentInput.value = nowInput + element.innerText
            } else{
                let commentInput = document.getElementById(`update_input${input_id}`)
                let nowInput = commentInput.value
                commentInput.value = nowInput + element.innerText
            }
        })
    });
}

const emojidiv_id = 'emojiIcons' 
const input_id = 'comment_content' 
putEmoji(emojidiv_id, input_id)
