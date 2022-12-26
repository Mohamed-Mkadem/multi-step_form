// Constants and variables
const form = document.getElementById("form");
const usernameInput = document.querySelector("input[type=text]");
const emailInput = document.querySelector("input[type=email]");
const phoneInput = document.querySelector("input[type=number]");
const plans = document.querySelectorAll(".plan input[type=radio]");
const addons = Array.from(
  document.querySelectorAll(".add-on input[type=checkbox]")
);
const planPrices = document.querySelectorAll(".plan-price");
const monthlySub = document.getElementById("monthly-sub");
const yearlySub = document.getElementById("yearly-sub");
const freeMonths = document.querySelectorAll(".free-months");
const switcher = document.querySelector(".switcher");
const stepNumbers = document.querySelectorAll("div.step-number");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("back");
const changeBtn = document.getElementById("change");
const steps = document.querySelectorAll(".step");
let billingType = "Monthly";

/* ------- The Logic ------- */
// -- Calling the functions
form.addEventListener("submit", (e) => {
  e.preventDefault();
});
checker(document.querySelector(".step.active"));
setBillingType();
setTheCheckedPlanInput();
setTheCheckedAddons();
switcherButton();
nextButton();
previousButton();
changeButton();
updateThePlan();
updateAddons();
handleTheLastStep();
// -- Defining The functions
function setBillingType() {
  if (localStorage.getItem("billing_type")) {
    billingType = localStorage.billing_type;
    switcher.dataset.billing = localStorage.billing_type;
    updateValues();
    setActiveSubscription();
  } else {
    localStorage.billing_type = "Monthly";
  }
}
function setTheCheckedPlanInput() {
  if (localStorage.getItem("plan")) {
    plans.forEach((plan) => {
      planObject = JSON.parse(localStorage.plan);
      if (plan.dataset.name == planObject.name) {
        plan.setAttribute("checked", true);
      }
      getPlanInfos();
    });
  } else {
    plan = {
      name: "Arcade",
      price: document.querySelector("input[type=radio]:checked").dataset.value,
    };
    localStorage.setItem("plan", JSON.stringify(plan));
    getPlanInfos();
  }
}

function setTheCheckedAddons() {
  if (localStorage.getItem("addonsList")) {
    listOfAddons = JSON.parse(localStorage.addonsList);
    for (i = 0; i < addons.length; i++) {
      listOfAddons.forEach((addon) => {
        if (addons[i].dataset.name == addon.name) {
          addons[i].checked = true;
        }
      });
    }
  }
}
function switcherButton() {
  switcher.addEventListener("click", () => {
    if (localStorage.billing_type == "Monthly") {
      localStorage.billing_type = "Yearly";
      billingType = localStorage.billing_type;
      switcher.dataset.billing = localStorage.billing_type;
      updateValues();
      setActiveSubscription();
    } else if (localStorage.billing_type == "Yearly") {
      localStorage.billing_type = "Monthly";
      billingType = localStorage.billing_type;
      switcher.dataset.billing = localStorage.billing_type;
      updateValues();
      setActiveSubscription();
    }
    handleTheLastStep();
  });
}

function updateValues() {
  if (localStorage.billing_type == "Monthly") {
    plans.forEach((plan) => {
      plan.value = plan.dataset.value * 1;
      plan.nextElementSibling.nextElementSibling.children[1].textContent = `$${plan.value}/mo`;
    });
    addons.forEach((addon) => {
      addon.value = addon.dataset.value * 1;
      addon.nextElementSibling.nextElementSibling.textContent = `+$${addon.value}/mo`;
    });
    freeMonths.forEach((month)=>{
      month.classList.remove('active')
    })
  } else if (localStorage.billing_type == "Yearly") {
    plans.forEach((plan) => {
      plan.value = plan.dataset.value * 10;
      plan.nextElementSibling.nextElementSibling.children[1].textContent = `$${plan.value}/yr`;
    });
    addons.forEach((addon) => {
      addon.value = addon.dataset.value * 10;
      addon.nextElementSibling.nextElementSibling.textContent = `+$${addon.value}/yr`;
    });
    freeMonths.forEach((month)=>{
      month.classList.add('active')
    })
  }
}

