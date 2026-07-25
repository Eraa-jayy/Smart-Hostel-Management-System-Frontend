import React from "react";
import { DoorOpen, Users } from "lucide-react";


const RoomCard = ({room,onView}) => {


    const available =
        room.capacity > room.occupied;



    return (

        <div
        className="
        bg-white
        rounded-2xl
        shadow-md
        border
        p-6
        hover:shadow-xl
        transition
        "
        >


            <div className="flex items-center gap-3 mb-5">


                <div className="
                bg-blue-100
                p-3
                rounded-xl
                ">

                    <DoorOpen
                    className="text-blue-600"
                    />

                </div>



                <h2 className="
                text-xl
                font-bold
                ">
                    Room {room.number}
                </h2>


            </div>




            <div className="space-y-3">


                <p className="flex justify-between">

                    <span className="text-gray-500">
                        Capacity
                    </span>

                    <b>
                        {room.capacity}
                    </b>

                </p>



                <p className="flex justify-between">

                    <span className="flex gap-2 text-gray-500">

                        <Users size={18}/>

                        Occupied

                    </span>

                    <b>
                        {room.occupied}
                    </b>

                </p>


            </div>




            <div className="mt-4">

                {
                    available ?

                    <span className="
                    bg-green-100
                    text-green-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    ">
                        Available
                    </span>

                    :

                    <span className="
                    bg-red-100
                    text-red-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    ">
                        Full
                    </span>

                }


            </div>




            <button

            onClick={()=>onView(room)}

            className="
            mt-5
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-xl
            "
            >

                View Room

            </button>



        </div>


    )

}


export default RoomCard;