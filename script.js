const CastedVotes = [];
let availableVotesLeft = 1;

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
    const cards = document.getElementsByClassName("cards");

    //iterate over all snacks
    snacks.map((snack) => {
        cards[0].appendChild(createCardDiv(snack));
    });
};

const appendVotingToDOM = () => {
    const siteBody = document.getElementsByClassName("site-bd");

    console.log(siteBody);

    const votingSection = document.createElement("div");
    votingSection.classList = "voting-bd";

    siteBody[0].appendChild(votingSection);
};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}
const castVote = (id) => {
    console.log("id passed", id);
    let cookieVotes = [];

    console.log("before", CastedVotes);
    console.log("getCookie", getCookie("votes"));
    if (getCookie("votes")) {
        cookieVotes = getCookie("votes")?.split(",");
        console.log("cookieVotes", cookieVotes);
    }

    if (
        (!CastedVotes.includes(`${id}`) && availableVotesLeft > 0) ||
        cookieVotes?.length < 3
    ) {
        axios
            .post(`http://localhost:3000/snacks/vote/${id}`, id, {
                headers: {
                    Authorization:
                        "Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827",
                },
            })
            .then((res) => {
                console.log("VoteCast", res);

                const updateID = `${res.data.brand}${res.data.id}`;
                let newVote = res.data.votes;

                console.log("updateID", updateID);

                updateVotes(updateID, newVote);
                availableVotes();
                CastedVotes.push(res.data.id);
                setCookie("votes", CastedVotes);
                console.log("castedvotes", CastedVotes);
            })
            .catch((error) => console.error(error));
    } else {
        if (availableVotesLeft === 0 || cookieVotes?.length === 3) {
            alert("You have voted 3 times already");
        } else {
            alert("You have already Cast your Vote For this item");
        }
    }
};

function setCookie(name, value) {
    let now = new Date();
    let exdays =
        daysInMonth(now.getMonth() + 1, now.getFullYear()) - now.getDate();

    now.setTime(now.getTime() + exdays * 24 * 60 * 60 * 1000);
    now.setHours(23, 59, 59, 0);
    var expires = "expires=" + now.toGMTString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function daysInMonth(month, year) {
    // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
}

const updateVotes = (id, newVote) => {
    stringID = id.toString();

    console.log("id in updateVotes", id);
    console.log("newVog=te", newVote);

    const arrayClass = [...document.getElementsByClassName(stringID)];

    console.log("array", arrayClass);

    arrayClass.forEach(function (ele, idx) {
        console.log("element", ele);
        ele.textContent = `${newVote}`;
    });
    console.log("newvotechange", newVote);
    // let now = new Date();
    // let exdays = daysInMonth(now.getMonth()+ 1, now.getFullYear()) - now.getDate()
    // console.log("this is d", now);
    // console.log("this is d month", now.getMonth());
    // console.log("this is d year", now.getFullYear());
    // console.log("this is d year", now.getDate());
    // console.log("this is exdays", exdays)
};

const availableVotes = () => {
    const arrayClass = [...document.getElementsByClassName("available-votes")];

    console.log("array of available votes", arrayClass);

    arrayClass.forEach(function (ele, idx) {
        let temp = ele.textContent;
        console.log("temp", temp);

        if (temp > 0) {
            availableVotesLeft = temp - 1;
            ele.textContent = `${availableVotesLeft}`;

            console.log(availableVotesLeft);
        }
    });
};
const showVotingDown = () => {
    let sysdown = document.getElementById("down");
    console.log("this is sysdown", sysdown);

    sysdown.classList.add("display-down-message");
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

            let sysdown = document.getElementById("down");
            sysdown.classList.remove("display-down-message");


            let voteSorted = snacks.sort((a, b) => {
                return b.votes - a.votes;
            });

            let brandSorted = snacks.sort((a, b) => {
                return b.brand - a.brand;
            });

            console.log("vote", voteSorted);
            console.log(response.data);
            // append to DOM
            appendSnacksToDOM(voteSorted);
            // appendVotingToDOM(brandSorted)
        })
        .catch((error) => {
            console.error(error);
            showVotingDown();
        });
};

getSnacks();
