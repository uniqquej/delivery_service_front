
const url = new URL(window.location.href);
const urlParams = url.searchParams;
const search = urlParams.get('search');
let category = urlParams.get("category");

let lastId=null;
const pageSize = 5;
let isLoading = false;
    
window.onload = ()=>{
    loadStoreList(category,$("#addressSelect").val())
    loginCheck();
}

$("#addressSelect").on("change", function(){
    let category = $("#categorySelect").val();
    loadStoreList(category, $(this).val());
})

$("#categorySelect").on("change", function(){
    let address = $("#addressSelect").val();
    loadStoreList($(this).val(), address);
})

$(document).ready(function(){
    $("#storeListBox").scroll(function(){
        const scrollTop = $(this).scrollTop();

        const scrollHeight = $(this)[0].scrollHeight;

        const clientHeight = $(this).height();

        if (scrollHeight-scrollTop<=(clientHeight+200)) {
            if ($("#storeListBox").find(".storeInfo").length<pageSize) {
                return;
            }
           loadMoreStore(true);
        }
    })
        
  
})

let loadStoreList = async(category, region)=>{

    $("#categorySelect").val(category).prop("selected",true);
    $("#addressSelect").val(region).prop("selected",true);

    let resUrl = `${mainUrl}/open-api/store/search?size=${pageSize}&category=${category}&region=${region}`
    if(search != null){
        resUrl = `${mainUrl}/open-api/store/search?size=${pageSize}&name=${search}&region=${region}`
        if(category!=null) resUrl += `&category=${category}`
    }
    const res = await fetch(resUrl,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })
    
    let resJson = await res.json();
    console.log(resJson)

    if(resJson.body.content.length!=0)
        lastId = resJson.body.content[resJson.body.content.length - 1].id;

    let storeListBox = document.getElementById("storeListBox");
    let storeHtml = '';

    resJson.body.content.forEach(store => {
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

const loadMoreStore = async(check)=>{
    
    let region = $("#addressSelect").val();
    
    if(isLoading) return ;
    
    isLoading = true;
    
    if(check){
        document.getElementById("loading").style.display = 'block';
    }
    let resUrl = `${mainUrl}/open-api/store/search?size=${pageSize}&category=${category}&region=${region}`;
    
    if(lastId != null) 
        resUrl += `&id=${lastId}`;

    try {
        const res = await fetch(resUrl, {
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET'
        });

        const resJson = await res.json();

        if(resJson.body.last)
            lastId = resJson.body.content[resJson.body.content.length - 1].id;

        let storeList = resJson.body.content;
        let storeListBox = $("#storeListBox");

        storeList.forEach(store => {
            if (store.thumbnail_url == "string") {
                store.thumbnail_url = "https://mblogthumb-phinf.pstatic.net/MjAxODAzMDNfMjU4/MDAxNTIwMDQxODA4Mjc0.gR3L5xx3IbpACbvRRF9j9xjJmO-EPAY35oF1AdBnDcog.WZyeqFi6cMmH-v-R-ec44Ny6ZgVyAJIYMT78p4Rxbkwg.PNG.osy2201/2_%2850%ED%8D%BC%EC%84%BC%ED%8A%B8_%ED%9A%8C%EC%83%89%29_%ED%9A%8C%EC%83%89_%EB%8B%A8%EC%83%89_%EB%B0%B0%EA%B2%BD%ED%99%94%EB%A9%B4_180303.png?type=w800";
            }
            let storeDiv = $("<div>").addClass("storeInfo").click(function() {
                location.replace(`storeDetail.html?store=${store.id}&category=${store.category}`);
            });

            let thumbnailDiv = $("<div>").addClass("storeThumbnail");
            let thumbnailImg = $("<img>").attr("src", store.thumbnail_url);
            thumbnailDiv.append(thumbnailImg);

            let infoDiv = $("<div>");
            let storeName = $("<h5>").html(`<b>${store.name}</b>`);
            let starSpan = $("<span>").text(`⭐ ${parseFloat(store.star).toFixed(2)}`);
            let minOrderSpan = $("<span>").text(`최소주문 ${store.minimum_delivery_price}원`);

            infoDiv.append(storeName);
            infoDiv.append(starSpan);
            infoDiv.append("<br>");
            infoDiv.append(minOrderSpan);

            storeDiv.append(thumbnailDiv);
            storeDiv.append(infoDiv);

            storeListBox.append(storeDiv);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        isLoading = false;
        document.getElementById("loading").style.display = 'none';
    }
}