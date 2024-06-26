const url = new URL(window.location.href);
const urlParams = url.searchParams;
const menuIds = urlParams.get('menus');
const counts = urlParams.get('counts').split(',');
let storeId;

window.onload=()=>{
    loginCheck();
    getUserAddress();
    loadMenu();
}

const getUserAddress = async ()=>{
    const res = await fetch(`${mainUrl}/api/user/me`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })
    let resJson = await res.json();

    if(2000<= resJson.result.result_code & resJson.result.result_code<= 2003){
        alert("로그인을 해주세요");
        window.location.href="login.html";
    }
    

    const addressInput = document.getElementById("addressInput");
    addressInput.value = resJson.body.address;
}

const loadMenu = async ()=>{
    const res = await fetch(`${mainUrl}/api/store-menu?menus=${menuIds}`,{
        headers:{
            'content-type':'application/json',
            'authorization':localStorage.getItem("access")
        },
        method: 'GET'
    })
    let resJson = await res.json();
    storeId = resJson.body[0].store_id;

    let totalPrice = 0;

    const orderCheck = document.getElementById("orderCheck");
    let orderInfoHtml = ``;

    resJson.body.forEach((menu, idx) => {
        orderInfoHtml += `
        <div>
            <span>${menu.name} x ${counts[idx]} : </span>
            <span>${menu.price * Number(counts[idx])} 원</span>
        </div> 
        `
        totalPrice += (menu.price * Number(counts[idx]));
    });

    orderInfoHtml += `<p>총 합계 : ${totalPrice} 원</p>`
    orderCheck.innerHTML = orderInfoHtml;
}


const order = async()=>{
    let countList = counts.map(count=> parseInt(count));
    let menuList = menuIds.split(',').map(menuId=> parseInt(menuId));
    const address = document.getElementById("addressInput").value;

    let data = JSON.stringify({
        'result':{
            "result_code": 200,
            "result_message": "success",
            "result_description": "order success"
        },
        'body':{
            "store_menu_id_list" : menuList,
            "count_list": countList,
            "store_id": storeId,
            "address" : address

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
    
    if(resJson.result.result_code==200){
        if(resJson.body.status=="ORDER"){
            alert("주문 완료");
            location.replace("orderList.html");
        } else{
            alert("주문이 완료되지 않았습니다.");
            location.reload();
        }
    }else{
        alert("주문이 완료되지 않았습니다.")
        location.reload()
    }

    
    
}

const canceledOrder = () =>{
    if(confirm("주문을 취소하겠습니까?")) window.location.href = `storeDetail.html?store=${storeId}`;
} 