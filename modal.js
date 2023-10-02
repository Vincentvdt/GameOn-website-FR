// Function to toggle header responsiveness
const editNav = () => {
    const x = document.getElementById("myTopnav");
    x.className === "topnav" ? x.className += " responsive" : x.className = "topnav";
};

// DOM Elements
const modalbg = document.querySelector(".bground");
const modal = document.querySelector(".content");
const modalCloseBtn = modal.querySelector(".modal-close");
const modalBtn = document.querySelectorAll(".modal-btn");
const inputsWrapper = document.querySelectorAll(".formInput");
const form = document.querySelector(".modalForm");
const heroBanner = document.querySelector(".hero-section");

// Open the modal with animatino
const openModal = () => {
    modalbg.style.display = "block"
    modal.animate({
        opacity: [0, 1], transform: ["translateY(150px)", "translateX(0)"],
    }, {
        // temporisation
        duration: 400, iterations: 1, easing: "cubic-bezier(.35,.43,.18,1.54)",
    },);

    // Hide the hero banner on smaller screens
    if (innerWidth <= 500 && heroBanner.style.display !== "none") {
        heroBanner.style.display = "none"
    }
};

// Close the modal with animation
const closeModal = () => {
    setTimeout(() => {
        modalbg.style.display = "none"
    }, 390);
    modal.animate(// étapes/keyframes
        {
            opacity: [1, 0], transform: ["translateY(0)", "translateY(-150px)"],
        }, {
            // temporisation
            duration: 400, iterations: 1, easing: "cubic-bezier(.35,.43,.18,1.54)",
        },);

    // Show the hero banner on smaller screens when closing the modal
    if (innerWidth <= 500 && heroBanner.style.display === "none") {
        heroBanner.style.display = "block"
    }
};

// Initialize default variables
let formData = {};
let hasError = false;

// Function to get all input elements from the form
const getAllInputs = () => {
    formData = {
        first: form["first"],
        last: form["last"],
        email: form["email"],
        birthdate: form["birthdate"],
        quantity: form["quantity"],
        location: form["location"],
        termsOfUse: form["termsOfUse"],
        newsletter: form["newsletter"],
    };
};
getAllInputs();

const handleFormSubmit = e => {
    e.preventDefault()
    const isValid = validateForm()
    if (isValid) {
        displaySuccessMessage()
    } else {
        errorSubmit()
    }
}

// Function for live input validation
const inlineValidation = () => {
    inputsWrapper.forEach((input) => {
        input.addEventListener("input", (e) => {
            let input = formData[e.target.name];
            resetError(input);
            if (isRequired(input)) {
                handleErrorValidation(input, "Ce champs ne peut pas être vide.");
            }
            validateInput(input);
        });
    });
};

// Function to validate the entire form when it's submitted
const validateForm = () => {
    hasError = false;
    for (const name in formData) {
        let input = formData[name];
        resetError(input);

        if (isRequired(input)) {
            handleErrorValidation(input, "Ce champs ne peut pas être vide.");
            hasError = true;
            continue;
        }

        if (!validateInput(input) && !hasError) {
            hasError = true;
        }
    }

    // Start inline validation
    inlineValidation();

    return !hasError;
};

// Function to validate an individual input
const validateInput = (input) => {
    const name = getInputName(input);
    const value = getInputValue(input);
    if ((name === "first" || name === "last") && !isValidName(value)) {
        handleErrorValidation(input, "Nom invalide : minimum 2 caractères et caractères spéciaux non autorisés.",);
        return false;
    } else if (name === "email" && !isValidEmail(value)) {
        handleErrorValidation(input, "Adresse e-mail invalide. Veuillez entrer une adresse e-mail valide.",);
        return false;
    } else if (name === "birthdate" && !isValidBirthdate(value)) {
        handleErrorValidation(input, "Date de naissance invalide. Veuillez entrer une date de naissance valide.",);
        return false;
    } else if (name === "quantity" && !isPositiveInteger(value)) {
        handleErrorValidation(input, "Quantité invalide. Veuillez entrer un nombre entier positif.",);
        return false;
    } else if (name === "location" && !value) {
        handleErrorValidation(input, "Veuillez sélectionner un tournoi en cochant l'une des options disponibles.",);
        return false;
    }
    return true;
};

// Functions to validate input values
const isValidEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
};

const isValidName = (value) => {
    const regex = /^(?!.*[.'-]{2})[a-zA-Z][a-zA-Z ,.'-]+$/;
    return regex.test(value);
};

const isValidBirthdate = (value) => {
    const birthdate = new Date(value);
    return !(birthdate > new Date() || birthdate.getFullYear() < 1900 || isNaN(birthdate.getFullYear()));
    // && a la place
    // REGEX
};

const isPositiveInteger = (value) => {
    const number = Number(value);
    return Number.isInteger(number) && number >= 0;
};

const isRequired = (input) => {
    return input.required && !getInputValue(input);
};

// Functions to get input values and names
const getInputValue = (input) => {
    return input.type === "checkbox" ? input.checked : input.value;
};

const getInputName = (input) => {
    const isNodeList = NodeList.prototype.isPrototypeOf(input);
    if (isNodeList) {
        return input[0].name;
    } else {
        return input.name;
    }
};

const getInputWrapper = (input) => {
    let formInput;
    const isNodeList = NodeList.prototype.isPrototypeOf(input);
    if (isNodeList) {
        formInput = input[0].closest(".formInput");
    } else {
        formInput = input.closest(".formInput");
    }

    return formInput;
};

// Function to display an error message below the input
const handleErrorValidation = (input, message) => {
    const inputWrapper = getInputWrapper(input);
    const errorElement = inputWrapper.querySelector(".validation-error");
    inputWrapper.dataset.error = "true";
    if (errorElement) {
        errorElement.innerText = String(message);
    }
};

// Function to remove an error
const resetError = (input) => {
    const wrapper = getInputWrapper(input);
    wrapper.dataset.error = "false";
};

// Function to trigger a shake animation if there's an error in the form
const errorSubmit = () => {
    modal.classList.add("shake");
    setTimeout(() => {
        modal.classList.remove("shake");
    }, 1000);
};

// Function to display a success validation message and close the modal
const displaySuccessMessage = () => {
    form.innerHTML = "";
    let successMessage = "Merci pour votre inscription";
    let successDom = document.createElement("p");
    successDom.classList.add("successMessage");
    successDom.innerText = successMessage;

    form.append(successDom);
    successDom.animate({
        opacity: [0, 1], transform: ["translateY(70px)", "translateY(0)"],
    }, {
        duration: 400, iterations: 1, easing: "ease-in-out",
    },);

    setTimeout(() => {
        closeModal();
        form.submit();
    }, 2000);
};

// Event listeners for opening and closing the modal
modalBtn.forEach(btn => btn.addEventListener("click", openModal));
modalCloseBtn.addEventListener("click", closeModal);
form.addEventListener("submit", handleFormSubmit);