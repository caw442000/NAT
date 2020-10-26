const CastedVotes =
    localStorage.getItem("votes")?.split(",") ||
    getCookie("votes")?.split(",") ||
    [];

let allowableVotes = 3;
let availableVotesLeft = allowableVotes - CastedVotes.length;
let availableSnackItems = [];

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
    const nodeProduct = document.createTextNode(snack.product);
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

function CreatePlusSVG() {
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

    console.log("svgElem", svgElem);
    return svgElem;
}
const createAvailableItemDiv = (snack, index) => {
    const voteID = `${snack.brand}${snack.id}`;
    console.log("voteID", voteID);
    console.log("index", index + 1);
    const item = document.createElement("div");
    item.setAttribute("id", snack.id);
    item.setAttribute("onclick", `castVote(id)`);

    const plusHolder = document.createElement("div");
    const plusSVG = CreatePlusSVG();

    plusHolder.appendChild(plusSVG);

    const itemContent = document.createElement("div");
    const itemText = document.createElement("h4");
    itemText.classList = "hdg hdg_4 mix-hdg_dark";
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
    selectedItemText.classList = "hdg hdg_4 mix-hdg_dark";
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
    const cards = document.getElementsByClassName("cards");

    //iterate over all snacks
    snacks.map((snack) => {
        cards[0].appendChild(createCardDiv(snack));
    });
};

const appendVotingToDOM = (snacks) => {
    const availableItemsList = document.getElementsByClassName(
        "available-items-list"
    );

    console.log(availableItemsList);

    snacks.map((snack, index) => {
        availableItemsList[0].appendChild(createAvailableItemDiv(snack, index));
    });
};

function removeAllChildNodes(parent) {
    console.log("parent Node", parent);
    console.log("parent firstChild", parent.firstChild);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
const appendSelectionToDom = async () => {
    let selectedItemsList = document.getElementById("selected-items-list");

    await removeAllChildNodes(selectedItemsList);

    const filteredSnacks = availableSnackItems.filter((snack) =>
        CastedVotes.includes(snack.id)
    );

    console.log("castedfilter", CastedVotes);

    console.log("Filtered", filteredSnacks);

    filteredSnacks.map((snack) => {
        selectedItemsList.appendChild(createSelectedItemDiv(snack));
    });
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
        !CastedVotes.includes(`${id}`) &&
        availableVotesLeft > 0 &&
        cookieVotes?.length < allowableVotes
    ) {
        axiosWithAuth()
            .post(`vote/${id}`, id)
            .then((res) => {
                console.log("VoteCast", res);

                const updateID = `${res.data.brand}${res.data.id}`;
                let newVote = res.data.votes;

                console.log("updateID", updateID);

                
                updateVoteLeftCount();
                CastedVotes.push(res.data.id);

                updateVotes(updateID, newVote);

                setCookie("votes", CastedVotes);
                localStorage.setItem("votes", CastedVotes);
                console.log("castedvotes", CastedVotes);
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
        if (availableVotesLeft === 0 || cookieVotes?.length === allowableVotes) {
            alert("You have voted 3 times already");
            //open modal with voted message
            //grab the 3 items and display them in the modal
        } else {
            alert("You have already Cast your Vote For this item");
            //open modal with already casted vote message for grab item and show it with id
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
    console.log("newVogte", newVote);

    const selectedClassArray = [...document.getElementsByClassName(stringID)];

    console.log("array", selectedClassArray);

    selectedClassArray.forEach(function (ele, idx) {
        console.log("element", ele);
        ele.textContent = `${newVote}`;
    });
    console.log("newvotechange", newVote);
};

const updateVoteLeftCount = () => {
    const availableTotal = document.getElementById("available-votes");

    const selectionTalley = document.getElementById("selection-title-count");

    if (availableVotesLeft > 0) {
        availableVotesLeft -= 1;
        availableTotal.textContent = `${availableVotesLeft}`;

    }

    selectionTalley.textContent = `${Math.abs(availableVotesLeft - allowableVotes)}`;
};
const showVotingDown = () => {
    let sysdown = document.getElementById("down");

    // remove snackvoting if system is down
    const votingBody = document.getElementById("voting-bd");
    
    votingBody.remove()
   
    // remove currently in stock text
    const stockText = document.getElementById("stockText");
    stockText.remove()

    sysdown.classList.add("display-down-message");
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

const onSucessLoad = (snacks) => {
    let sysdown = document.getElementById("down");
    sysdown.classList.remove("display-down-message");

    appendSnacksToDOM(voteSort(snacks));
    appendVotingToDOM(voteSort(snacks));
    appendSelectionToDom(brandSort(snacks));

    const availableTotal = document.getElementById("available-votes");
    availableTotal.textContent = `${availableVotesLeft}`;

    const totalItems = document.getElementById("available-items-title-count");
    totalItems.textContent = `${snacks.length}`;

    const selectionTalley = document.getElementById("selection-title-count");
    selectionTalley.textContent = `${Math.abs(availableVotesLeft - allowableVotes)}`;

};

const getSnacks = () => {
    axiosWithAuth()
        .get()
        .then((response) => {
            availableSnackItems = brandSort(response.data);

            // append to DOM on Start
            onSucessLoad(availableSnackItems);
        })
        .catch((error) => {
            console.error(error);
            showVotingDown();
        });
};

getSnacks();
