window.onload = ()=>{
    loginCheck();
    loadMyInfo();
}

const loadReviewList = async()=>{
    const myInfoBtn = document.getElementById("myInfoBtn");
    const myReviewBtn = document.getElementById("myReviewBtn");
    const likeStorewBtn = document.getElementById("likeStorewBtn");

    if(myInfoBtn.classList.contains("active")) myInfoBtn.classList.remove("active");
    if(likeStorewBtn.classList.contains("active")) likeStorewBtn.classList.remove("active");

    if(!myReviewBtn.classList.contains("active")) myReviewBtn.classList.add("active");

    const res = await fetch(`${mainUrl}/api/review/search`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let resJson = await res.json();

    let myReviewListBox = document.getElementById("responseBox");
    let responseHtml = "";

    resJson.body.forEach(review=>{
        responseHtml += `
        <div id="myReviewListBox">
            <div class="reviewBox">
                <div class="reviewHeader">
                    <span class="star">평점 : ${"⭐".repeat(review.star)}</span>
                    <span>${moment(review.registered_at).format("YYYY-MM-DD")}</span>
                </div>
                <textarea class="form-control" disabled>${review.content}</textarea>
                <a href="orderDetail.html?id=${review.user_order_id}">주문 내역으로 이동</a>
                <button class="btn btn-dark" onclick='location.replace("reviewRegister.html?review=${review.id}")'>수정</button>
            </div>
        </div>`;
    })
    
    myReviewListBox.innerHTML = responseHtml;
}

const loadMyInfo = async()=>{

    const myInfoBtn = document.getElementById("myInfoBtn");
    const myReviewBtn = document.getElementById("myReviewBtn");
    const likeStorewBtn = document.getElementById("likeStorewBtn");

    if(myReviewBtn.classList.contains("active")) myReviewBtn.classList.remove("active");
    if(likeStorewBtn.classList.contains("active")) likeStorewBtn.classList.remove("active");

    if(!myInfoBtn.classList.contains("active")) myInfoBtn.classList.add("active");

    const res = await fetch(`${mainUrl}/api/user/me`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let resJson = await res.json();
    
    if(2000<= resJson.result.result_code & resJson.result.result_code<= 2003){
        alert("로그인이 필요합니다.");
        window.location.href="login.html";
    }

    let responseBox = document.getElementById("responseBox");
    let responseHtml = "";

    let resBody = resJson.body;

    responseHtml += `
            <div class="userInput">       
                <label for="inputName" class="col-form-label">name</label>
                <input type="text" id="inputName" class="form-control" disabled value="${resBody.name}">       
            </div>
            <div class="userInput">
                <label for="inputEmail" class="col-form-label">email</label>
                <input type="email" id="inputEmail" class="form-control"disabled value="${resBody.email}">
            </div>
            <div class="userInput">
                <label for="inputAddress" class="col-form-label">address</label>
                <input type="text" id="inputAddress" class="form-control" disabled value="${resBody.address}">   
            </div>
            <br>
            <button class="btn btn-dark" onclick="loadUpdatePage('${resBody.name}', '${resBody.email}', '${resBody.address}')">수정</button>
    
    `
    responseBox.innerHTML = responseHtml;
}

const loadUpdatePage = (name, email, address)=>{

    let responseBox = document.getElementById("responseBox");
    let responseHtml = "";

    responseHtml += `
            <div class="userInput">       
                <label for="inputName" class="col-form-label">name</label>
                <input type="text" id="inputName" class="form-control"  value="${name}">       
            </div>

            <div class="userInput">
                <label for="inputEmail" class="col-form-label">email</label>
                <input type="email" id="inputEmail" class="form-control" disabled value="${email}">
            </div>

            <div class="userInput">
                <label for="inputAddress" class="col-form-label">address</label>
                <input type="text" id="inputAddress" class="form-control" value="${address}">
            </div>

            <div class="userInput">
                <label for="inputPassword" class="col-form-label">Password</label>
                <input type="password" id="inputPassword" class="form-control">
            </div>

            <br>

            <button class="btn btn-dark" onclick="updateMyInfo()">저장</button>
    
    `
    responseBox.innerHTML = responseHtml;
}

const updateMyInfo = async()=>{
    let name = document.getElementById("inputName").value;
    let address = document.getElementById("inputAddress").value;
    let password = document.getElementById("inputPassword").value;


    let data = JSON.stringify({
        'result':{
            "result_code": 200,
            "result_message": "success",
            "result_description": "update success"
        },
        'body':{
            'name':name,
            'address':address,
            'password':password
        }
    })

    const res = await fetch(`${mainUrl}/api/user/id`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'POST',
        body: data
    })

    let resJson = await res.json();
    if(resJson.result.result_code==200) location.replace('myPage.html');
    else {
        let errorMessages = resJson.result.result_description
        alert(errorMessages.replaceAll(',','\n'));
    }
}

const loadLikeStore = async()=>{

    const myInfoBtn = document.getElementById("myInfoBtn");
    const myReviewBtn = document.getElementById("myReviewBtn");
    const likeStorewBtn = document.getElementById("likeStorewBtn");

    if(myReviewBtn.classList.contains("active")) myReviewBtn.classList.remove("active");
    if(myInfoBtn.classList.contains("active")) myInfoBtn.classList.remove("active");

    if(!likeStorewBtn.classList.contains("active")) likeStorewBtn.classList.add("active");

    const res = await fetch(`${mainUrl}/api/like-store`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let resJson = await res.json();
    
    if(2000<= resJson.result.result_code & resJson.result.result_code<= 2003){
        alert("로그인이 필요합니다.");
        window.location.href="login.html";
    }

    let responseBox = document.getElementById("responseBox");
    let responseHtml = "";

    resJson.body.forEach(store=>{
        responseHtml += `
             <div class="storeInfo">
                <div class="storeThumbnail">
                    <img src="${store.thumbnail_url}">
                </div>
                <div>
                    <h5  class="linkBtn" onclick="location.replace('storeDetail.html?store=${store.id}&category=${store.category}')">
                    <b>${store.name}</b>
                    </h5>
                    <span>⭐ ${parseFloat(store.star).toFixed(2)} </span><br>
                    <span onclick="likeStore(${store.id})" class="likeBtn">💖&nbsp&nbsp ${store.likes}</span><br>
                    <span>최소주문 ${store.minimum_delivery_price}원</span>
                </div>  
            </div>`

    });

    responseBox.innerHTML = responseHtml;
}