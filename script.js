// Declare Global
const CastedVotes = getCookie("votes")?.split(",") ||
    [];
let allowableVotes = 3;
let availableVotesLeft = allowableVotes - CastedVotes.length;
let availableSnackItems = [];

// Generates dynamic card
const createCardDiv = (snack) => {
    const voteID = `${snack.brand}${snack.id}`;

    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const cardTriangle = document.createElement("div");
    const cardTriangleText = document.createElement("p");
    const cardText = document.createElement("div");
    const cardTextProduct = document.createElement("h4");
    const cardTextBrand = document.createElement("p");
    const node = document.createTextNode(snack.votes);
    const nodeBrand = document.createTextNode(snack.brand);

    //Shortens the product name
    const nodeProduct = document.createTextNode(
        `${snack.product.substr(0, 18)}...`
    );
    const cardImg = document.createElement("img");

    cardImg.src = snack.image;

    card.classList = "card";
    cardBody.classList = "card-body card-shadow";
    cardTriangle.classList = "card-corner-triangle";
    cardTriangleText.classList = `card-corner-triangle-text hdg hdg_5 ${voteID} `;
    cardText.classList = "card-text";
    cardTextProduct.classList = "hdg hdg_4";
    cardTextBrand.classList = "card-text-brand hdg";
    cardImg.classList = "card-image";

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

const CreatePlusSVG = () => {
    let xmlns = "http://www.w3.org/2000/svg";
    let boxWidth = 16;
    let boxHeight = 16;

    let svgElem = document.createElementNS(xmlns, "svg");

    svgElem.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    svgElem.setAttributeNS(null, "version", "1.1");
    svgElem.setAttributeNS(null, "id", "Layer_1");
    svgElem.setAttributeNS(null, "x", "0px");
    svgElem.setAttributeNS(null, "y", "0px");
    svgElem.setAttributeNS(
        null,
        "viewBox",
        "0 0 " + boxWidth + " " + boxHeight
    );
    svgElem.setAttributeNS(null, "enable-background", "new 0 0 16 16");
    svgElem.setAttribute("xml:space", "preserve");

    let poly = document.createElementNS(xmlns, "polygon");
    poly.setAttributeNS(null, "fill", "#FFFFFF");
    poly.setAttributeNS(
        null,
        "points",
        "16,6 10,6 10,0 6,0 6,6 0,6 0,10 6,10 6,16 10,16 10,10 16,10 "
    );
    svgElem.appendChild(poly);

    return svgElem;
};
const createAvailableItemDiv = (snack, index) => {
    const voteID = `${snack.brand}${snack.id}`;
    const item = document.createElement("div");
    item.setAttribute("id", snack.id);
    item.setAttribute("onclick", `castVote(id)`);

    const plusHolder = document.createElement("div");
    const plusSVG = CreatePlusSVG();

    plusHolder.appendChild(plusSVG);

    const itemContent = document.createElement("div");
    const itemText = document.createElement("h4");
    itemText.classList = "item-content-text mix-hdg_dark";

    const itemVotes = document.createElement("p");

    if ((index + 1) % 2 === 0) {
        item.classList = "list-item-odd";
        plusHolder.classList = "plus-odd";
        itemContent.classList = "item-content-odd";
    } else {
        item.classList = "list-item-even";
        plusHolder.classList = "plus-even";
        itemContent.classList = "item-content-even";
    }
    itemVotes.classList = `item-content-votes mix-hdg_dark ${voteID}`;

    let nodeItemVotes = document.createTextNode(snack.votes);
    let nodeItemText = document.createTextNode(
        `${snack.brand} ${snack.product}`
    );

    itemText.appendChild(nodeItemText);
    itemVotes.appendChild(nodeItemVotes);
    itemContent.appendChild(itemText);
    itemContent.appendChild(itemVotes);
    item.appendChild(plusHolder);
    item.appendChild(itemContent);

    return item;
};

const createSelectedItemDiv = (snack) => {
    const voteID = `${snack.brand}${snack.id}`;
    console.log("voteID", voteID);
    const selectedItem = document.createElement("div");
    selectedItem.setAttribute("id", snack.id);
    selectedItem.classList = "selected-item";

    const selectedItemText = document.createElement("h4");
    selectedItemText.classList = "selected-item-text hdg mix-hdg_dark";
    const selectedItemVotes = document.createElement("p");
    selectedItemVotes.classList = `selected-item-votes hdg hdg_5 mix-hdg_dark ${voteID}`;

    let nodeSelectedVotes = document.createTextNode(snack.votes);
    let nodeSelectedText = document.createTextNode(
        `${snack.brand} ${snack.product}`
    );

    selectedItemText.appendChild(nodeSelectedText);
    selectedItemVotes.appendChild(nodeSelectedVotes);
    selectedItem.appendChild(selectedItemText);
    selectedItem.appendChild(selectedItemVotes);

    return selectedItem;
};

const appendSnacksToDOM = (snacks) => {
    const [cards] = document.getElementsByClassName(
        "stockedSection-content-bd"
    );

    //iterate over all snacks
    snacks.map((snack) => {
        cards.appendChild(createCardDiv(snack));
    });
};

const appendVotingToDOM = (snacks) => {
    const [availableItemsList] = document.getElementsByClassName(
        "available-items-list"
    );

    snacks.map((snack, index) => {
        availableItemsList.appendChild(createAvailableItemDiv(snack, index));
    });
};

const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
const appendSelectionToDom = async () => {
    let selectedItemsList = document.getElementById("js-selected-items-list");

    await removeAllChildNodes(selectedItemsList);

    const filteredSnacks = availableSnackItems.filter((snack) =>
        CastedVotes.includes(snack.id)
    );

    filteredSnacks.map((snack) => {
        selectedItemsList.appendChild(createSelectedItemDiv(snack));
    });
};

function getCookie(name){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

const castVote = (id) => {
   
    let cookieVotes = [];

    if (getCookie("votes")) {
        cookieVotes = getCookie("votes")?.split(",");
    }

    if (
        !CastedVotes.includes(`${id}`) &&
        availableVotesLeft > 0 &&
        cookieVotes?.length < allowableVotes
    ) {
        axiosWithAuth()
            .post(`vote/${id}`, id)
            .then((res) => {
                const updateID = `${res.data.brand}${res.data.id}`;
                let newVote = res.data.votes;

                updateVoteLeftCount();
                CastedVotes.push(res.data.id);
                updateVotes(updateID, newVote);
                setCookie("votes", CastedVotes);

                axiosWithAuth()
                    .get()
                    .then((response) => {
                        availableSnackItems = brandSort(response.data);
                        appendSelectionToDom();
                    })
                    .catch((error) => {
                        console.error(error);
                        showVotingDown();
                    });
            })
            .catch((error) => console.error(error));
    } else {
        if (
            availableVotesLeft === 0 ||
            cookieVotes?.length === allowableVotes
        ) {
            displayModal("js-modalLimitReached");
        } else {
            displayModal("js-modalPrevSelected");
        }
    }
};

// Modal for alerts about votes
const displayModal = (alert) => {
    let modal = document.getElementById(`${alert}`);
    console.log("this is alert", alert);

    console.log("this is modal", modal);

    // Get the <span> element that closes the modal
    let span = document.getElementById(`${alert}-close`);

    modal.style.display = "block";

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
};

// Cookies to track disable voting after 3 votes
function setCookie(name, value) {
    let now = new Date();
    let exdays =
        daysInMonth(now.getMonth() + 1, now.getFullYear()) - now.getDate();

    now.setTime(now.getTime() + exdays * 24 * 60 * 60 * 1000);
    now.setHours(23, 59, 59, 0);

    let expires = `expires=${now.toGMTString()}`;

    // document.cookie = name + '=' + value + ';' + expires + ';path=/';
    document.cookie = `${name}=${value};${expires};path=/`;
}

function daysInMonth(month, year) {
    // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
}

const updateVotes = (id, newVote) => {
    const changeVote = document.getElementsByClassName(`${id}`);

    const changeVoteArray = Array.from(changeVote);

    changeVoteArray.forEach((ele) => {
        ele.textContent = `${newVote}`;
    });
};

const updateVoteLeftCount = () => {
    const availableTotal = document.getElementById("js-available-votes");
    const selectionTalley = document.getElementById("js-selection-title-count");

    if (availableVotesLeft > 0) {
        availableVotesLeft -= 1;
        availableTotal.textContent = `${availableVotesLeft}`;
    }

    selectionTalley.textContent = `${Math.abs(
        availableVotesLeft - allowableVotes
    )}`;
};
const showVotingDown = () => {
    let sysdown = document.getElementById("js-stockedSection-content-down");

    // remove snackvoting if system is down
    const votingBody = document.getElementById("js-votingSection");
    votingBody.remove();

    // remove currently in stock text
    const stockedText = document.getElementById("js-stockedSection-content-hd");
    stockedText.remove();

    sysdown.classList.add("stockedSection-content-down-copy");
};

const axiosWithAuth = () => {
    return axios.create({
        baseURL: "http://localhost:3000/snacks",
        headers: {
            Authorization: "Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827",
        },
    });
};

const brandSort = (snacks) => {
    let brandSorted = snacks.slice().sort((a, b) => {
        if (a.brand < b.brand) {
            return -1;
        }
        if (a.brand > b.brand) {
            return 1;
        }
        return 0;
    });

    return brandSorted;
};

const voteSort = (snacks) => {
    const voteSorted = snacks.slice().sort((a, b) => {
        if (a.votes < b.votes) {
            return 1;
        }
        if (a.votes > b.votes) {
            return -1;
        }
        return 0;
    });
    return voteSorted;
};

const onSucessLoad = async (snacks) => {
    let sysdown = document.getElementById("js-stockedSection-content-down");
    sysdown.classList.remove("stockedSection-content-down-copy");

    appendSnacksToDOM(voteSort(snacks));
    appendVotingToDOM(voteSort(snacks));
    appendSelectionToDom(brandSort(snacks));

    const availableTotal = document.getElementById("js-available-votes");
    const totalItems = document.getElementById("js-available-items-title-count");
    const selectionTalley = document.getElementById("js-selection-title-count");
    
    availableTotal.textContent = `${availableVotesLeft}`;
    totalItems.textContent = `${snacks.length}`;
    selectionTalley.textContent = `${Math.abs(
        availableVotesLeft - allowableVotes
    )}`;


};

const getSnacks = () => {
    axiosWithAuth()
        .get()
        .then((response) => {
            availableSnackItems = response.data;
            onSucessLoad(availableSnackItems);
        })
        .catch((error) => {
            console.error(error);
            showVotingDown();
        });
};

getSnacks();
