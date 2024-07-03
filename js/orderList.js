window.onload = ()=>{
    loginCheck();
    loadCurrentOrderList();
}

const orderBtn = document.getElementById("orderBtn");
orderBtn.addEventListener("click",()=>{
    currentPage = 1;
    loadCurrentOrderList();
})

const completeOrderBtn = document.getElementById("completeOrderBtn");
completeOrderBtn.addEventListener("click",()=>{
    currentPage = 1;
    loadOrderList();
})


const clickPage = (pageNum)=>{
    console.log("current")
    currentPage = pageNum;
    loadCurrentOrderList();
}

const clickOrderPage = (pageNum)=>{
    console.log("history")

    currentPage = pageNum;
    loadOrderList();
}

const clickOrderPrev = ()=>{
    currentPage -= 1;

    if(currentPage>=firstPage)
        clickOrderPage(currentPage);
    else currentPage += 1;
}

const clickOrderNext = ()=>{
    currentPage += 1;

    if(currentPage<=finalPage)
        clickOrderPage(currentPage);
    else currentPage -= 1;
}

let loadCurrentOrderList = async()=>{

    if(completeOrderBtn.classList.contains("active")) completeOrderBtn.classList.remove("active");

    if(!orderBtn.classList.contains("active")) orderBtn.classList.add("active");


    const res = await fetch(`${mainUrl}/api/user-order/current?page=${currentPage}`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let resJson = await res.json();
    console.log(resJson)

    let startPage = resJson.body.number+1;
    finalPage = resJson.body.total_pages;


    loadingPageButton(startPage, finalPage);
    
    if(2000<= resJson.result.result_code & resJson.result.result_code<= 2003){
        alert("로그인이 필요합니다.");
        window.location.href="login.html";
    }

    let orderListBox = document.getElementById("orderListBox");
    let orderHtml=""

    resJson.body.content.forEach(res => {
        let orderDate = res.user_order_response.ordered_at
        let userOrderResponse = res.user_order_response
        let storeResponse = res.store_response;

        orderHtml += `<div class="orderInfo">
                        <div class="btnBox">
                            <button class="btn btn-dark" onclick="location.replace('orderDetail.html?id=${userOrderResponse.id}')">주문 상세</button>
                        </div>
                        <span>주문 시간: ${moment(orderDate).format('YYYY-MM-DD HH:mm')}</span><br>
                        <div class="orderStoreInfo">
                            <span class="storeName"><b>${res.store_response.name}</b></span>
                            <span>${res.store_response.phone_number}</span>
                        </div>`;
        res.user_order_menu_response_list.forEach(
            menu=>{
                orderHtml += `<div class="orderMenuInfo">
                                <div>
                                    <span class="menuName">${menu.menu_name}</span>
                                    <span>x ${menu.count} &ensp;</span>
                                    <span>${menu.price * menu.count} 원</span>
                                </div>
                            </div>`
            })
        orderHtml += `
                        <br>
                        <span class="totalAmountRes">총 합계&ensp; ${userOrderResponse.total_price}원</span>
                        </div>
                        `   
    });
    
    orderListBox.innerHTML = orderHtml;
}

let loadOrderList = async()=>{
    
    if(orderBtn.classList.contains("active")) orderBtn.classList.remove("active");

    if(!completeOrderBtn.classList.contains("active")) completeOrderBtn.classList.add("active");


    const res = await fetch(`${mainUrl}/api/user-order/history?page=${currentPage}`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let resJson = await res.json();
    console.log(resJson)
    let startPage = resJson.body.number+1;
    finalPage = resJson.body.total_pages;

    loadingOrderPageButton(startPage, finalPage);

    let orderListBox = document.getElementById("orderListBox");
    let orderHtml=""

    resJson.body.content.forEach(res => {
        let orderDate = res.user_order_response.ordered_at
        let userOrderResponse = res.user_order_response
        let storeResponse = res.store_response;
        let hasReview = res.user_order_response.has_review

        let reviewBtn = `<button class="btn btn-dark" onclick="location.replace('reviewRegister.html?id=${userOrderResponse.id}&store=${storeResponse.id}')">리뷰 작성</button>`

        if(hasReview) reviewBtn = `<button class="btn btn-secondary" disabled>리뷰 완료</button>`
        
        orderHtml += `<div class="orderInfo">
                        <div class="btnBox">
                            <button class="btn btn-dark" onclick="location.replace('orderDetail.html?id=${userOrderResponse.id}')">주문 상세</button>
                            ${reviewBtn}
                        </div>
                        <span>주문 시간: ${moment(orderDate).format('YYYY-MM-DD HH:mm')}</span><br>
                        <br>
                        <div class="orderStoreInfo">
                            <span class="storeName"><b>${res.store_response.name}</b></span>
                            <span>${res.store_response.phone_number}</span>
                        </div>`;
        res.user_order_menu_response_list.forEach(
            menu=>{
                orderHtml += `<div class="orderMenuInfo">
                                <div>
                                    <span class="menuName">${menu.menu_name}</span>
                                    <span>x ${menu.count}</span>
                                    <span>${menu.price * menu.count} 원</span>
                                </div>
                            </div>`
            })
        orderHtml += `
                        <br>
                        <span class="totalAmountRes">총 합계 ${userOrderResponse.total_price}</span>
                        </div>
                        `   
    });
    
    orderListBox.innerHTML = orderHtml;
}

