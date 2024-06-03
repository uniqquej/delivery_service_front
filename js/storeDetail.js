window.onload = ()=>{
    let storeId = localStorage.getItem("storeId");
    loadStoreInfo(storeId);
    loginCheck();
}

let loadStoreInfo = async(storeId)=>{
    
    const res = await fetch(`${mainUrl}/api/store/detail?storeId=${storeId}`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let storeInfo = document.getElementById("storeBox");
    let menuListBox = document.getElementById("menuListBox");

    let resJson = await res.json();
    let store = resJson.body.store;
    let menuList = resJson.body.menu_list;
    
    let storeInfoHtml = `
                            <div class="storeThumbnail">
                                <img src="${store.thumbnail_url}">
                            </div>
                            <div class="storeInfo">
                                <h5><b>${store.name}</b></h5>
                                <span>${store.phone_number}</span>
                                <span>${store.address}</span>
                                <span>⭐ ${store.star}</span>
                                <span ><b>최소주문</b> <span id="minimumDeliveryAmount">${store.minimum_delivery_amount}</span> 원</span>
                            </div>
                            
                            `
    storeInfo.innerHTML = storeInfoHtml;

    let menuListHtml = '';

    menuList.forEach(menu=>{
        if(menu.thumbnail_url=="string"){
            menu.thumbnail_url = "https://mblogthumb-phinf.pstatic.net/MjAxODAzMDNfMjU4/MDAxNTIwMDQxODA4Mjc0.gR3L5xx3IbpACbvRRF9j9xjJmO-EPAY35oF1AdBnDcog.WZyeqFi6cMmH-v-R-ec44Ny6ZgVyAJIYMT78p4Rxbkwg.PNG.osy2201/2_%2850%ED%8D%BC%EC%84%BC%ED%8A%B8_%ED%9A%8C%EC%83%89%29_%ED%9A%8C%EC%83%89_%EB%8B%A8%EC%83%89_%EB%B0%B0%EA%B2%BD%ED%99%94%EB%A9%B4_180303.png?type=w800"
        }
        
        menuListHtml += `
                   <div class="storeMenu" >
                       <div class="form-check">
                            <input onchange="getOrderTotalPrice(this)" id="menuCheckBox${menu.id}" class="form-check-input" type="checkbox" value="${menu.id}">
                       </div>
                       <div class="menuThumbnail">
                           <img src="${menu.thumbnail_url}">
                       </div>
                       <div class="menuInfo">
                           <h5><b>${menu.name}</b></h5>
                           <p id="price_${menu.id}">${menu.amount}원</p>
                           <p>❤ ${menu.like_count}</p>
                       </div>
                       <div class="countBox">
                            <input type="number" id="count_${menu.id}" value=1 min="1"
                            onchange="changeCount(document.getElementById('menuCheckBox${menu.id}'))">  
                       </div>
                   </div>
                   `
    })

    menuListBox.innerHTML = menuListHtml;

}

let getOrderTotalPrice = (obj)=> {

    var orderTotalPrice = Number($("#totalPrice").text());
    var menuId = obj.value;
    var priceText = $("#price_"+menuId).text();
    var price = Number(priceText.slice(0,-1))
    var count = $("#count_" + menuId).val();

    if(obj.dataset.oldCount > count) orderTotalPrice -= price*obj.dataset.oldCount;

    if(obj.checked==true) {
        orderTotalPrice += price*count;
    }
    else orderTotalPrice -= price*count;

    obj.dataset.oldCount = count;

    $("#totalPrice").html(orderTotalPrice);
}

let changeCount = (checkObj)=> {

    if(checkObj.checked==true) {
        getOrderTotalPrice(checkObj)
    };
}

let orderMenu = async()=>{
    var orderTotalPrice = Number($("#totalPrice").text());
    var minumumAmount = Number($("#minimumDeliveryAmount").text());
    console.log("minimum",orderTotalPrice,"   ", minumumAmount)

    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    var checkValues = [];
    var counts = [];
    
    checkboxes.forEach(check=>{
        checkValues.push(check.value);
        counts.push($("#count_"+check.value).val());
    });
    
    if(checkValues.length==0) alert("선택된 메뉴가 없습니다.");

    else if (orderTotalPrice < minumumAmount) alert("최소 금액을 맞춰주세요");

    else{
        let data = JSON.stringify({
            'result':{
                "result_code": 200,
                "result_message": "success",
                "result_description": "order success"
            },
            'body':{
                "store_menu_id_list" : checkValues,
                "count_list": counts
            }
        })
    
        const res = await fetch(`${mainUrl}/api/user-order`,{
            headers:{
                'content-type':'application/json',
                'authorization':localStorage.getItem("access")
            },
            method: 'POST',
            body : data
        })
        let resJson = await res.json();
        if(resJson.result.result_code==200) {
            alert("주문 완료");
            location.replace("home.html");
        }
    }

    
}
