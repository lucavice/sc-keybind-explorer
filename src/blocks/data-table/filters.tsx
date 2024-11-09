import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { DataColumn } from "./columns";

export type CurrentBindFilter =
  | "all"
  | "binded"
  | "keyboard"
  | "mouse"
  | "gamepad"
  | "joystick";

export function Filters(props: any) {
  var inputData: DataColumn[] = props.inputData;

  var currentValue: CurrentBindFilter = props.currentBindFilter;
  function onChangeBindingFilter(selection: any) {
    currentValue = selection;
  }

  function apply() {
    if (currentValue == "all") {
      props.updateHandler([...inputData]);
    }
    if (currentValue == "binded") {
      var filteredData = inputData.filter(
        (d) => d.keyboard || d.mouse || d.gamepad || d.joystick
      );
      props.updateHandler([...filteredData]);
    }
    if (currentValue == "keyboard") {
      var filteredData = inputData.filter((d) => d.keyboard);
      props.updateHandler([...filteredData]);
    }
    if (currentValue == "mouse") {
      var filteredData = inputData.filter((d) => d.mouse);
      props.updateHandler([...filteredData]);
    }
    if (currentValue == "gamepad") {
      var filteredData = inputData.filter((d) => d.gamepad);
      props.updateHandler([...filteredData]);
    }
    if (currentValue == "joystick") {
      var filteredData = inputData.filter((d) => d.joystick);
      props.updateHandler([...filteredData]);
    }

    props.setCurrentBindFilter(currentValue);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SlidersHorizontal />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Keybind filters</DialogTitle>
          <DialogDescription>
            Apply filters to show only a subset of the available keybinds
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Key Binding
            </Label>
            <Select
              onValueChange={onChangeBindingFilter}
              defaultValue={currentValue}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Show All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Show all</SelectItem>
                <SelectItem value="binded">
                  Show binded only (any device)
                </SelectItem>
                <SelectItem value="keyboard">Keyboard only</SelectItem>
                <SelectItem value="mouse">Mouse only</SelectItem>
                <SelectItem value="joystick">Joystick only</SelectItem>
                <SelectItem value="gamepad">Gamepad only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={apply}>
              Apply
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
