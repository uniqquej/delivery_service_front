let currentPage = 1;
let firstPage = 1, finalPage;

const prevBtn = document.getElementById("prev-button");
prevBtn.addEventListener("click",()=>{
    currentPage -= 1;

    if(currentPage>=firstPage)
        clickPage(currentPage);
    else currentPage += 1;
});

const nextBtn = document.getElementById("next-button");
nextBtn.addEventListener("click",()=>{
    currentPage += 1;

    if(currentPage<=finalPage)
        clickPage(currentPage);
    else currentPage -= 1;
    
});

const loadingPageButton = (startPage, endPage)=>{
    if(endPage<=10) startPage = 1;

    const numberButtonWrapper = document.querySelector('.number-button-wrapper');
    numberButtonWrapper.innerHTML = '';

    let pageCount = startPage+9;
    
    if(pageCount>endPage) pageCount = endPage;
    
    if(startPage+9>=endPage) startPage = endPage-9;
    if(startPage<0) startPage = 1;

    for (let i = startPage; i <= pageCount; i++) {
        numberButtonWrapper.innerHTML += `<span class="number-button" id="pageBtn${i}" onclick="clickPage(${i})"> ${i} </span>`;
    }

    const activeBtn = document.getElementById(`pageBtn${currentPage}`);
    if(!activeBtn.classList.contains("activePage"))
        activeBtn.classList.add("activePage")
}

const loadingOrderPageButton = (startPage, endPage)=>{
    if(endPage<=10) startPage = 1;
    
    const numberButton = document.querySelector('.pagination-container');
    let numberButtonHtml = `<div onclick="clickOrderPrev()">이전</div>
                <div class="number-button-wrapper">`;
    
    let pageCount = startPage+9;
    
    if(pageCount>endPage) pageCount = endPage;
    
    if(startPage+9>=endPage) startPage = endPage-9;
    if(startPage<0) startPage = 1;

    for (let i = startPage; i <= pageCount; i++) {
        numberButtonHtml += `<span class="number-button" id="pageBtn${i}" onclick="clickOrderPage(${i})"> ${i} </span>`;
    }

    numberButtonHtml+=`</div><div onclick = "clickOrderNext()">이후</div>`;
    numberButton.innerHTML = numberButtonHtml;

    const activeBtn = document.getElementById(`pageBtn${currentPage}`);
    if(!activeBtn.classList.contains("activePage"))
        activeBtn.classList.add("activePage")
}