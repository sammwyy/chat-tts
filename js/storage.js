function getConfig(path, defaultValue = undefined) {
  const item = localStorage.getItem(`settings_${path}`);
  if (item === null) {
    return defaultValue;
  }

  const [type, value] = item.split(":", 2);
  if (type === "number") {
    return Number(value);
  } else if (type === "boolean") {
    return value === "true";
  } else {
    return value;
  }
}

function setConfig(path, value) {
  if ((value === null) | (value === undefined)) {
    localStorage.removeItem(`settings_${path}`);
    return;
  }

  let type = "string";
  if (typeof value === "number") {
    type = "number";
  } else if (typeof value === "boolean") {
    type = "boolean";
  }

  localStorage.setItem(`settings_${path}`, `${type}:${value}`);
}
