/** 권한 확인 - 현재 로그인된 유저 정보 확인*/
async function isLogin(num) {

    var num = num
    let access = localStorage.getItem("access")
    if (!access) {
        const response = await fetch(`${back_base_url}/users/islogin/`, {
            headers: {
                // Authorization: `Bearer ${access}`,
            },
            method: "GET",
        });

        const result = await response.json()

        // alert("response");
        // alert(result[0]);
        // alert(response.status);
        // alert("Anonymouse");
        // window.location.href = `${front_base_url}/templates/logintemp.html`
        const userornot = result[0]


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

        if (response.status == 200) {
            const is_admin = result.is_admin
            // if ()
            // localStorage.setItem("is_admin", result.is_admin)
            if (is_admin == true) {
                num = 2
                return num

            }
            else {
                num = 3
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
        return "AnonymousUser"
    }
    if (2) {
        return "Admin"
    }
    if (3) {
        return "User"
    }

}

// isLogin();

export function find(num) {
    var num = num
    if (num == 1) {
        isLogin(1)
    }
    if (num == 2) {
        isLogin(2)

    }
    if (num == 3) {
        isLogin(3)

    }

};

find(1)

// if (isLogin() == "Ano")

//     // isLogin();

// var is_admin = isLogin();


// if (isLogin() == 3) {
// }

// const promise = is_admin;
// const getData = async () => {
//     return promise.then((appData) => {
//         const data = is_admin
//         return data
//     })
//     // return promise
// };

// const data = getData();

// const printResult = async () => {
//     result = await getData();
//     return getData()
// };
// printResult();

// let print00 = printResult()

// const promise = isLogin();
// function getData() {
//     return promise.then((appData) => {
//         var result = appData

//         var con = result

//         if (con == "AnonymousUser") {//비로그인
//             alert("비로그인" + appData)
//             // var appData = 1
//             return appData
//         }
//         else if (con == true) {//로그인+관리자
//             alert("관리자" + appData)
//             var appData = 2
//             return appData
//         }
//         else {//로그인+일반유저
//             alert("일반" + appData)
//             var appData = 3
//             return appData
//         }
//     });
// };

// // getData()

// let proj = getData();


// async function printData() {
//     const data = await getData();

//     return data
// }

// let data = printData();
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