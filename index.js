import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://endorsements-9cac4-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);

const database = getDatabase(app);

const postsInDB = ref(database, "Posts");

const endorSection = document.getElementById("endorsements-section");
const textField = document.getElementById("text-field");
const inputFrom = document.getElementById("input-from");
const inputTo = document.getElementById("input-to");
const publishBtn = document.getElementById("publish-btn");
let likeIconToggle = "fa-regular";

onValue(postsInDB, function (snapshot) {
  if (snapshot.exists()) {
    clearEndorsementSec();
    const allPostsArray = Object.entries(snapshot.val());
    for (let i = 0; i < allPostsArray.length; i++) {
      const currentPost = allPostsArray[i];
      addPost(currentPost);
    }
  } else {
    let alertDiv = document.createElement("h4");
    alertDiv.textContent = `There are no endorsements yet...`;
    endorSection.append(alertDiv);
  }
});

publishBtn.addEventListener("click", () => {
  let textFieldValue = textField.value;
  let inputFromValue = inputFrom.value;
  let inputToValue = inputTo.value;

  let postObj = {
    from: `${inputFromValue}`,
    to: `${inputToValue}`,
    endorsement: `${textFieldValue}`,
    likes: 0,
    isliked: false,
  };
  if (inputFromValue && inputToValue && textFieldValue) {
    push(postsInDB, postObj);
  } else {
    alert("Please fill in all fields");
  }
  clearAllField();
});
function clearAllField() {
  textField.value = "";
  inputFrom.value = "";
  inputTo.value = "";
}

function clearEndorsementSec() {
  endorSection.innerHTML = "";
}

function addPost(post) {
  let postKey = post[0];
  let postValue = post[1];

  feedHtml(postKey, postValue, likeIconToggle);
  let likeBtn = document.getElementById(`like-${postKey}`);
  likeBtn.addEventListener("click", () => {
    postValue.isliked = !postValue.isliked;
    if (postValue.isliked) {
      postValue.likes++;
    } else {
      postValue.likes--;
    }
    set(ref(database, `Posts/${postKey}`), {
      from: `${postValue.from}`,
      to: `${postValue.to}`,
      endorsement: `${postValue.endorsement}`,
      likes: postValue.likes,
      isliked: postValue.isliked,
    });
  });
}

function feedHtml(postKey, postValue, likeIconToggle) {
  let postHtml = document.createElement("div");
  if (postValue.isliked) {
    likeIconToggle = "fa-solid";
  } else {
    likeIconToggle = "fa-regular";
  }

  postHtml.classList.add("endorsement");
  postHtml.setAttribute("id", `post-${postKey}`);
  postHtml.innerHTML = `<h3>To ${postValue.to}</h3>
    <p> ${postValue.endorsement} </p>
    <div class="endorsement-container">
      <h3>From ${postValue.from}</h3>
      <p style="color: #ad1515">
        <i class="${likeIconToggle} fa-heart likeIcon" id="like-${postKey}"></i>
        <b>${postValue.likes}</b>
      </p>
    </div>`;

  endorSection.append(postHtml);
}
