const CastedVotes = []

const createCardDiv = (snack) => {
  const voteID = `${snack.brand}${snack.id}`;
  const card = document.createElement("div");
  card.classList = "card";

  const cardBody = document.createElement("div");
  cardBody.classList = "card-body card-shadow";

  const cardTriangle = document.createElement("div");
  cardTriangle.classList = "card-corner-triangle";

  const cardTriangleText = document.createElement("p");
  cardTriangleText.classList = `card-corner-triangle-text hdg hdg_5 ${voteID} `;
  cardTriangleText.setAttribute("id", voteID);

  const cardText = document.createElement("div");
  cardText.classList = "card-text";

  const cardTextProduct = document.createElement("h4");
  cardTextProduct.classList = "hdg hdg_4";

  const cardTextBrand = document.createElement("p");
  cardTextBrand.classList = "card-text-brand hdg";

  let node = document.createTextNode(snack.votes);
  let nodeBrand = document.createTextNode(snack.brand);
  let nodeProduct = document.createTextNode(snack.product);

  const cardImg = document.createElement("img");
  cardImg.classList = "card-image";
  console.log(snack.image);
  cardImg.src = snack.image;

  cardTextProduct.appendChild(nodeProduct);
  cardTextBrand.appendChild(nodeBrand);
  cardText.appendChild(cardTextProduct);
  cardText.appendChild(cardTextBrand);

  cardTriangle.appendChild(cardTriangleText);
  cardTriangleText.appendChild(node);
  cardBody.appendChild(cardTriangle);
  cardBody.appendChild(cardImg);
  card.appendChild(cardBody);
  card.appendChild(cardText);

  return card;
};

const appendSnacksToDOM = (snacks) => {
  const snackSection = document.getElementsByClassName("stockedBanner");

  console.log(snackSection);

  const cards = document.createElement("div");
  cards.classList = "cards";

  snackSection[0].appendChild(cards);

  //iterate over all snacks
  snacks.map((snack) => {
    cards.appendChild(createCardDiv(snack));
  });
};

const appendVotingToDOM = () => {
  const siteBody = document.getElementsByClassName("site-bd");

  console.log(siteBody);

  const votingSection = document.createElement("div");
  votingSection.classList = "voting-bd";

  siteBody[0].appendChild(votingSection);
};

const castVote = (id) => {
  console.log("id passed", id);

  console.log("before", CastedVotes)


  if(!CastedVotes.includes(`${id}`)) {



  

  axios
    .post(`http://localhost:3000/snacks/vote/${id}`, id, {
      headers: {
        Authorization: "Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827",
      },
    })
    .then((res) => {
      console.log("VoteCast", res);

      const updateID = `${res.data.brand}${res.data.id}`;
      let newVote = res.data.votes;

      console.log("updateID", updateID);

      updateVotes(updateID, newVote);
      availableVotes();
      CastedVotes.push(res.data.id)

      console.log("castedvotes", CastedVotes)
    })
    .catch((error) => console.error(error));

  }
};

const updateVotes = (id, newVote) => {
  stringID = id.toString();

  console.log("id in updateVotes", id);
  console.log("newVog=te", newVote);

  const arrayClass = [...document.getElementsByClassName(stringID)];

  console.log("array", arrayClass);

  arrayClass.forEach(function (ele, idx) {
    ele.innerText = newVote;
  });
  console.log("newvotechange", newVote);
};

const availableVotes = () => {
  const arrayClass = [...document.getElementsByClassName("available-votes")];

  console.log("array of available votes", arrayClass);


  arrayClass.forEach(function (ele, idx) {
    let temp = ele.innerText;
    console.log("temp", temp);

    if (temp > 0) {
      ele.innerText = temp - 1;
    }

  });



};

const getSnacks = () => {
  axios
    .get("http://localhost:3000/snacks", {
      headers: {
        Authorization: "Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827",
      },
    })
    .then((response) => {
      const snacks = response.data;

      votesorted = snacks.sort((a, b) => {
        return b.votes - a.votes;
      });

      console.log("vote", votesorted);
      console.log(response.data);
      // append to DOM
      appendSnacksToDOM(votesorted);
      // appendVotingToDOM()
    })
    .catch((error) => console.error(error));
};

getSnacks();
