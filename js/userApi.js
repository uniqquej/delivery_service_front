const mainUrl = 'http://127.0.0.1:8080';

window.onload = ()=>{
    loginCheck();
}

const handleSignup = async()=>{
    let name = document.getElementById("inputName").value;
    let email = document.getElementById("inputEmail").value;
    let password = document.getElementById("inputPassword").value;
    let address = document.getElementById("inputAddress").value;


    let data = JSON.stringify({
        'result':{
            "result_code": 200,
            "result_message": "success",
            "result_description": "signup success"
        },
        'body':{
            'email':email,
            'name':name,
            'password':password,
            'address':address
        }
    })

    const res = await fetch(`${mainUrl}/open-api/user/register`,{
        headers:{
            'content-type':'application/json',
        },
        method: 'post',
        body: data
    })

    let resJson = await res.json();
    if(resJson.result.result_code==200) location.replace('login.html');
    else {
        let errorMessages = resJson.result.result_description
        alert(errorMessages.replaceAll(',','\n'));
    }
}

const handleLogin = async()=>{
    let email = document.getElementById("inputEmail").value;
    let password = document.getElementById("inputPassword").value;

    let data = JSON.stringify({
        'result':{
            "result_code": 200,
            "result_message": "success",
            "result_description": "login success"
        },
        'body':{
            'email':email,
            'password':password
        }
    })

    const res = await fetch(`${mainUrl}/open-api/user/login`,{
        headers:{
            'content-type':'application/json',
        },
        method: 'post',
        body: data
    })

    let resJson = await res.json();
    
    if(resJson.result.result_code==200){ 
        const base64Url = resJson.body.access_token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = JSON.parse(decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
        
        localStorage.setItem("access",resJson.body.access_token);
        localStorage.setItem("refresh",resJson.body.refresh_token);
        localStorage.setItem("role",jsonPayload.role);
        
        location.replace('home.html');
    }else {
        let errorMessages = resJson.result.result_description
        alert(errorMessages.replaceAll(',','\n'));
    }

}

let clickCategory = (category)=>{
    location.replace("storeList.html");
    localStorage.setItem("category", category)
}