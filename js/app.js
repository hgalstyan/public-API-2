let employees = [];
let selectedIndex = 0;
const employeeSearch = document.querySelector('.employee__search');
const modalOverlay = document.querySelector('.modal__overlay');
const modalContainer = document.querySelector('.modal__container');

/////////////////
/// FUNCTIONS ///
/////////////////


const createChildElement = (parentElement, tagName, className, innerHTML) => {
    const createdElement = document.createElement(tagName);
    parentElement.appendChild(createdElement);
    if (className) {
        createdElement.className = className;
    }
    if (innerHTML) {
        createdElement.innerHTML = innerHTML;
    }
    return createdElement;
};


const formatName = function(name) {
    const splitName = name.split(' ');
    let result = [];
    for (let i = 0; i < splitName.length; i++) {
        const word = splitName[i];
        result.push(word[0].toUpperCase() + word.slice(1));
    }
    return result.join(' ');
};

const displayModal = function(member) {
    selectedIndex = employees.indexOf(member);

    const fullName = `${formatName(member.name.first)} ${formatName(member.name.last)}`;
    const employeeAddress = `${formatName(member.location.street)} ${formatName(member.location.city)}, ${formatName(member.location.state)} ${member.location.postcode}`;

    modalOverlay.style = 'display: inline-block';

    let modalContent =
    `<div class="modal__element">
        <div>
            <span class="modal--close">&times;</span>
            <ul class="modal__list">
                <img src="${member.picture.large}" id="modal--image">
                <li id="modal__name">${fullName}</li>
                <li>${member.email}</li>
                <li>${formatName(member.location.city)}</li>
            </ul>
        </div>
        <div>
            <ul class="modal__list2">
                <li>${member.cell}</li>
                <li>${employeeAddress}</li>
                <li>Birthday: ${new Date(member.dob).toLocaleDateString('en-US')}</li>
            </ul>
        </div>
    </div>`;

    modalContainer.innerHTML = modalContent;


    const modalClose = document.querySelector('.modal--close');
    modalClose.addEventListener('click', () => {
        modalOverlay.style = 'display: none';
        $('.modal__element').remove();
    });
};


modalOverlay.addEventListener('click', (e) => {

    if (e.target.className === 'arrowLeft') {
        if (selectedIndex === 0) {
            return displayModal(employees[employees.length - 1]);
        }

        return displayModal(employees[selectedIndex - 1]);
    }
    if (e.target.className === 'arrowRight') {
        if (selectedIndex === employees.length - 1) {
            return displayModal(employees[0]);
        }

        return displayModal(employees[selectedIndex + 1]);
    }
});

/////////////////
//AJAX REQUEST///
/////////////////
$.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=us&inc=name,picture,email,location,cell,dob',
    dataType: 'json',
    success: function(response) {
        employees = response.results;
        
        employees.forEach( (employee)=> {
            const firstName = formatName(employee.name.first);
            const lastName = formatName(employee.name.last);
            const fullName = `${firstName} ${lastName}`;

            const mainContainer = document.querySelector('.main-container');
            const memberContainer = createChildElement(mainContainer, 'ul', 'grid__item');
            memberContainer.onclick = () => displayModal(employee);

            //Container for each member
            let memberContent =
                `<li class="member__img">
                    <img src="${employee.picture.medium}">
                </li>
                <li class="member__info">
                    <ul class="member__item">
                        <li id="name">${fullName}</li>
                        <li id="email">${employee.email}</li>
                        <li id="city">${formatName(employee.location.city)}</li>
                    </ul>
                </li>`;
            memberContainer.innerHTML = memberContent;

            
            employeeSearch.addEventListener('keyup', () => {
                if (fullName.toUpperCase().includes(employeeSearch.value.toUpperCase())) {
                    memberContainer.style = 'display: ""';
                }
                else {
                    memberContainer.style = 'display: none';
                }
            });
        });
    }
});