async function userAlarm() {
    const access = localStorage.getItem('access')

    const response = await fetch(`${back_base_url}/alarms/detail/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
    })

    const data = await response.json()

    console.log(data)

    let unreadAlarms = null

    data.forEach(element => {
        if (element.db_status == 1) { // 미확인알람
            unreadAlarms = document.getElementById('unread_alarms')
        }
        if (element.db_status == 2) { // 이전 알람
            unreadAlarms = document.getElementById('read_alarms')
        }

        const col = document.createElement('div')
        col.setAttribute('class', 'col')
        unreadAlarms.appendChild(col)

        const card = document.createElement('div')
        card.setAttribute('class', 'card h-100')
        col.appendChild(card)

        const cardBody = document.createElement('div')
        cardBody.setAttribute('class', 'card-body')
        card.appendChild(cardBody)

        const mainImage = document.createElement('img')
        if (element.db_status == 1) { // 미확인알람
            mainImage.src = "../static/images/unread.png"
        }
        if (element.db_status == 2) { // 이전 알람
            mainImage.src = "../static/images/read.png"
        }
        mainImage.setAttribute('class', 'card-img-top')
        cardBody.appendChild(mainImage)

        const alarmP = document.createElement('p')
        alarmP.setAttribute('class', 'card-text')
        cardBody.appendChild(alarmP)

        if (element.type == "comment") {
            alarmP.textContent = '작성하신 "' + element.article['title'] + '" 게시글에 댓글이 달렸습니다.'
            alarmP.addEventListener('click', function () {
                window.location.href = `${front_base_url}/templates/article_detail.html?id=${element.article['id']}&/`
            })
        }
        else if (element.type == "reply") {
            alarmP.textContent = '"' + element.article['title'] + '" 게시글에 작성한 댓글에 대댓글이 달렸습니다.'
            alarmP.addEventListener('click', function () {
                window.location.href = `${front_base_url}/templates/article_detail.html?id=${element.article['id']}&/`
            })
        }
        else if (element.type == "emoticon") {
            alarmP.textContent = '신청하신 "' + element.emoticon['title'] + '" 이모티콘 등록이 완료되었습니다.'
            alarmP.addEventListener('click', function () {
                window.location.href = `${front_base_url}/templates/emoticon_detail.html?emoticon_id=${element.emoticon['id']}&/`
            })
        }
    });

    if (document.getElementById('unread_alarms').childNodes.length == 1) {
        const unreadAlarms = document.getElementById('unread_alarms')
        const col = document.createElement('div')
        col.setAttribute('class', 'col')
        unreadAlarms.appendChild(col)

        const card = document.createElement('div')
        card.setAttribute('class', 'card h-100')
        col.appendChild(card)

        const cardBody = document.createElement('div')
        cardBody.setAttribute('class', 'card-body')
        card.appendChild(cardBody)

        const alarmP = document.createElement('p')
        alarmP.setAttribute('class', 'card-text')
        cardBody.appendChild(alarmP)

        alarmP.textContent = "알림이 없습니다."
    }
    if (document.getElementById('read_alarms').childNodes.length == 1) {
        const readAlarms = document.getElementById('read_alarms')
        const readCol = document.createElement('div')
        readCol.setAttribute('class', 'col')
        readAlarms.appendChild(readCol)

        const readCard = document.createElement('div')
        readCard.setAttribute('class', 'card h-100')
        readCol.appendChild(readCard)

        const readCardBody = document.createElement('div')
        readCardBody.setAttribute('class', 'card-body')
        readCard.appendChild(readCardBody)

        const readAlarmP = document.createElement('p')
        readAlarmP.setAttribute('class', 'card-text')
        readCardBody.appendChild(readAlarmP)

        readAlarmP.textContent = "알림이 없습니다."
    }
}

userAlarm()
