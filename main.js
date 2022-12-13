const form = document.getElementById("form");
const plans = document.querySelectorAll(".plan input[type=radio]");
const planPrices = document.querySelectorAll(".plan-price");
const monthlySub = document.getElementById("monthly-sub");
const yearlySub = document.getElementById("yearly-sub");
const freeMonths = document.querySelectorAll(".free-months");
const switcher = document.querySelector(".switcher");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // inp.value *= 10
  // document.querySelector('.plan-price').textContent = `$${inp.value}/mo`
  // console.log(inp.value);
});
switcher.addEventListener("click", () => {
  switcher.classList.toggle("active");
  monthlySub.classList.toggle("active");
  yearlySub.classList.toggle("active");
  freeMonths.forEach((month) => {
    month.classList.toggle("active");
  });
  plans.forEach((plan) => {
    if (monthlySub.classList.contains("active")) {
      plan.value /= 10;
      plan.nextElementSibling.nextElementSibling.children[1].textContent = `$${plan.value}/mo`;
    } else if (yearlySub.classList.contains("active")) {
      plan.value *= 10;
      plan.nextElementSibling.nextElementSibling.children[1].textContent = `$${plan.value}/yr`;
    }
  });
});
/*
Problems
the value of each plan price it's the last plan.value so all of them are 150
on each click the values are multiplied by 10 so 90,900,9000 ...etc
*/
