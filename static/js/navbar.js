// includeHTML파일 대신 fetch로 뿌려주기 (컴포넌트화, 프로젝트 아키텍쳐)
async function injectNavbar() {
    fetch("../navbar.html").then(response => {
        return response.text()
    })
        .then(data => {
            document.querySelector("header").innerHTML = data;
        })
    let navbarHtml = await fetch("../navbar.html")
    let data = await navbarHtml.text()
    document.querySelector("header").innerHTML = data;


    const payload = localStorage.getItem("payload");
    if (payload) {
        const payload_parse = JSON.parse(payload)

        const intro = document.getElementById("intro")
        intro.innerText = `${payload_parse.nickname}님`

        const mypage = document.getElementById("mypage")
        mypage.innerText = "마이페이지"
        mypage.setAttribute("href", "/templates/profile.html")

        let navbarRight = document.getElementById("navbar-right")
        let newLi = document.createElement("li")
        newLi.setAttribute("class", "nav-item")

        let logoutBtn = document.createElement("button")
        logoutBtn.setAttribute("class", "nav-link btn text-white")
        logoutBtn.innerText = "로그아웃"
        logoutBtn.setAttribute("onClick", "handleLogout()")

        newLi.appendChild(logoutBtn)

        navbarRight.appendChild(newLi)


        let signInButton = document.getElementById("navbar-signin")
        signInButton.style.display = "none";
        let signUpButton = document.getElementById("navbar-signup")
        signUpButton.style.display = "none";

        if (payload_parse.is_admin == true) {
            const adminButton = document.getElementById("admin")
            adminButton.style.display = "block"
        }
    }
}

injectNavbar();

function handleLogout() {
    alert("로그아웃!")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.href = `${front_base_url}/index.html`
}

async function injectFooter() {
    fetch("../footer.html").then(response => {
        return response.text()
    })
        .then(data => {
            document.querySelector("footer").innerHTML = data;
        })
}

injectFooter()