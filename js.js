const imagesWrapper = document.querySelector(".images");
const loadMore = document.querySelector(".load");
const searchBox = document.querySelector(".search_box");
const searchInput = document.querySelector(".search_box input");
const lightbox = document.querySelector(".lightbox");
const closebtn = document.querySelector(".uil-times");
const downloadbtn = document.querySelector(".uil-import");



const apiKey = "GPHfsOElqDvfepNsKQI0LNJ5frt3khhVTNCXUlYx0qNtPGaoVsBwW6gm";
const perPage=15;
let currentPage=1;
let searchTerm=null;

const showLightbox = (name , img) => {
    lightbox.querySelector("img").src=img;
    lightbox.querySelector("span").innerText=name;
    lightbox.classList.add("show");
    downloadbtn.setAttribute("data-img",img);
    document.body.style.overflow = "hidden";
}

const hidelightbox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const downloadImg = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a=document.createElement("a");
        a.href=URL.createObjectURL(file);
        a.download=new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to load images"));
}

const generateHTML = (images) => {
    imagesWrapper.innerHTML +=images.map(img =>
        `<li class="card" onclick="showLightbox('${img.photographer}','${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();"><i class="uil uil-import"></i></button>
        </div>
    </li>`
    ).join("");
}

const getImages = (apiURL) => {
    loadMore.innerText = "Loading...";
    loadMore.classList.add("disabled");
    fetch(apiURL,{
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data =>{
        generateHTML(data.photos);
        loadMore.innerText = "Load More";
        loadMore.classList.remove("disabled");
    }).catch(() => alert("Failed to load images"));
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL=`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (event) => {
    // if(e.target.value === "") return searchTerm = null;
    if(event.which === 13) {
        currentPage=1;
        searchTerm = event.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }

}

// specially made for custom getImage function
const submitButton = () => {
        currentPage=1;
        searchTerm = searchInput.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
}


getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMore.addEventListener("click",loadMoreImages);
searchBox.addEventListener("keypress",loadSearchImages);
closebtn.addEventListener("click",hidelightbox);
downloadbtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));