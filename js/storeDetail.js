const url = new URL(window.location.href);
const urlParams = url.searchParams;
const storeId = Number(urlParams.get('store'))
const category = urlParams.get("category");
const imgUrl = "http://localhost:8081";

window.onload = ()=>{
    loadStoreInfo(storeId);
    loginCheck();
}

const storeDetailBackBtn = document.getElementById('storeDetailBackBtn');


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
    let status = resJson.result.result_code;
    
    if(2000<=status & status <=2004) {
        alert("로그인이 필요합니다.")
        location.replace("login.html");
    }
    
    let store = resJson.body.store;
    let menuList = resJson.body.menu_list;

    let like = resJson.body.liked_store;
    let likeElement = `<span onclick="likeStore(${storeId})" class="likeBtn">🖤&nbsp&nbsp ${store.likes}</span>`

    if(like)likeElement = `<span onclick="likeStore(${storeId})" class="likeBtn">💖&nbsp&nbsp ${store.likes}</span>`
    storeDetailBackBtn.addEventListener("click",e=>window.location.href = `storeList.html?category=${store.category}`);
    
    let storeInfoHtml = `
                <div class="storeThumbnail">
                    <img src="${store.thumbnail_url}">
                </div>
                <div class="storeInfo">
                    <button class="btn btn-dark" id="storeReviewBtn" onclick="location.replace('reviewList.html?store=${storeId}')">리뷰확인</button>
                    <h5><b>${store.name}</b></h5>
                    <span>${store.phone_number}</span>
                    <span>${store.address}</span>
                    <span>⭐ ${parseFloat(store.star).toFixed(2)}</span>
                    ${likeElement}
                    <span ><b>최소주문</b> <span id="minimumDeliveryAmount">${store.minimum_delivery_price}</span> 원</span>
                </div>
            `
    storeInfo.innerHTML = storeInfoHtml;

    let menuListHtml = '';

    menuList.forEach(menu=>{
        if(menu.thumbnail_url=="string"){
            menu.thumbnail_url = "https://mblogthumb-phinf.pstatic.net/MjAxODAzMDNfMjU4/MDAxNTIwMDQxODA4Mjc0.gR3L5xx3IbpACbvRRF9j9xjJmO-EPAY35oF1AdBnDcog.WZyeqFi6cMmH-v-R-ec44Ny6ZgVyAJIYMT78p4Rxbkwg.PNG.osy2201/2_%2850%ED%8D%BC%EC%84%BC%ED%8A%B8_%ED%9A%8C%EC%83%89%29_%ED%9A%8C%EC%83%89_%EB%8B%A8%EC%83%89_%EB%B0%B0%EA%B2%BD%ED%99%94%EB%A9%B4_180303.png?type=w800"
        }
        

        if(menu.thumbnail_url.startsWith("/images/menu/")){
            menu.thumbnail_url = imgUrl+menu.thumbnail_url;
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
                           <p id="price_${menu.id}">${menu.price}원</p>
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

    if(obj.checked==true) {
        if(obj.dataset.oldCount<count) count -= obj.dataset.oldCount;

        orderTotalPrice += price*count;
    }
    else orderTotalPrice -= price*count;

    obj.dataset.oldCount = count;

    $("#totalPrice").html(orderTotalPrice);
}

let changeCount = (checkObj)=> {
    var menuId = checkObj.value;
    var count = $("#count_" + menuId).val();
    
    if(checkObj.checked==true) {
        getOrderTotalPrice(checkObj)
        checkObj.dataset.oldCount = count;
    };
}

let orderCheckMenu = async()=>{
    if(!tokenCheck()) {
        alert("로그인이 필요합니다.");
        window.location.href = "login.html";
    } 
    else{
        var orderTotalPrice = Number($("#totalPrice").text());
        var minumumAmount = Number($("#minimumDeliveryAmount").text());

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

            window.location.href = `order.html?menus=${checkValues.join(',')}&counts=${counts.join(',')}`;
        }

    }
    
}