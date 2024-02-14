const App = {
  username: getConfig("username"),
  voice: getConfig("voice", 0),
  cooldown: getConfig("cooldown", 0),
  filter: getConfig("filter", "all"),
  started: false,
  lastSpoken: 0,

  setCooldown: (_cooldown) => null,
  connect: (_username) => null,
  disconnect: () => null,
  login: (_username) => null,
  logout: () => null,
  speak: (_text) => null,
  getVoices: () => [],
  setFilter: (_filter) => null,
  start: () => null,
};

App.setCooldown = function (cooldown) {
  App.cooldown = cooldown;
  App.lastSpoken = 0;
  setConfig("cooldown", cooldown);
};

App.connect = async function (username) {
  UI.display("loading");
  const usernameText = document.getElementById("usernameText");
  const usernameImg = document.getElementById("usernameImg");

  const res = await fetch(
    "https://open.staroverlay.com/twitch/channel?username=" + username
  );
  const { channel } = await res.json();
  usernameText.textContent = channel.display_name;
  usernameImg.src = channel.profile_image_url;
  usernameImg.style.display = "block";

  const client = new tmi.Client({
    channels: [username],
  });

  client.on("message", (channel, tags, message, self) => {
    if (App.started) {
      const filter = App.filter;
      const isStreamer = tags.username === username;
      const isMod = tags.mod;
      const isVIP = tags.badges.vip;
      const isSub = tags.subscriber;

      if (filter === "streamer" && !isStreamer) {
        return;
      }

      if (filter === "mod" && !isMod && !isStreamer) {
        return;
      }

      if (filter === "vip" && !isVIP && !isMod && !isStreamer) {
        return;
      }

      if (filter === "sub" && !isSub && !isVIP && !isMod && !isStreamer) {
        return;
      }

      App.speakWithCooldown(message);
    }
  });

  client.once("connected", () => {
    App._tmiClient = client;
    UI.display("app");
  });

  client.connect();
};

App.disconnect = function () {};

App.login = async function (username) {
  App.username = username;
  App.connect(username);
  setConfig("username", username);
};

App.logout = function () {
  App.username = undefined;
  App.disconnect();
  UI.display("login");
  setConfig("username", undefined);
};

App.speak = function (text) {
  App.lastSpoken = Date.now();

  // Create a SpeechSynthesisUtterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Select a voice
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices[App.voice]; // Choose a specific voice

  // Speak the text
  speechSynthesis.speak(utterance);
};

App.speakWithCooldown = function (text) {
  if (Date.now() - App.lastSpoken > App.cooldown) {
    App.speak(text);
  }
};

App.getVoices = function () {
  return speechSynthesis.getVoices().map((v) => v.name);
};

App.setFilter = function (filter) {
  App.filter = filter;
  setConfig("filter", filter);
};

App.start = function () {
  if (App.username) {
    App.connect(App.username);
  } else {
    UI.display("login");
  }
};
