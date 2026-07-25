import React from "react";
import { Layers, DoorOpen } from "lucide-react";


const FloorCard = ({ floor, onView }) => {

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
                    bg-indigo-100
                    p-3
                    rounded-xl
                ">

                    <Layers 
                        className="text-indigo-600"
                        size={28}
                    />

                </div>


                <div>

                    <h2 className="
                        text-xl
                        font-bold
                        text-gray-800
                    ">
                        Floor {floor.number}
                    </h2>


                    <p className="text-gray-500 text-sm">
                        Hostel Floor
                    </p>

                </div>


            </div>



            <div className="space-y-3">


                <div className="
                    flex
                    justify-between
                    text-gray-600
                ">

                    <span className="flex gap-2 items-center">
                        <DoorOpen size={18}/>
                        Rooms
                    </span>


                    <span className="font-semibold">
                        {floor.rooms}
                    </span>

                </div>



                <div className="
                    flex
                    justify-between
                    text-gray-600
                ">

                    <span>
                        Capacity
                    </span>


                    <span className="font-semibold">
                        {floor.capacity}
                    </span>

                </div>



            </div>



            <button

                onClick={() => onView(floor)}

                className="
                mt-6
                w-full
                bg-indigo-600
                text-white
                py-3
                rounded-xl
                hover:bg-indigo-700
                transition
                font-semibold
                "

            >

                View Rooms

            </button>


        </div>


    );

};


export default FloorCard;