import { DataColumn, columns } from "../blocks/data-table/columns";
import { DataTable } from "../blocks/data-table/data-table";
import { useMemo } from "react"; // Import useMemo hook

import actionsEn from "../sc-data/actions.en.json";
import actionsIt from "../sc-data/actions.it.json";

import versionInfo from "../version";

// Remove the global var declaration, dataActions will be determined inside the component

export default function MainPage() {
  // Determine the language and load the corresponding data using useMemo
  // This ensures the data selection logic runs only once on mount
  const dataActions = useMemo(() => {
    // Access the query string from the browser's location object
    const search = window.location.search;

    // Use URLSearchParams to easily parse the query string
    const params = new URLSearchParams(search);

    // Get the value of the 'lang' parameter
    const lang = params.get("lang");

    // Return the appropriate actions data based on the lang parameter
    if (lang === "it") {
      console.log("Loading Italian actions..."); // Optional: for debugging
      return actionsIt;
    } else {
      // Default to English if lang is not 'it', is empty, or is missing
      console.log("Loading English actions (default)..."); // Optional: for debugging
      return actionsEn;
    }
  }, []); // Empty dependency array means this memoized value is calculated only once

  return (
    <div className="container mx-auto m-4">
      <div className="flex justify-between">
        <div>
          <span className="text-2xl text-yellow-500">
            Star Citizen Keybind Explorer
          </span>
          <span className="text-xs text-yellow-500">
            {versionInfo.version.KeybindExplorer}
          </span>
          <span className="text-xs pl-2">
            Star Citizen {versionInfo.version.StarCitizen}
          </span>
          <span className="text-xs"> - by lucavice</span>
        </div>
        <div className="flex items-center">
          <a
            href="https://github.com/lucavice/sc-keybind-explorer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="max-h-6"
              src="github-mark-white.svg"
              alt="GitHub Logo"
            ></img>
          </a>
          <div className="pl-2">
            <a href="/">EN</a> | <a href="/?lang=it">IT</a>
          </div>
        </div>
      </div>

      {/* Pass the dynamically selected dataActions to the DataTable */}
      <DataTable columns={columns} inputData={dataActions} />
    </div>
  );
}
