import axios from "./axios";

export const getFloorByBuildings = (buildingId) =>{
    return axios.get(
        '/floor/buildings/${buildingId}'
    );
};