function setActiveSubscription() {
  if (localStorage.billing_type == "Monthly") {
    monthlySub.classList.add("active");
    yearlySub.classList.remove("active");
  } else if (localStorage.billing_type == "Yearly") {
    monthlySub.classList.remove("active");
    yearlySub.classList.add("active");
  }
}

function checker(step) {
  if (step.dataset.index == 1) {
    prevBtn.classList.remove("open");
  } else {
    prevBtn.classList.add("open");
  }
  if (step.dataset.index == 4) {
    nextBtn.textContent = "Confirm";
    nextBtn.classList.add("confirm");
  } else {
    nextBtn.textContent = "Next Step";
    nextBtn.classList.remove("confirm");
  }
}
function moveToStep(StepsArray, currentStep, targetStep) {
  if (!targetStep) return;
  StepsArray.forEach((step) => {
    step.classList.remove("active");
  });
  targetStep.classList.add("active");

}
function nextButton() {
  nextBtn.addEventListener("click", () => {
    currentStep = document.querySelector(".step.active");
    currentStepNumber = document.querySelector(".step-number.active");
    targetStep = currentStep.nextElementSibling;
    if (!validateFields()) {
      moveToStep(steps, currentStep, targetStep);
      moveToStep(
        stepNumbers,
        currentStepNumber,
        stepNumbers[parseInt(currentStepNumber.dataset.index) + 1]
      );
      checker(targetStep);
      sendForm(currentStep);
    }
  });
}

function previousButton() {
  prevBtn.addEventListener("click", () => {
    currentStep = document.querySelector(".step.active");
    currentStepNumber = document.querySelector(".step-number.active");
    targetStep = currentStep.previousElementSibling;
    moveToStep(steps, currentStep, targetStep);
    moveToStep(
      stepNumbers,
      currentStepNumber,
      stepNumbers[parseInt(currentStepNumber.dataset.index) - 1]
    );
    checker(targetStep);
  });
}

function changeButton() {
  changeBtn.addEventListener("click", () => {
    moveToStep(steps, steps[3], steps[1]);
    checker(steps[1]);
  });
}

function updateThePlan() {
  plans.forEach((plan) => {
    plan.addEventListener("change", () => {
      thePlan = {
        name: plan.dataset.name,
        price: plan.dataset.value,
      };
      localStorage.plan = JSON.stringify(thePlan);
      handleTheLastStep();
    });
  });
}

function updateAddons() {
  addons.forEach((addon) => {
    addon.addEventListener("change", () => {
      getAddons(addons);
      handleTheLastStep();
    });
  });
}
function getAddons(addonsList) {
  finalAddonsList = [];
  addonsList.forEach((addon) => {
    if (addon.checked) {
      finalAddonsList.push({
        name: addon.dataset.name,
        price: addon.dataset.value,
      });
    }
  });
  localStorage.addonsList = JSON.stringify(finalAddonsList);
}

function getPlanInfos() {
  planHolder = document.querySelector("#plan-holder");
  planPrice = document.getElementById("plan-price-holder");
  plan = JSON.parse(localStorage.plan);
  planSubscription = localStorage.billing_type;
  planHolder.textContent = `${plan.name} (${planSubscription})`;
  planSubscription == "Monthly"
    ? (planPrice.textContent = `$${plan.price}/mo`)
    : (planPrice.textContent = `$${plan.price * 10}/yr`);
}

