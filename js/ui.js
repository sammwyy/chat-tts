const UI = {
  _lastDisplayedElement: null,
  display: (_id) => null,
};

UI.display = (id) => {
  if (UI._lastDisplayedElement) {
    UI._lastDisplayedElement.style.display = "none";
  }

  const element = document.getElementById(id);
  element.style.display = "flex";
  UI._lastDisplayedElement = element;
};

// Add listeners.
const connectBTN = document.getElementById("connectBTN");
const logoutBTN = document.getElementById("logoutBTN");
const startBTN = document.getElementById("startBTN");
const usernameInput = document.getElementById("usernameInput");
const cooldownInput = document.getElementById("cooldownInput");
const voiceSelect = document.getElementById("voiceSelect");
const filterSelect = document.getElementById("filterSelect");
const previewBTN = document.getElementById("previewBTN");

connectBTN.addEventListener("click", () => {
  App.login(usernameInput.value);
});

logoutBTN.addEventListener("click", (e) => {
  e.preventDefault();
  App.logout();
});

previewBTN.addEventListener("click", () => {
  App.speak("This is a preview of the voice.");
});

startBTN.addEventListener("click", () => {
  App.started = !App.started;
  startBTN.textContent = App.started ? "Stop" : "Start";
});

cooldownInput.value = App.cooldown;
cooldownInput.addEventListener("change", (e) => {
  const value = e.target.value.trim();
  const valid = !isNaN(value) && value >= 0;

  if (valid) {
    App.setCooldown(cooldownInput.value);
  } else {
    cooldownInput.value = App.cooldown;
  }
});

voiceSelect.addEventListener("change", (e) => {
  App.voice = parseInt(e.target.value);
});

window.speechSynthesis.onvoiceschanged = () => {
  const voices = App.getVoices();
  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = voice;
    voiceSelect.appendChild(option);
  });
};

filterSelect.value = App.filter;

filterSelect.addEventListener("change", (e) => {
  App.setFilter(e.target.value);
});
