/** 권한 확인 - 현재 로그인된 유저 정보 확인*/
async function isLogin(num) {

    var num = num
    let access = localStorage.getItem("access")
    // console.log(access)
    if (!access) {
        const response = await fetch(`${back_base_url}/users/islogin/`, {
            headers: {
                // Authorization: `Bearer ${access}`,
            },
            method: "GET",
        });

        const result = await response.json()
        // console.log(result)
        // console.log(typeof (result))

        // alert("response");
        // alert(result[0]);
        // alert(response.status);
        // alert("Anonymouse");
        // window.location.href = `${front_base_url}/templates/logintemp.html`
        const userornot = result[0]

        // console.log(userornot)

        if (userornot == "AnonymousUser") {
            alert("로그인이 필요합니다.")
            window.location.href = `${front_base_url}/templates/logintemp.html`
            num = 1
            return num
        }
    }
    else {
        // if (!access) {
        //     alert("isLn: 로그인 후 이용가능합니다.");
        //     window.location.href = `${front_base_url}/templates/logintemp.html`
        // } else {
        // alert("isLn: 확인중");
        const response = await fetch(`${back_base_url}/users/islogin/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            method: "GET",
        });

        const result = await response.json()
        // console.log(result)

        if (response.status == 200) {
            console.log("common")
            console.log("is_admin:" + result.is_admin)
            const is_admin = result.is_admin
            console.log(is_admin)
            // if ()
            // console.log(result)
            // localStorage.setItem("is_admin", result.is_admin)
            if (is_admin == true) {
                num = 2
                console.log(2)
                return num

            }
            else {
                num = 3
                console.log(3)
                return num
            }
        } else {
            alert("response");
            alert(result);
            alert(response.status);
            alert("isLogin: 접근할수 없는 페이지 입니다.");
            window.location.href = `${front_base_url}/templates/logintemp.html`
        }
        // }
    }

    if (1) {
        console.log("비로그인")
        return "AnonymousUser"
    }
    if (2) {
        console.log("로그인관리자")
        return "Admin"
    }
    if (3) {
        console.log("일반유저")
        return "User"
    }

}

// isLogin();

export function find(num) {
    var num = num
    if (num == 1) {
        console.log("비로그인")
        isLogin(1)
        console.log("로그인통과?")

    }
    if (num == 2) {
        console.log("관리자")
        isLogin(2)

    }
    if (num == 3) {
        console.log("유저")
        isLogin(3)

    }

};

find(1)

// if (isLogin() == "Ano")

//     // isLogin();

// var is_admin = isLogin();

// console.log("is_admin")
// console.log("is_admin")
// console.log(is_admin)

// if (isLogin() == 3) {
//     console.log("비로그인")
// }

// const promise = is_admin;
// const getData = async () => {
//     return promise.then((appData) => {
//         console.log(appData);
//         const data = is_admin
//         console.log(data)
//         console.log(typeof (data))
//         return data
//     })
//     // return promise
// };

// const data = getData();
// console.log(data)

// const printResult = async () => {
//     result = await getData();
//     console.log(result)
//     return getData()
// };
// printResult();

// let print00 = printResult()
// console.log(print00)

// const promise = isLogin();
// function getData() {
//     return promise.then((appData) => {
//         console.log("appData");
//         console.log(appData);
//         console.log(typeof (appData));
//         var result = appData
//         console.log(result)

//         var con = result

//         if (con == "AnonymousUser") {//비로그인
//             console.log(1)
//             alert("비로그인" + appData)
//             // var appData = 1
//             console.log(appData)
//             return appData
//         }
//         else if (con == true) {//로그인+관리자
//             console.log(2)
//             alert("관리자" + appData)
//             var appData = 2
//             return appData
//         }
//         else {//로그인+일반유저
//             console.log(3)
//             alert("일반" + appData)
//             var appData = 3
//             return appData
//         }
//     });
// };

// // getData()

// let proj = getData();
// console.log(proj)


// async function printData() {
//     const data = await getData();

//     return data
// }

// let data = printData();
// console.log(data)
// function type_() {
//     if ("AnonymousUser") {
//         return 1
//     }
//     else if (true) {
//         return 2
//     }
//     else {
//         return 3
//     }
// }

// type_()

// isLogin(() => {
//     const promise = is_admin;
//     const getData = () => {
//         promise.then((is_admin) => {
//             console.log(is_admin);
//             setdata1(is_admin);
//         });
//     };
//     getData();
// }, []);
// function islogin() {
//     let token = localStorage.getItem("access")

//     if (!token) {
//         alert("isLn: 접근할수 없는 페이지 입니다.");
//         window.location.href = `${front_base_url}/templates/logintemp.html`
//     }
// }

// islogin()