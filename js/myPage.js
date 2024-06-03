window.onload = ()=>{
    loginCheck();
}

const loadReviewList = async()=>{
    const res = await fetch(`${mainUrl}/api/review/search`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let resJson = await res.json();
    console.log(resJson)

    let responseBox = document.getElementById("responseBox");
    let responseHtml = "";

    resJson.body.forEach(review=>{
        responseHtml += `<div class="reviewBox">
            <div class="reviewHeader">
                <span class="star">평점 : ${"⭐".repeat(review.star)}</span>
                <span>${moment(review.registered_at).format("YYYY-MM-DD")}</span>
            </div>
            <textarea class="form-control" disabled>${review.content}</textarea>
            <a href="orderDetail.html?id=${review.user_order_id}">주문 내역으로 이동</a>
            <button class="btn btn-dark" onclick='location.replace("reviewRegister.html?review=${review.id}")'>수정</button>
        </div>`;
    })
    responseBox.innerHTML = responseHtml;
}