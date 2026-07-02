let currentIndex=-1,currentPage=1,maxKnownPage=null,touchStartX=0,currentCategory="fire";
const homeView=document.getElementById("homeView"),viewerView=document.getElementById("viewerView"),sopListEl=document.getElementById("sopList"),searchInput=document.getElementById("searchInput"),sopImage=document.getElementById("sopImage"),pageInfo=document.getElementById("pageInfo"),statusEl=document.getElementById("status"),resultCount=document.getElementById("resultCount");
function folderUrl(sop,page){return encodeURI(`PDF/${sop.folder}/${page}.jpg`)}
function openFullPdf(){window.open(encodeURI("PDF/SOP2026.pdf"),"_blank")}
function setCategory(cat,btn){currentCategory=cat;document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderList(searchInput.value)}
function renderList(keyword=""){const key=keyword.replace(/\s/g,"").toLowerCase();sopListEl.innerHTML="";const filtered=SOP_DATA.filter(s=>(currentCategory==="all"||s.category===currentCategory)&&(`${s.no}${s.title}`).replace(/\s/g,"").toLowerCase().includes(key));resultCount.textContent=`${filtered.length}건`;filtered.forEach(s=>{const div=document.createElement("div");div.className="sopItem";div.innerHTML=`<div class="sopText"><b>SOP${s.no}</b> <span>${s.title}</span></div><button onclick="openSopByNo('${s.no}')">보기</button>`;sopListEl.appendChild(div)});if(!filtered.length)sopListEl.innerHTML=`<div class="status">검색 결과가 없습니다.</div>`;renderRecent()}
function openSopByNo(no){const idx=SOP_DATA.findIndex(s=>s.no===no);if(idx<0)return;currentIndex=idx;currentPage=1;maxKnownPage=null;saveRecent(no);showViewer()}
function showViewer(){const sop=SOP_DATA[currentIndex];document.getElementById("viewerNo").textContent=`SOP${sop.no}`;document.getElementById("viewerTitle").textContent=sop.title;homeView.classList.add("hidden");viewerView.classList.remove("hidden");loadPage(currentPage);window.scrollTo(0,0)}
function loadPage(page){const sop=SOP_DATA[currentIndex];statusEl.textContent="불러오는 중...";sopImage.onload=()=>{currentPage=page;statusEl.textContent="";updatePageInfo();precheckNext()};sopImage.onerror=()=>{statusEl.textContent="이미지를 찾을 수 없습니다. 폴더명 또는 파일명(1.jpg)을 확인하세요.";sopImage.removeAttribute("src");if(page>1){maxKnownPage=page-1;currentPage=maxKnownPage;loadPage(currentPage)}};sopImage.src=folderUrl(sop,page)}
function updatePageInfo(){pageInfo.textContent=maxKnownPage?`${currentPage} / ${maxKnownPage}`:`${currentPage}`}
function precheckNext(){if(maxKnownPage&&currentPage>=maxKnownPage)return;const sop=SOP_DATA[currentIndex];const test=new Image();test.onload=()=>{if(!maxKnownPage)pageInfo.textContent=`${currentPage} / ...`};test.onerror=()=>{maxKnownPage=currentPage;updatePageInfo()};test.src=folderUrl(sop,currentPage+1)}
function nextPage(){if(maxKnownPage&&currentPage>=maxKnownPage)return;loadPage(currentPage+1)}
function prevPage(){if(currentPage<=1)return;loadPage(currentPage-1)}
function nextSop(){if(currentIndex<SOP_DATA.length-1){currentIndex++;currentPage=1;maxKnownPage=null;saveRecent(SOP_DATA[currentIndex].no);showViewer()}}
function prevSop(){if(currentIndex>0){currentIndex--;currentPage=1;maxKnownPage=null;saveRecent(SOP_DATA[currentIndex].no);showViewer()}}
function backHome(){viewerView.classList.add("hidden");homeView.classList.remove("hidden");renderList(searchInput.value);window.scrollTo(0,0)}
function openCurrentImage(){if(sopImage.src)window.open(sopImage.src,"_blank")}
function saveRecent(no){let arr=JSON.parse(localStorage.getItem("recentSop")||"[]");arr=arr.filter(x=>x!==no);arr.unshift(no);localStorage.setItem("recentSop",JSON.stringify(arr.slice(0,6)))}
function renderRecent(){const box=document.getElementById("recentBox"),list=document.getElementById("recentList");let arr=JSON.parse(localStorage.getItem("recentSop")||"[]");if(!arr.length){box.classList.add("hidden");return}box.classList.remove("hidden");list.innerHTML="";arr.forEach(no=>{const s=SOP_DATA.find(x=>x.no===no);if(s){const b=document.createElement("button");b.textContent=`SOP${s.no}`;b.onclick=()=>openSopByNo(s.no);list.appendChild(b)}})}
searchInput.addEventListener("input",e=>renderList(e.target.value));
document.addEventListener("keydown",e=>{if(viewerView.classList.contains("hidden"))return;if(e.key==="ArrowRight")nextPage();if(e.key==="ArrowLeft")prevPage();if(e.key==="Escape")backHome()});
sopImage.addEventListener("touchstart",e=>{touchStartX=e.changedTouches[0].screenX});
sopImage.addEventListener("touchend",e=>{const endX=e.changedTouches[0].screenX;if(touchStartX-endX>50)nextPage();if(endX-touchStartX>50)prevPage()});
renderList();
