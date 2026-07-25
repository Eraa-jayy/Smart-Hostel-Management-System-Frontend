import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FloorCard from "../../components/studentAffairs/FloorCard";


const HostelDetails = () => {


    const location = useLocation();
    const navigate = useNavigate();


    const hostel = location.state;



    const floors = [

        {
            id:1,
            number:1,
            rooms:28,
            capacity:112
        },


        {
            id:2,
            number:2,
            rooms:28,
            capacity:112
        },


        {
            id:3,
            number:3,
            rooms:28,
            capacity:112
        },


        {
            id:4,
            number:4,
            rooms:28,
            capacity:112
        }

    ];



    const handleFloorView=(floor)=>{


        navigate(
            `/student-affairs/floor/${floor.id}`,

            {
                state: floor
            }
        )

        // next step:
        // navigate room page


    };



    if(!hostel){

        return (

            <div className="p-10">

                Hostel not found

            </div>

        )

    }



    return (

        <div className="
            min-h-screen
            bg-gray-50
            p-8
        ">



            {/* Hostel Header */}

            <div className="
                bg-white
                rounded-2xl
                shadow
                p-6
                mb-8
            ">


                <h1 className="
                    text-3xl
                    font-bold
                    text-gray-800
                ">

                    {hostel.name}

                </h1>



                <div className="
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    gap-5
                    mt-6
                ">


                    <div>
                        <p className="text-gray-500">
                            Floors
                        </p>

                        <h3 className="font-bold text-xl">
                            {hostel.floors}
                        </h3>
                    </div>



                    <div>
                        <p className="text-gray-500">
                            Rooms
                        </p>

                        <h3 className="font-bold text-xl">
                            {hostel.rooms}
                        </h3>
                    </div>



                    <div>
                        <p className="text-gray-500">
                            Students
                        </p>

                        <h3 className="font-bold text-xl">
                            {hostel.students}
                        </h3>
                    </div>



                    <div>
                        <p className="text-gray-500">
                            Occupancy
                        </p>

                        <h3 className="font-bold text-xl">
                            {hostel.occupancy}%
                        </h3>
                    </div>


                </div>


            </div>




            {/* Floors */}

            <h2 className="
                text-xl
                font-semibold
                mb-5
            ">

                Hostel Floors

            </h2>




            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
            ">


                {
                    floors.map((floor)=>(


                        <FloorCard

                            key={floor.id}

                            floor={floor}

                            onView={handleFloorView}

                        />


                    ))
                }


            </div>



        </div>


    );


};


export default HostelDetails;