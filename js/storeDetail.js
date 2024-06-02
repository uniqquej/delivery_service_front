let mainUrl = "http://127.0.0.1:8080";

window.onload = ()=>{
    let storeId = localStorage.getItem("storeId");
    loadStoreInfo(storeId);
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
                                <h5>${store.name}</h5>
                                <span>${store.phone_number}</span>
                                <span>${store.address}</span>
                                <span>${store.star}</span>
                                <span><b>최소주문</b> ${store.minimum_delivery_amount} 원</span>
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
                            <input class="form-check-input" type="checkbox" value="${menu.id}">
                       </div>
                       <div class="menuThumbnail">
                           <img src="${menu.thumbnail_url}">
                       </div>
                       <div>
                           <h5>${menu.name}</h5>
                           <p>${menu.amount}원</p>
                           <p>like ${menu.like_count}</p>
                       </div>  
                   </div>
                   `
    })

    menuListBox.innerHTML = menuListHtml;





}