window.onload = ()=>{
    loginCheck();
    loadReviewList();
}

const loadReviewList = async()=>{
    const myInfoBtn = document.getElementById("myInfoBtn");
    const myReviewBtn = document.getElementById("myReviewBtn");
    const likeStorewBtn = document.getElementById("likeStorewBtn");

    if(myInfoBtn.classList.contains("active")) myInfoBtn.classList.remove("active");
    if(likeStorewBtn.classList.contains("active")) likeStorewBtn.classList.remove("active");

    if(!myReviewBtn.classList.contains("active")) myReviewBtn.classList.add("active");

    const res = await fetch(`${mainUrl}/api/review/search?page=${currentPage}`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let resJson = await res.json();

    let startPage = resJson.body.number+1;
    finalPage = resJson.body.total_pages;


    loadingPageButton(startPage, finalPage);

    let myReviewListBox = document.getElementById("myReviewBox");
    let responseHtml = "";

    resJson.body.content.forEach(review=>{
        responseHtml += `
        <div id="myReviewListBox">
            <div class="reviewBox">
                <div class="reviewHeader">
                    <span class="star">평점 : ${"⭐".repeat(review.star)}</span>
                    <span>${moment(review.registered_at).format("YYYY-MM-DD HH:mm")}</span>
                </div>
                <textarea class="form-control" disabled>${review.content}</textarea>
                <a href="orderDetail.html?id=${review.user_order_id}">주문 내역으로 이동</a>
                <button class="btn btn-dark" onclick='location.replace("reviewRegister.html?review=${review.id}")'>수정</button>
            </div>
        </div>`;
    })
    
    myReviewListBox.innerHTML = responseHtml;
}