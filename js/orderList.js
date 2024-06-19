window.onload = ()=>{
    loginCheck();
    loadCurrentOrderList();
}

let loadCurrentOrderList = async()=>{
    const orderBtn = document.getElementById("orderBtn");
    const completeOrderBtn = document.getElementById("completeOrderBtn");

    if(completeOrderBtn.classList.contains("active")) completeOrderBtn.classList.remove("active");

    if(!orderBtn.classList.contains("active")) orderBtn.classList.add("active");


    const res = await fetch(`${mainUrl}/api/user-order/current`,{
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

    let orderListBox = document.getElementById("orderListBox");
    let orderHtml=""

    resJson.body.forEach(res => {
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
    const orderBtn = document.getElementById("orderBtn");
    const completeOrderBtn = document.getElementById("completeOrderBtn");

    if(orderBtn.classList.contains("active")) orderBtn.classList.remove("active");

    if(!completeOrderBtn.classList.contains("active")) completeOrderBtn.classList.add("active");


    const res = await fetch(`${mainUrl}/api/user-order/history`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let resJson = await res.json();

    let orderListBox = document.getElementById("orderListBox");
    let orderHtml=""

    resJson.body.forEach(res => {
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

