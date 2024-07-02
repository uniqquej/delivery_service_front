window.onload = ()=>{
    loginCheck();
    loadReviewList();
}

const url = new URL(window.location.href);
const urlParams = url.searchParams;
const storeId = Number(urlParams.get('store'))

const backLink = ()=>{
    location.replace(`storeDetail.html?store=${storeId}`)
}

const loadReviewList = async()=>{

    const res = await fetch(`${mainUrl}/api/review/search?storeId=${storeId}&page=${currentPage}`,{
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

    if(2000<= resJson.result.result_code & resJson.result.result_code<= 2003){
        alert("로그인이 필요합니다.");
        window.location.href="login.html";
    }
    
    let myReviewListBox = document.getElementById("reviewListBox");
    let responseHtml = "";
    
    resJson.body.content.forEach(review=>{
        responseHtml += `
        
        <div class="reviewBox">
            <div class="reviewHeader">
                <span class="right">평점 : ${"⭐".repeat(review.star)}</span>
                <span>${moment(review.registered_at).format("YYYY-MM-DD")}</span>
            </div>
            <textarea class="form-control" disabled>${review.content}</textarea>
        </div>
 `;
    })
    
    myReviewListBox.innerHTML = responseHtml;
}
