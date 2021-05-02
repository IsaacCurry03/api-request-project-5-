const randomUsersUrl = "https://randomuser.me/api/?results=12&nat=gb"; //This is the API endpoint used for requesting Random users
const gallery = document.querySelector('.gallery'); //Gallery div is used in many different places so I have have made it a global decloration


let userArray; 
let modalIndex; //This stores the index of the current user we are looking at in the modal
/** 
* This function is a wrapper for the fetch function. It uses "checkFetchStatus" then parses the JSON. It also throws an error on failure
* @param {String} url - The URL to fetch from
* @return {Promise} Returns a promise that resolves to the fetch result
*/
const fetchData = (url) => {
    return fetch(url)
    .then(res => checkFetchStatus(res))
    .then(res => res.json())
    .catch(error => console.error(error));
}
/** 
* Checks a response from a fetch call has the HTTP status of 200. Otherwise it returns a rejected Promise with error
* @param {Promise} response - Promise to check the status of
* @return {Promise} Returns either the successful or rejected promise.
*/
const checkFetchStatus = response => {

    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(response.statusText);
    }
}
/** 
* Creates the gallery based on the users array.
* @param {Array} users - An array that the gallery is based on. This comes from the fetch call.
* @return N/A
*/
const createGallery = users => {

    userArray = users.results;
    
    for(let i = 0; i < userArray.length; i++) { 
        
        const user = userArray[i];

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.addEventListener('click', () => showModal(i));

        const cardImgDiv = document.createElement('div');
        cardImgDiv.className = 'card-img-container';

        const img = document.createElement('img');
        img.className = 'card-img';
        img.src = user.picture.large;
        cardImgDiv.appendChild(img);
        
        cardDiv.appendChild(cardImgDiv);

        const cardInfoDiv = document.createElement('div');
        cardInfoDiv.className = 'card-info-container';

        const nameH3 = document.createElement('h3');
        nameH3.id = 'name';
        nameH3.className = 'card-name cap';
        nameH3.innerText = `${user.name.first} ${user.name.last}`;
        cardInfoDiv.appendChild(nameH3);

        const emailP = document.createElement('p');
        emailP.className = 'card-text';
        emailP.textContent = `${user.email}`;
        cardInfoDiv.appendChild(emailP);

        const locationP = document.createElement('p');
        locationP.className = 'card-text cap';
        locationP.textContent = `${user.location.city}, ${user.location.state}`;
        cardInfoDiv.appendChild(locationP);

        cardDiv.appendChild(cardInfoDiv);

        gallery.appendChild(cardDiv);
   
    };

}
/** 
* Creates the HTML markup for the modal. It is hidden and filled and unhidden later
* @param - N/A
* @return - N/A
*/
const createModal = () => {

    const containerDiv = document.createElement('div');
    containerDiv.className = 'modal-container';

    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.id = 'modal-close-btn';
    closeButton.className = 'modal-close-btn';
    closeButton.innerHTML = '<strong>X</strong>';
    closeButton.addEventListener('click', hideModal);
    modalDiv.appendChild(closeButton);

    const modalInfoDiv = document.createElement('div');
    modalInfoDiv.className = 'modal-info-container';

    const modalImg = document.createElement('img');
    modalImg.className = 'modal-img';
    modalImg.alt = 'profile picture';
    modalInfoDiv.appendChild(modalImg);

    const modalName = document.createElement('h3');
    modalName.id = 'name';
    modalName.className = 'modal-name cap';
    modalInfoDiv.appendChild(modalName);

    const modalEmail = document.createElement('p');
    modalEmail.className = 'modal-text';
    modalInfoDiv.appendChild(modalEmail);

    const modalCity = document.createElement('p');
    modalCity.className = 'modal-text cap';
    modalInfoDiv.appendChild(modalCity);

    const modalHr = document.createElement('hr');
    modalInfoDiv.appendChild(modalHr);

    const modalNumber = document.createElement('p');
    modalNumber.className = 'modal-text';
    modalInfoDiv.appendChild(modalNumber);

    const modalAddress = document.createElement('p');
    modalAddress.className = 'modal-text';
    modalInfoDiv.appendChild(modalAddress);

    const modalBirthday = document.createElement('p');
    modalBirthday.className = 'modal-text';
    modalInfoDiv.appendChild(modalBirthday);

    modalDiv.appendChild(modalInfoDiv);

    const buttonContainerDiv = document.createElement('div');
    buttonContainerDiv.className = 'modal-btn-container';

    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.id = "modal-prev"
    prevButton.className = 'modal-prev btn';
    prevButton.textContent = 'Prev';
    buttonContainerDiv.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.id = "modal-next"
    nextButton.className = 'modal-next btn';
    nextButton.textContent = 'Next';
    buttonContainerDiv.appendChild(nextButton);

    containerDiv.appendChild(modalDiv);
    containerDiv.appendChild(buttonContainerDiv);

    gallery.insertAdjacentElement('afterend', containerDiv);
    hideModal();

}
/** 
* Create the markup for the search box. The submit event listener is added later
* @param - N/A
* @return - N/A
*/
const createSearch = () => {
    const form = document.createElement('form');
    form.action = '#';
    form.method = 'get'

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.id = 'search-input';
    searchInput.classList = 'search-input';
    searchInput.placeholder = 'Search...'
    form.appendChild(searchInput);

    const searchButton = document.createElement('input');
    searchButton.type = 'submit';
    searchButton.value = "🔍";
    searchButton.id = 'search-submit';
    searchButton.classList = 'search-submit';
    form.appendChild(searchButton);

    document.querySelector('div.search-container').appendChild(form);

}
/** 
* Function that performs a search and hides or shows appropiate cards
* @param {Event} e - Event that fired the function. It is used to prevent the defualt form behaviour
* @return - N/A
*/
const performSearch = e => {
    e.preventDefault();
    const searchTerm = document.querySelector('input.search-input').value.toLowerCase(); //Get the search text input and convert it to lower case
    
    const cards = document.querySelectorAll('div.card'); //Get all of the user cards so we can loop over them!
    for(let i = 0; i < cards.length; i++) {
        const card = cards[i]; //Get the current card we are looking
        const name = card.querySelector('div.card-info-container > h3').innerText.toLowerCase(); //Get the name property and convert it to lower case
        
        if(name.includes(searchTerm)) { //see if the name includes the search term. If it does we will show the card otherwise we will hide it
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }

    }
}
/** 
* Show the modal and fill the appropriate properties.
* @param {Number} index - The index of the item we want to show from the userArray
* @return - N/A
*/
const showModal = index => {

    const user = userArray[index];
    modalIndex = index; //Set the current index so we can use it for the next and previous buttons

    //Set the modal properties
    document.querySelector('img.modal-img').src = user.picture.large;
    document.querySelector('h3.modal-name').innerText = `${user.name.first} ${user.name.last}`;
    const modalPElements = document.querySelectorAll('p.modal-text');

    modalPElements[0].innerText = user.email;
    modalPElements[1].innerText = user.location.city;
    modalPElements[2].innerText = user.phone;
    modalPElements[3].innerText = `${user.location.street.number} ${user.location.street.name}, ${user.location.state} ${user.location.postcode}`;
    modalPElements[4].innerText = `Birthday: ${getFormattedDate(new Date(user.dob.date))}`;

    //If statements to see if the next or previus items exist. If not, we will disable the buttons
    if(userArray[index + 1] == null) {
        nextButton.disabled = "true";
    } else {
        nextButton.disabled = "";
    } 

    if(userArray[index - 1] == null) {
        prevButton.disabled = "true";
    } else {
        prevButton.disabled = "";
    } 

    //unhide the modal
    document.querySelector('.modal-container').style.display = '';
}

//Hide the current modal. This is used when the user presses the cross on the modal
const hideModal = () => {
    document.querySelector('.modal-container').style.display = 'none';
}
/** 
* This function takes a date object and returns the date in month/day/year format. Thanks to Ore4444 here: https://stackoverflow.com/a/15764763
* @param {Date} date - A date object to be converted
* @return {String} The date in month/day/year format
*/
const getFormattedDate = date => {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
}

//This function shows the modal with the index one more than the current one (the next item)
const goNext = () => {
    showModal(modalIndex + 1);
}
//This function shows the modal with the index one less than the current one (the previous item)
const goPrev = () => {
    showModal(modalIndex - 1);

}

//Run initial functions!
fetchData(randomUsersUrl)
    .then(createGallery);
createModal();
createSearch();

//Events
document.querySelector('form').addEventListener('submit', e => performSearch(e));

const nextButton = document.querySelector('button#modal-next');
const prevButton = document.querySelector('button#modal-prev');

nextButton.addEventListener('click', () => {goNext()});
prevButton.addEventListener('click', () => {goPrev()});