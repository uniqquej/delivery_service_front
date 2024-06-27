
const url = new URL(window.location.href);
const urlParams = url.searchParams;
const search = urlParams.get('search');
const category = urlParams.get("category");
    
window.onload = ()=>{
    loadStoreList(category,$("#addressSelect").val())
    loginCheck();
}

$("#addressSelect").on("change", function(){
    let selecCategory = $("#categorySelect").val();
    loadStoreList(selecCategory, $(this).val());
})

$("#categorySelect").on("change", function(){
    let address = $("#addressSelect").val();
    loadStoreList($(this).val(), address);
})

let loadStoreList = async(category, region)=>{
    console.log(region)
    $("#categorySelect").val(category).prop("selected",true);
    $("#addressSelect").val(region).prop("selected",true);

    let resUrl = `${mainUrl}/open-api/store/search?category=${category}&region=${region}`
    if(search != null){
        resUrl = `${mainUrl}/open-api/store/search?name=${search}`
    }
    const res = await fetch(resUrl,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })
    

    let resJson = await res.json();

    let storeListBox = document.getElementById("storeListBox");
    let storeHtml = '';

    resJson.body.forEach(store => {
        if(store.thumbnail_url=="string"){
            store.thumbnail_url = "https://mblogthumb-phinf.pstatic.net/MjAxODAzMDNfMjU4/MDAxNTIwMDQxODA4Mjc0.gR3L5xx3IbpACbvRRF9j9xjJmO-EPAY35oF1AdBnDcog.WZyeqFi6cMmH-v-R-ec44Ny6ZgVyAJIYMT78p4Rxbkwg.PNG.osy2201/2_%2850%ED%8D%BC%EC%84%BC%ED%8A%B8_%ED%9A%8C%EC%83%89%29_%ED%9A%8C%EC%83%89_%EB%8B%A8%EC%83%89_%EB%B0%B0%EA%B2%BD%ED%99%94%EB%A9%B4_180303.png?type=w800"
        }
        storeHtml += `  <div class="storeInfo" onclick="location.replace('storeDetail.html?store=${store.id}&category=${store.category}')">
                            <div class="storeThumbnail">
                                <img src="${store.thumbnail_url}">
                            </div>
                            <div>
                                <h5><b>${store.name}</b></h5>
                                <span>⭐ ${parseFloat(store.star).toFixed(2)} </span><br>
                                <span>최소주문 ${store.minimum_delivery_price}원</span>
                            </div>  
                        </div>`
    });

    storeListBox.innerHTML = storeHtml;
}