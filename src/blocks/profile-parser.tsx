import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseString } from "xml2js";
import { Button } from "@/components/ui/button";
import * as changeCase from "change-case";
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
import { CustomProfile } from "@/interfaces";
import { DataColumn } from "./data-table/columns";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Trash2 } from "lucide-react";

let updatedKeybinds: DataColumn[];

const ProfileParser = (props: any) => {
  const [pendingProfile, setPendingProfile] = useState<CustomProfile | null>(
    null
  );
  const [currentProfile, setCurrentProfile] = useState<CustomProfile | null>(
    pendingProfile
  );

  const [incorrectFile, setIncorrectFile] = useState(false);

  const handleFileUpload = (event: any) => {
    let keybinds = props.keybinds as DataColumn[];
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const xmlString = e.target.result;
        parseString(xmlString, (err, profile: CustomProfile) => {
          if (err) {
            console.error("Error parsing XML:", err);
          } else {
            var result = mapCustomProfile(profile, keybinds);
            if (result) {
              setPendingProfile(profile);
            }
          }
        });
      };
      reader.readAsText(file);
    }
  };

  function mapCustomProfile(
    profile: CustomProfile,
    keybinds: DataColumn[]
  ): boolean {
    setIncorrectFile(false);

    if (profile?.ActionMaps?.actionmap == null) {
      setIncorrectFile(true);
      return false;
    }

    profile.ActionMaps.actionmap.forEach((am) => {
      am.action.forEach((a) => {
        var keybind = keybinds.find((k) => k.id == a.$.name);
        if (keybind != null) {
          let removedKeyBind = false;
          let unbindedKey = "";
          let newKeybind = changeCase
            .capitalCase(a.rebind[0].$.input)
            .toLocaleUpperCase();

          if (newKeybind.split(" ").length <= 1) {
            removedKeyBind = true;
          }

          if (newKeybind.startsWith("JS")) {
            keybind.joystick = removedKeyBind ? unbindedKey : newKeybind;
            keybind.rebindedJoystick = true;
          }
          if (newKeybind.startsWith("KB")) {
            keybind.keyboard = removedKeyBind ? unbindedKey : newKeybind;
            keybind.rebindedKeyboard = true;
          }
          if (newKeybind.startsWith("MS")) {
            keybind.mouse = removedKeyBind ? unbindedKey : newKeybind;
            keybind.rebindedMouse = true;
          }
          if (newKeybind.startsWith("GP")) {
            keybind.gamepad = removedKeyBind ? unbindedKey : newKeybind;
            keybind.rebindedGamepad = true;
          }
        }
      });
    });

    updatedKeybinds = keybinds;

    return true;
  }

  function apply() {
    props.updateHandler([...updatedKeybinds]);
    setCurrentProfile(pendingProfile);
    localStorage.setItem("sc-profile", JSON.stringify(pendingProfile));
  }

  function clearProfile() {
    localStorage.removeItem("sc-profile");
    window.location.reload();
  }

  useEffect(() => {
    var storedProfileString = localStorage.getItem("sc-profile");
    if (storedProfileString != null && currentProfile == null) {
      let storedProfile = JSON.parse(storedProfileString);
      mapCustomProfile(storedProfile, props.keybinds);
      setCurrentProfile(storedProfile);
      props.updateHandler([...updatedKeybinds]);
    }
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center">
          <Button variant="outline" className="text-yellow-500">
            {currentProfile
              ? currentProfile.ActionMaps.$.profileName
              : "Load Game Profile"}
          </Button>
          {currentProfile ? (
            <Button
              className="ml-2"
              variant="destructive"
              size="icon"
              onClick={clearProfile}
            >
              <Trash2 />
            </Button>
          ) : null}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Load Game Profile</DialogTitle>
          <DialogDescription>
            <p>
              Upload your Star Citizen saved controls configuration from your
              local computer.
            </p>
            <p>
              The profile file is located in your installation folder under:
            </p>
            <blockquote className="mt-6 border-l-2 pl-6 italic">
              StarCitizen\LIVE\user\client\0\Controls\Mappings\
              <strong>YourProfile.xml</strong>
            </blockquote>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="Profile">Custom Profile</Label>
              <Input
                id="xml"
                accept=".xml"
                type="file"
                onChange={handleFileUpload}
              />
            </div>
          </div>
          {incorrectFile ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                The file you are trying to upload does not look like a Star
                Citizen control profile.
              </AlertDescription>
            </Alert>
          ) : (
            ""
          )}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="ProfileName">Profile name</Label>
            <p>
              {pendingProfile != null
                ? pendingProfile.ActionMaps.$.profileName
                : "-"}
            </p>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="DeviceNames">Device names</Label>
            {pendingProfile != null
              ? pendingProfile.ActionMaps.options?.map((o) => (
                  <p key={o.$.Product}>
                    {o.$.Product.replace(/\s*\{[^}]*\}/g, "")}
                  </p>
                ))
              : "-"}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" disabled={incorrectFile} onClick={apply}>
              Apply
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileParser;