function printAddonsList() {
  if (localStorage.addonsList) {
    addonsList = JSON.parse(localStorage.addonsList);
    planSubscription = localStorage.billing_type;
    addonsListWrapper = document.querySelector(".final-wrapper .addons-list");
    addonsListWrapper.textContent = ``;
    for (i = 0; i < addonsList.length; i++) {
      finalItem = document.createElement("div");
      finalItem.className = "final-item flex";
      addonName = document.createElement("h4");
      addonName.className = "item-name";
      addonName.textContent = addonsList[i].name;
      addonPrice = document.createElement("p");
      addonPrice.className = "item-price";
      planSubscription == "Monthly"
        ? (addonPrice.textContent = `+$${addonsList[i].price}/mo`)
        : (addonPrice.textContent = `+$${addonsList[i].price * 10}/yr`);

      finalItem.append(addonName);
      finalItem.append(addonPrice);
      addonsListWrapper.append(finalItem);
    }
  }
}

function getTotal() {
  plan = JSON.parse(localStorage.plan);
  total = parseInt(plan.price);
  planSubscription = localStorage.billing_type;
  if (localStorage.addonsList) {
    theAddonsList = JSON.parse(localStorage.addonsList);
    for (i = 0; i < theAddonsList.length; i++) {
      total += parseInt(theAddonsList[i].price);
    }
  }
  totalType = document.querySelector(".total-type");
  totalPrice = document.querySelector(".total-price");
  planSubscription == "Monthly"
    ? (totalType.textContent = "Total (Per Month)")
    : (totalType.textContent = "Total (Per Year)");
  planSubscription == "Monthly"
    ? (totalPrice.textContent = `+$${total}/mo`)
    : (totalPrice.textContent = `+$${total * 10}/yr`);
}
function handleTheLastStep() {
  getPlanInfos();
  printAddonsList();
  getTotal();
}

function validateFields() {
  errors = 0;
  if (currentStep.dataset.index == 1) {
    errors += validateUsername();
    errors += validateEmail();
    errors += validatePhone();
  }
  return errors;
}
function validateEmail() {
  emailError = emailInput.nextElementSibling;
  if (!emailInput.value) {
    emailError.textContent = "This Field is Required";
    emailError.className = "error visible";
    errors = 1;
  } else if (!emailInput.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{1,10}$/)) {
    emailError.textContent = "Please enter a valid email address";
    emailError.className = "error visible";
    errors = 1;
  } else {
    emailError.className = "error";
    errors = 0;
  }
  return errors;
}
function validateUsername() {
  usernameError = usernameInput.nextElementSibling;
  if (!usernameInput.value) {
    usernameError.textContent = "This Field is required";
    usernameError.className = "error visible";
    errors = 1;
  } else {
    usernameError.className = "error";
    errors = 0;
  }
  return errors;
}
function validatePhone() {
  phoneError = phoneInput.nextElementSibling;
  if (!phoneInput.value) {
    phoneError.textContent = "This Field is required";
    phoneError.className = "error visible";
    errors = 1;
  } else {
    phoneError.className = "error";
    errors = 0;
  }
  return errors;
}

function sendForm(currentStep) {
  if (currentStep.dataset.index == 4) {
    let request = new XMLHttpRequest();
    request.open("GET", "#");
    request.onreadystatechange = () => {
      if (request.readyState == 4 && request.status == 200) {
        console.log("ready to send");
        // The logic of sending form data with ajax request
      }
    };
    request.addEventListener("load", () => {
      showMessageOfThanks();
      emptyFields();
      setTimeout(redirectToTheFirstStep, 5000);
      console.log("sent successfully");
    });
    request.send();
  }
}

function showMessageOfThanks() {
  // Remove the buttons holder
  nextBtn.parentElement.style.display = "none";
  // If the device is not a mobile the following styles will be applied to the final step
  if (window.innerWidth > 768) {
    steps[steps.length - 1].style.top = "50%";
    steps[steps.length - 1].style.translate = "0 -50%";
  }
}
function redirectToTheFirstStep() {
  nextBtn.parentElement.style.display = "flex";

  moveToStep(steps, steps[4], steps[0]);
  checker(steps[0])
  moveToStep(stepNumbers, stepNumbers[3], stepNumbers[0]);
}
function emptyFields() {
  emailInput.value = "";
  usernameInput.value = "";
  phoneInput.value = "";
}
