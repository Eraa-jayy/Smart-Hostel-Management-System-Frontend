import axios from "./axios";

export const getRoomByFloor =(floorID) =>{

    return axios.get(
        '/room/floor/${floorId}'
    );
};