import { socialLogin } from './social.js'

// 로그인 페이지에서 소셜로그인 버튼
window.onload = async () => {
    const kakao = document.getElementById('kakao');
    const naver = document.getElementById('naver');
    const github = document.getElementById('github');
    const google = document.getElementById('google');


    kakao.addEventListener('click', () => {
        socialLogin('kakao-login')
    })

    naver.addEventListener('click', () => {
        socialLogin('naver-login')
    })

    github.addEventListener('click', () => {
        socialLogin('github-login')
    })

    google.addEventListener('click', () => {
        socialLogin('google-login')
    })

}