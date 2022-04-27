import {icons} from "../../components/icon/icons";


const PUMPOUT_POINT_LIST = [
    { lat: 36.90766002338224, lon: -76.30747363802291},
    {lat: 36.907526841069426, lon: -76.30823872902242},
    {lat: 36.90719655504257, lon: -76.30703441721187}
]

const FUEL_POINT_LIST = [
    {lat: 36.90731227753884, lon: -76.30699334048268},
    { lat: 36.90704696074129,lon: -76.30833528849028},
    {lat: 36.90680360298373, lon: -76.3060283208482}
]

const ELECTRICITY_POINT_LIST = [
    {lat: 36.90731227753884, lon: -76.30699334048268},
    {lat: 36.907526841069426, lon: -76.30823872902242},
    {lat: 36.90680360298373, lon: -76.3060283208482}
]


const BOATS = [
    {lat: 36.9075069343, lon:-76.3075832230194, rotation: 100, icon: icons.boatInMarina},
    {lat: 36.90738002831064, lon: -76.30761374301912, rotation: 100, icon: icons.boatInMarina},
    {lat:36.90758323968612, lon:  -76.30740050740793, rotation: 280, icon: icons.boatInMarina},
    {lat:36.90732426572824, lon:   -76.30743269391635, rotation: 280, icon: icons.boatInMarina},
    {lat:36.906777636736436, lon:  -76.3076987767134, rotation: 100, icon: icons.boatBoater},
    {lat:36.90684296241661,lon:  -76.30770225590291, rotation: 100, icon: icons.boatSeasonal},

]


export const RESOURCES = {
    pumpOuts: PUMPOUT_POINT_LIST,
    fuel: FUEL_POINT_LIST,
    electricity: ELECTRICITY_POINT_LIST,
    boats: BOATS
}
