
const url = new URL(window.location.href);
const urlParams = url.searchParams;
const orderId = Number(urlParams.get('id'))
const storeId = Number(urlParams.get('store'))
const reviewId = urlParams.get('review')

window.onload = ()=>{
    loginCheck();
    if(reviewId != null) loadReview();
}

const reviewRegisterBtn = document.getElementById("reviewRegisterBtn");
reviewRegisterBtn.addEventListener('click',()=> {
    
    if(reviewId==null) reviewRegister();
    else reviewUpdate();
});

const loadReview = async()=>{
    document.getElementById("pageTitle").innerHTML = "리뷰 수정"
    reviewRegisterBtn.innerText = "수정"

    const res = await fetch(`${mainUrl}/api/review/id/${Number(reviewId)}`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let resJson = await res.json();
    
    let reviewStar = document.getElementById("reviewStar")
    let reviewContent = document.getElementById("reviewContent")

    reviewStar.value = resJson.body.star;
    reviewContent.value = resJson.body.content;
    
}



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
        location.replace("myPage.html");
    }
}

let reviewUpdate = async()=>{
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
        }
    })

    const res = await fetch(`${mainUrl}/api/review/id/${Number(reviewId)}`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'POST',
        body: data
    })

    let resJson = await res.json();
    
    if(resJson.result.result_code==200){
        alert("수정 완료");
        location.replace("myPage.html");
    }
}