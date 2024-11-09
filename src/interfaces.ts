export interface CustomProfile {
    ActionMaps: ActionMaps;
}

export interface ActionMaps {
    $:                     ActionMapsClass;
    CustomisationUIHeader: CustomisationUIHeaderElement[];
    options:               OptionElement[];
    modifiers:             string[];
    actionmap:             ActionmapElement[];
}

export interface ActionMapsClass {
    version:        string;
    optionsVersion: string;
    rebindVersion:  string;
    profileName:    string;
}

export interface CustomisationUIHeaderElement {
    $:          CustomisationUIHeader;
    devices:    Device[];
    categories: CustomisationUIHeaderCategory[];
}

export interface CustomisationUIHeader {
    label:       string;
    description: string;
    image:       string;
}

export interface CustomisationUIHeaderCategory {
    category: CategoryCategory[];
}

export interface CategoryCategory {
    $: Category;
}

export interface Category {
    label: string;
}

export interface Device {
    keyboard: JoystickElement[];
    mouse:    JoystickElement[];
    joystick: JoystickElement[];
}

export interface JoystickElement {
    $: Joystick;
}

export interface Joystick {
    instance: string;
}

export interface ActionmapElement {
    $:      Actionmap;
    action: Action[];
}

export interface Actionmap {
    name: string;
}

export interface Action {
    $:      Actionmap;
    rebind: RebindElement[];
}

export interface RebindElement {
    $: Rebind;
}

export interface Rebind {
    input: string;
}

export interface OptionElement {
    $: Option;
}

export interface Option {
    type:     string;
    instance: string;
    Product:  string;
}
