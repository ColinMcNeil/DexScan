function setTray() {
  if (NL_MODE != "window") {
    console.log("INFO: Tray menu is only available in the window mode.");
    return;
  }
  let tray = {
    icon: "/resources/icons/trayIcon.png",
    menuItems: [
      { id: "VERSION", text: "Get version" },
      { id: "SEP", text: "-" },
      { id: "QUIT", text: "Quit" },
    ],
  };
  Neutralino.os.setTray(tray);
}

function onWindowClose() {
  Neutralino.app.exit();
}

Neutralino.init();

Neutralino.events.on("windowClose", onWindowClose);

const runButton = document.getElementById("run");
const startStopButton = document.getElementById("startstop");
const csvExportButton = document.getElementById("export");

const stringOrUndefined = (string) =>
  !string || string.length === 0 ? undefined : string;

const getForm = () => ({
  srcToken: stringOrUndefined(document.getElementById("srcToken").value),
  destToken: stringOrUndefined(document.getElementById("destToken").value),
  srcDecimals: stringOrUndefined(document.getElementById("srcDecimals").value),
  destDecimals: stringOrUndefined(
    document.getElementById("destDecimals").value
  ),
  side: stringOrUndefined(document.getElementById("side").value),
  amount: stringOrUndefined(document.getElementById("amount").value),
  network: stringOrUndefined(document.getElementById("network").value),
});

runButton.addEventListener("click", () => {
  runButton.innerHTML = "Loading";
  runScan(getForm()).then((data) => {
    document.getElementById("output").innerHTML += parse(data);
    runButton.innerHTML = "Run Scan";
  });
});

let interval = -1;

const run = () => {
  if (interval === -1) {
    return;
  }
  runScan(getForm()).then((data) => {
    document.getElementById("output").innerHTML += "\n" + parse(data);
  });
  setTimeout(run, interval);
};

startStopButton.addEventListener("click", () => {
  if (interval === -1) {
    startStopButton.innerHTML = "End Repeat";
    interval = parseInt(document.getElementById("wait").value);
    run();
  } else {
    startStopButton.innerHTML = "Start Repeat";
    interval = -1;
  }
});

csvExportButton.addEventListener("click", () => {
  const content = [...document.querySelectorAll(".row.item")];
  saveCsv(
    content.map((row) => row.innerHTML.replaceAll("</div>", "").split("<div>"))
  );
});

if (NL_OS != "Darwin") {
  // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
  setTray();
}

const saveCsv = async (matrix) => {
  const response = await Neutralino.os.showSaveDialog("Save CSV", {
    filters: [
      { name: "CSV", extensions: ["csv"] },
      { name: "All files", extensions: ["*"] },
    ],
  });
  console.log(response + ".csv", matrix.map((e) => e.join(",")).join("\n"));
  try {
    await Neutralino.filesystem.writeFile(
      response + ".csv",
      "Time, Request time, Worst Deal, Worst Exchange, Best Deal, Best Exchange\n" +
        matrix.map((row) => row.slice(1).join(",")).join("\n")
    );
  } catch (e) {
    console.error(e);
  }
};
