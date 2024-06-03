let mainUrl = "http://127.0.0.1:8080";

window.onload = ()=>{
    loginCheck();  
}


const url = new URL(window.location.href);
const urlParams = url.searchParams;
const orderId = Number(urlParams.get('id'))
const storeId = Number(urlParams.get('store'))


const reviewRegisterBtn = document.getElementById("reviewRegisterBtn");
reviewRegisterBtn.addEventListener('click',()=>reviewRegister() );

let reviewRegister = async()=>{
    let reviewStar = document.getElementById("reviewStar").value;
let reviewContent = document.getElementById("reviewContent").value;

    let data = JSON.stringify({
        'result':{
            "result_code": 200,
            "result_message": "success",
            "result_description": "review register success"
        },
        'body':{
            "content" : reviewContent,
            "star": reviewStar,
            "store_id": storeId,
            "user_order_id": orderId
        }
    })

    const res = await fetch(`${mainUrl}/api/review/register`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'POST',
        body: data
    })

    let resJson = await res.json();
    
    if(resJson.result.result_code==200){
        alert("작성 완료");
        location.replace("myPage.js");
    }
}