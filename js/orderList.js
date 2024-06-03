window.onload = ()=>{
    loginCheck();
}

let loadCurrentOrderList = async()=>{
    const res = await fetch(`${mainUrl}/api/user-order/current`,{
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

        orderHtml += `<div class="orderInfo">
                        <button class="btn btn-dark" onclick="location.replace('orderDetail.html?id=${userOrderResponse.id}')">주문 상세</button>
                        <button class="btn btn-dark" onclick="location.replace('reviewRegister.html?id=${userOrderResponse.id}&store=${storeResponse.id}')">리뷰 작성</button>
                        <span>주문 시간: ${moment(orderDate).format('YYYY-MM-DD hh:mm')}</span><br>
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
                                    <span>${menu.amount * menu.count} 원</span>
                                </div>
                            </div>`
            })
        orderHtml += `
                        <br>
                        <span class="totalAmountRes">총 합계 ${res.user_order_response.amount}</span>
                        </div>
                        `   
    });
    
    orderListBox.innerHTML = orderHtml;
}

let loadOrderList = async()=>{
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
        
        orderHtml += `<div class="orderInfo">
                        <button class="btn btn-dark">주문 상세</button>
                        <span>주문 시간: ${moment(orderDate).format('YYYY-MM-DD hh:mm')}</span><br>
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
                                    <span>${menu.amount * menu.count} 원</span>
                                </div>
                            </div>`
            })
        orderHtml += `
                        <br>
                        <span class="totalAmountRes">총 합계 ${res.user_order_response.amount}</span>
                        </div>
                        `   
    });
    
    orderListBox.innerHTML = orderHtml;
}

