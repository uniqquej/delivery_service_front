let mainUrl = "http://127.0.0.1:8080";

let loadCurrentOrderList = async()=>{
    const res = await fetch(`${mainUrl}/api/user-order/current`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let resJson = await res.json();
    console.log(resJson);

    let orderListBox = document.getElementById("orderListBox");
    let orderHtml=""

    resJson.body.forEach(res => {
        console.log(res)
        orderHtml += `<div>
                        <span>주문 시간: ${res.user_order_response.ordered_at}</span>
                        <div class="orderStoreInfo">
                            <h5>${res.store_response.name}</h5>
                            <span>${res.store_response.phone_number}</span>
                        </div>`;
        res.user_order_menu_response_list.forEach(
            menu=>{
                orderHtml += `  <div class="orderMenuInfo">
                            <div>
                                <h5>${menu.menu_name}</h5>
                                <span>수량 : ${menu.count}</span>
                                <span>${menu.amount * menu.count}</span>
                            </div>  
                        </div>`
            })
        orderHtml += `</div>`   
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
    console.log(resJson);

    let storeInfo = resJson.body.store_response;
    console.log(storeInfo)
    let orderListBox = document.getElementById("orderListBox");
    let orderHtml = `<div>
                        <div class="orderStoreInfo">
                            <h5>${storeInfo.name}</h5>
                            <span>${storeInfo.phone_number}</span>
                        </div>`;

    resJson.body.user_order_menu_response_list.forEach(menu => {
        console.log(menu)
        orderHtml += `  <div class="orderMenuInfo">
                            <div>
                                <h5>${menu.name}</h5>
                                <span>수량 : ${menu.count}</span>
                                <span>${menu.amount * menu.count}</span>
                            </div>  
                        </div>`
    });
    orderHtml += `</div>`
    orderListBox.innerHTML = orderHtml;
}

