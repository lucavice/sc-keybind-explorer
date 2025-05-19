import fs from "fs";
import { parseString } from "xml2js";
import * as changeCase from "change-case";
import * as ini from "ini";

const inputFilePath = "./defaultProfile.xml";
const outputFilePath = "./actions.it.json";
const iniFilePath = "./global.it.ini";

// Step 1. Parse XML Star Citizen Default Profile
var data = await parseXMLFile(inputFilePath);

// Step 2. Transform actions into a friendlier format
data = await filterAndFlatten(data);

// Step 3. Convert some strings into a more readable format
data = toFriendlykeyboardingNames(data);

// Step 4. Acquire localization info from global.ini file
var localizationMap = getLocalizationData();

// Step 5. Apply localization
data = applyLocalization(data, localizationMap);

// Step 7. Final Transform of data
data = finalTransform(data);

// Step 7. Write to json file
writeToFile(data);

async function parseXMLFile(inputFilePath) {
  try {
    const data = await fs.promises.readFile(inputFilePath, "utf8");
    let jsonResult;

    await parseString(
      data,
      { mergeAttrs: true, explicitArray: false },
      async (err, parsed) => {
        if (err) {
          console.error("Error parsing XML:", err);
          return;
        }
        jsonResult = parsed;
      }
    );

    return jsonResult;
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

async function filterAndFlatten(data) {
  const result = [];

  // Loop through each actionmap in the json data
  var actionMaps = [...data.profile.actionmap];
  actionMaps.forEach((actionMap) => {
    const actionMapName = actionMap.name;
    const uiCategory = actionMap.UICategory;
    const uiSubCategory = actionMap.UILabel;

    // Loop through each action in the actionmap
    var actions = Array.from(actionMap.action);
    for (const action of actions) {
      result.push({
        actionMapName: actionMapName,
        actionName: action.name,
        uiLabel: action.UILabel || "",
        localizedLabel: "",
        uiCategory: uiCategory || "",
        localizedCategory: "",
        uiSubCategory: uiSubCategory || "",
        localizedSubCategory: "",
        uiDescription: action.UIDescription || "",
        localizedDescription: "",
        keyboard: action.keyboard,
        gamepad: action.gamepad,
        joystick: action.joystick,
        mouse: action.mouse,
        activationMode: action.activationMode,
      });
    }
  });

  return result;
}

function toFriendlykeyboardingNames(entries) {
  entries.forEach((entry) => {
    ["keyboard", "mouse", "joystick", "gamepad", "activationMode"].forEach(
      (key) => {
        if (normalizeString(entry[key])) {
          entry[key] = normalizeAndTransform(entry[key]);
        }
      }
    );
  });

  function normalizeAndTransform(input) {
    if (!normalizeString(input)) return null;

    let transformed = input.toUpperCase();
    transformed = transformed.replace(" ", "") || "";
    transformed = transformed.replace("+", " + ") || "";
    transformed = transformed.replace("_", " ") || "";

    return transformed;
  }

  return entries;
}

async function writeToFile(data) {
  // Write JSON object to file
  const jsonOutput = JSON.stringify(data, null, 2);
  await fs.promises.writeFile(outputFilePath, jsonOutput, "utf8");
  console.log(`JSON output written to ${outputFilePath}`);
}

function getLocalizationData() {
  try {
    // Read the INI file content
    const fileContent = fs.readFileSync(iniFilePath, "utf-8");

    // Parse the INI content into a plain JavaScript object
    var localizationData = ini.parse(fileContent);

    const transformedData = {};
    for (const oldKey in localizationData) {
      if (Object.prototype.hasOwnProperty.call(localizationData, oldKey)) {
        const newKey = oldKey.replace(",P", "");
        transformedData[newKey] = localizationData[oldKey];
      }
    }

    // Return the object with transformed top-level keys
    return transformedData;

    return localizationData;
  } catch (error) {
    console.error("Error reading or parsing the INI file:", error);
  }
}

function applyLocalization(entries, localizationMap) {
  const localizeProperty = (entry, property, targetProperty) => {
    const locKey = entry[property]?.replace("@", "");
    if (locKey in localizationMap && localizationMap[locKey]) {
      entry[targetProperty] = localizationMap[locKey];
    }
  };

  entries.forEach((entry) => {
    const locKey = entry.uiLabel?.replace("@", "");
    if (locKey in localizationMap) {
      entry.localizedLabel = localizationMap[locKey];
    } else {
      entry.localizedLabel =
        changeCase.capitalCase(locKey) ||
        changeCase.capitalCase(entry.actionName);
    }

    localizeProperty(entry, "uiCategory", "localizedCategory");
    localizeProperty(entry, "uiDescription", "localizedDescription");
    localizeProperty(entry, "uiSubCategory", "localizedSubCategory");
  });

  return entries;
}

function finalTransform(entries) {
  return entries.map((e) => ({
    id: e.actionName,
    action: e.localizedLabel,
    keyboard: normalizeString(e.keyboard),
    mouse: normalizeString(e.mouse),
    gamepad: normalizeString(e.gamepad),
    joystick: normalizeString(e.joystick),
    category: e.localizedSubCategory,
    activationMode: e.activationMode,
    description: e.localizedDescription,
  }));
}

function normalizeString(input) {
  if (typeof input !== "string") return null;

  if (typeof input === "string" && input.trim() === "") {
    return null;
  }
  return input;
}
