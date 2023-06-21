// 커서 위치에 이모지 넣기
function insertTextAtCursor(input, text) {
    const startPos = input.selectionStart;
    const endPos = input.selectionEnd;
    const currentValue = input.value;

    const newValue = currentValue.substring(0, startPos) + text + currentValue.substring(endPos);

    input.value = newValue;
    input.selectionStart = startPos + text.length;
    input.selectionEnd = startPos + text.length;

    input.focus();
    input.setSelectionRange(input.selectionEnd, input.selectionEnd);
}

// 이모지 넣기
function putEmoji(emojidiv_id, input_id, input_type) {
    const emojiBox = document.getElementById(emojidiv_id)

    //이모지 넣을때 split해서 넣기
    const emojiInstance = baseEmoji.split(' ')
    emojiInstance.forEach(element => {
        const emojiIconSpan = document.createElement('span')
        emojiIconSpan.textContent = element
        emojiIconSpan.setAttribute('style', 'font-size: 30px')
        emojiIconSpan.setAttribute('class', 'emoticon')
        emojiBox.appendChild(emojiIconSpan)
    });

    //이모지 클릭시 인풋에 넣기
    let emojiIcons = emojiBox.childNodes
    emojiIcons.forEach(element => {
        element.addEventListener('click', function () {
            if (isNaN(parseInt(input_id))) {
                let commentInput = document.getElementById(input_id)
                insertTextAtCursor(commentInput, element.innerText)
            } else {
                let commentInput = document.getElementById(`${input_type}${input_id}`)
                insertTextAtCursor(commentInput, element.innerText)
            }
        })
    });
}

const emojidiv_id = 'emojiIcons'
const input_id = 'comment_content'
putEmoji(emojidiv_id, input_id)
