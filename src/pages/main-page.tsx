import { DataColumn, columns } from "../blocks/data-table/columns";
import { DataTable } from "../blocks/data-table/data-table";

import actions from "../sc-data/actions.json";
import versionInfo from "../version";

var dataActions: DataColumn[] = actions;

export default function MainPage() {
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
        </div>
      </div>

      <DataTable columns={columns} inputData={dataActions} />
    </div>
  );
}
