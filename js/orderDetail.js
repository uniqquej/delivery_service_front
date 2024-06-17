window.onload = ()=>{
    loginCheck();
    loadOrderDetail();
}

const url = new URL(window.location.href);
const urlParams = url.searchParams;
const orderId = Number(urlParams.get('id'))

const loadOrderDetail = async()=>{
    
    const res = await fetch(`${mainUrl}/api/user-order/id/${orderId}`,{
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

    let orderDetailBox = document.getElementById("orderDetail");
    let orderHtml=""

    let menuResponse = resJson.body.user_order_menu_response_list
    let userOrderResponse = resJson.body.user_order_response
    let storeResponse = resJson.body.store_response
    
    orderHtml += `<div class="orderInfo">
                    <div class="orderStoreInfo">
                        <span class="storeName"><b>${storeResponse.name}</b></span>
                        <span>${storeResponse.phone_number}</span>
                    </div>
                    <div class="addressInfo">
                        <span><b>배달주소</b></span><br>
                        <span>${userOrderResponse.address}</span>
                    </div>
                    `
    menuResponse.forEach(
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
                    <span class="totalAmountRes">총 합계 &ensp;${userOrderResponse.total_price}원</span>
                    </div>
                    `   
    
    orderDetailBox.innerHTML = orderHtml;

    let orderTimeStamp = document.getElementById("orderTimeStamp");
    let orderTimeHtml = `
                        <span><b>주문 현황</b></span>
                        <br>
                        <span>주문 : ${moment(userOrderResponse.ordered_at).format('YYYY-MM-DD hh:mm')}</span><br>
                        `

    if(userOrderResponse.accepted_at != null)
        orderTimeHtml += `<span>수락 : ${moment(userOrderResponse.accepted_at).format('YYYY-MM-DD hh:mm')}</span><br>`

    if(userOrderResponse.cooking_started_at != null)
        orderTimeHtml += `<span>조리시작 : ${moment(userOrderResponse.cooking_started_at).format('YYYY-MM-DD hh:mm')}</span><br>`

    if(userOrderResponse.delivery_started_at != null)
        orderTimeHtml += `<span>배달시작 : ${moment(userOrderResponse.delivery_started_at).format('YYYY-MM-DD hh:mm')}</span><br>`

    if(userOrderResponse.received_at != null)
        orderTimeHtml += `<span>배달완료 : ${moment(userOrderResponse.received_at).format('YYYY-MM-DD hh:mm')}</span><br>`
    
    orderTimeStamp.innerHTML = orderTimeHtml;
}