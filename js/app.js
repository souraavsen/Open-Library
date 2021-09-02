const search = document.getElementById("search");
const input_field = document.getElementById("input_field");

const result = document.getElementById("result");
const card_container = document.getElementById("card_container");

const spinner = document.getElementById("spinner");
const home_img = document.getElementById("home_img");
const not_found = document.getElementById("not_found");

const SpinnerLoader = (condition) => {
  if (condition === true) {
    spinner.style.display = "block";
    home_img.style.display = "none";
    not_found.style.display = "none";
  } else {
    spinner.style.display = "none";
  }
};

search.addEventListener("click", () => {
  const value = input_field.value;

  card_container.textContent = "";
  result.innerText = "";
  SpinnerLoader(true);
  fetch(`https://openlibrary.org/search.json?q=${value}`)
    .then((res) => res.json())
    .then((data) => display(data));
});

const display = (data) => {
  if (data.docs.length !== 0) {
    result.innerText = "Total Number of Books: " + data.docs.length;
    result.style.color = "green";
    result.style.fontWeight = "600";
  } else {
    result.innerText = "Search with valid books name.";
    result.style.color = "red";
    result.style.fontWeight = "600";
    not_found.style.display = "block";
    SpinnerLoader(false);
  }

  const books = data.docs.slice(0, 20);

  books.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("col", "card", "m-0", "shadow");

    let authors_name;
    let publishers_name;
    let book_image;
    let first_publish;

    if (book.publisher !== undefined) {
      if (book.publisher.length > 1) {
        publishers_name = book.publisher.slice(0, 1) + "...";
      } else {
        publishers_name = book.publisher;
      }
    } else {
      publishers_name = "Not Mentioned";
    }

    if (book.cover_i === undefined) {
      book_image = `./images/notfound.png`;
    } else {
      book_image = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    }

    if (book.first_publish_year === undefined) {
      first_publish = `Not Mentioned`;
    } else {
      book.publish_date.forEach((date) => {
        if (date.indexOf(book.first_publish_year.toString()) >= 0) {
          first_publish = date;
        }
      });
    }

    if (book.author_name !== undefined) {
      if (book.author_name.length > 2) {
        authors_name = book.author_name.slice(0, 2) + "...";
      } else {
        authors_name = book.author_name;
      }
    } else {
      authors_name = "Not Mentioned";
    }

    card.innerHTML = `
            <img
              class="card-img-top px-3 pt-3 mx-auto"
              src="${book_image}"
              alt="cover image"
            />
            <div class="card-body">
              <h5 class="fw-bold text-truncate mb-3" style="max-width: 200px;" title="${book.title}">${book.title}</h5>
              <p class="my-2">
                <span>By, </span
                ><i id="author" class="text-info fw-bolder" title="${book.author_name}">${authors_name}</i>
              </p>
              <p class="my-2" title="${book.publisher}">Publisher: <span class="text-success fw_semi">${publishers_name}</span></p>
              <p>First Published: <span class="text-success fw_semi">${first_publish}</span></p>
            </div>`;
    card_container.appendChild(card);
    SpinnerLoader(false);
    input_field.value = "";
  });
};
