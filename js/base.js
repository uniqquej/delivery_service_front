const loginCheck = ()=>{
    let userInfo = document.getElementById("loginCheck");
    let roleInfo = document.getElementById("roleCheck");
    

    if (localStorage.getItem("access") !== null) {
        if(localStorage.getItem("role")=="ADMIN")
            roleInfo.innerHTML = `<a href="myPage.html">점포관리</a>`
        else roleInfo.innerHTML = `<a href="myPage.html">마이페이지</a>`
        
        userInfo.innerHTML = `<a onclick="logout()">로그아웃</a>`

    } else {
        userInfo.innerHTML = `<a href="login.html">로그인</a>`
    }

}

const logout = ()=>{
    localStorage.clear()
    location.replace("home.html");
}

const payload = ()=>{
    const accessToken = localStorage.getItem("access");

    if(accessToken!=null){
        
    }

}

