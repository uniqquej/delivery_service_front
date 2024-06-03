let mainUrl = "http://127.0.0.1:8080";

window.onload = ()=>{
    let category = localStorage.getItem("category")
    loadStoreList(category)
    loginCheck();
}

let loadStoreList = async(category)=>{
    
    const res = await fetch(`${mainUrl}/api/store/search?category=${category}`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })

    let resJson = await res.json();
    console.log(resJson);

    let storeListBox = document.getElementById("storeListBox");
    let storeHtml = '';

    resJson.body.forEach(store => {
        if(store.thumbnail_url=="string"){
            store.thumbnail_url = "https://mblogthumb-phinf.pstatic.net/MjAxODAzMDNfMjU4/MDAxNTIwMDQxODA4Mjc0.gR3L5xx3IbpACbvRRF9j9xjJmO-EPAY35oF1AdBnDcog.WZyeqFi6cMmH-v-R-ec44Ny6ZgVyAJIYMT78p4Rxbkwg.PNG.osy2201/2_%2850%ED%8D%BC%EC%84%BC%ED%8A%B8_%ED%9A%8C%EC%83%89%29_%ED%9A%8C%EC%83%89_%EB%8B%A8%EC%83%89_%EB%B0%B0%EA%B2%BD%ED%99%94%EB%A9%B4_180303.png?type=w800"
        }
        storeHtml += `  <div class="storeInfo" onclick="clickStore(${store.id})">
                            <div class="storeThumbnail">
                                <img src="${store.thumbnail_url}">
                            </div>
                            <div>
                                <h5><b>${store.name}</b></h5>
                                <span>최소주문 ${store.minimum_delivery_amount}원</span>
                            </div>  
                        </div>`
    });

    storeListBox.innerHTML = storeHtml;
}

let clickStore = (storeId) =>{
    localStorage.setItem("storeId",storeId);
    location.replace("storeDetail.html");
}