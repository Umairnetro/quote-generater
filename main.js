const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const generatebtn = document.querySelector(".generate-btn");
const favoritebtn = document.querySelector(".favorite-btn");
const toast = document.querySelector(".toast");

// stop -- i want to stop excution here
console.log(toast);


let currentQuote = null;
let array = JSON.parse(localStorage.getItem("quotes")) || [];

let api = "https://dummyjson.com/quotes";

const showMessage = (msge) => {
  toast.innerHTML = msge;
  toast.classList.add("invisible");
  setTimeout(() => {
    toast.classList.remove("invisible");
  }, 2000);
};

// generate random number for showing random quote
const randomQuote = (quoteArr) => {
  const random = Math.floor(Math.random() * quoteArr.quotes.length);
  return random;
};

// generate and display quote
const generateQuote = async (url) => {
  try {
    const fetchApi = await fetch(url);

    if (!fetchApi.ok) {
      return console.error("there is problem in api while fetching.");
    }

    const data = await fetchApi.json();
    const random = randomQuote(data);

    currentQuote = data.quotes[random];

    quote.innerHTML = `${data.quotes[random].quote}`;
    author.innerHTML = `~${data.quotes[random].author}`;

    iconsControl(favoritebtn, "fa-solid", "fa-regular");
  } catch (error) {
    console.error("there is error in generateQuote", error);
  }
};

// icons control
const iconsControl = (ele, oldClass, newClass) => {
  ele.children[0].classList.replace(oldClass, newClass);
};

// save favorite quote in localstorage
const saveToLocalStorage = () => {
  iconsControl(favoritebtn, "fa-regular", "fa-solid");

  if (currentQuote == null) {
    return showMessage("there is no quote to save, please generate first");
  }

  console.log({ array, c: currentQuote.id });

  const isDublicate = array.some((i) => {
    return i.quote === currentQuote.quote && i.author === currentQuote.author;
  });

  if (isDublicate) {
    return showMessage("this quote is already in your favorite list");
  }

  showMessage("Add to favorite!!");

  array.push(currentQuote);
  localStorage.setItem("quotes", JSON.stringify(array));
};

const clipBoard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error.message);
  }
};

setTimeout(() => {
  clipBoard("Copy");
}, 2000);

// generate quote on click
generatebtn.addEventListener("click", () => {
  generateQuote(api);
});

// save quote to localstorage on click
favoritebtn.addEventListener("click", () => {
  saveToLocalStorage();
});

generateQuote(api);
