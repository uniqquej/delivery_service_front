let mainUrl = "http://127.0.0.1:8080";
let adminUrl = "http://127.0.0.1:8081";

const loginCheck = ()=>{
    let userInfo = document.getElementById("loginCheck");
    let roleInfo = document.getElementById("roleCheck");
    
    const currentTime = new Date().getTime() / 1000;
    const expiredAt = localStorage.getItem("expiredAt");

    if (expiredAt && currentTime > expiredAt) {
        console.log("xxxxxxxxx")
        alert("로그인이 만료되었습니다.");
        logout();
    }
    console.log("유효함")

    if (localStorage.getItem("access") !== null) {
        if(localStorage.getItem("role")=="ADMIN")
            roleInfo.innerHTML = `<a href="myPage.html">점포관리</a>`
        else roleInfo.innerHTML = `
        <a href="orderList.html">주문관리</a>
        <a href="myPage.html">마이페이지</a>
        `

        userInfo.innerHTML = `<a class="logout" onclick="logout()" style="color:white;">로그아웃</a>`

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

let clickCategory = (category)=>{
    location.replace("storeList.html");
    localStorage.setItem("category", category)
}

let clickSearch = ()=>{
    let search = document.getElementById("searchInput").value;
    location.replace(`storeList.html?search=${search}`);
}

const goBack = ()=>{
    window.history.back();
}