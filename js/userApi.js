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
    if(resJson.result.result_code==200){
        if(resJson.body.id != null)
            location.replace('login.html');
        else
            $("#emailError").html(resJson.body.email);      
    }else{
        errorMessages = resJson.result.result_description.split(",")

        let addressError = "";
        let passwordError = "";
        let nameError = "";
        let emailError = "";

        errorMessages.forEach(error => {
            if (error.includes("주소"))
                addressError = error;
            else if (error.includes("비밀번호"))
                passwordError = error;
            else if (error.includes("이름"))
                nameError = error;
            else if (error.includes("이메일"))
                emailError = error;
        });

        // 각각의 필드에 해당하는 오류 메시지를 설정
        $("#addressError").html(addressError);
        $("#passwordError").html(passwordError);
        $("#nameError").html(nameError);
        $("#emailError").html(emailError);
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
        localStorage.setItem("expiredAt", resJson.body.expired_at);
        
        location.replace('home.html');
    }else {
        let errorMessages = resJson.result.result_description
        alert(errorMessages.replaceAll(',','\n'));
    }

}
