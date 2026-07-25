import React from "react";
import { Building2, Users, DoorOpen, Layers } from "lucide-react";

const HostelCard = ({ hostel, onView }) => {
  return (
    <div className="
      bg-white 
      rounded-2xl 
      shadow-md 
      border 
      border-gray-100
      p-6
      hover:shadow-xl
      transition-all
      duration-300
    ">

      {/* Hostel Header */}
      <div className="flex items-center gap-3 mb-5">

        <div className="
          bg-blue-100 
          p-3 
          rounded-xl
        ">
          <Building2 
            className="text-blue-600"
            size={30}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {hostel.name}
          </h2>

          <p className="text-sm text-gray-500">
            University Hostel
          </p>
        </div>

      </div>


      {/* Details */}

      <div className="space-y-3">


        <div className="flex justify-between items-center">

          <div className="flex gap-2 items-center text-gray-600">
            <Layers size={18}/>
            Floors
          </div>

          <span className="font-semibold">
            {hostel.floors}
          </span>

        </div>



        <div className="flex justify-between items-center">

          <div className="flex gap-2 items-center text-gray-600">
            <DoorOpen size={18}/>
            Rooms
          </div>

          <span className="font-semibold">
            {hostel.rooms}
          </span>

        </div>



        <div className="flex justify-between items-center">

          <div className="flex gap-2 items-center text-gray-600">
            <Users size={18}/>
            Students
          </div>

          <span className="font-semibold">
            {hostel.students}
          </span>

        </div>


      </div>



      {/* Occupancy */}

      <div className="mt-5">

        <div className="flex justify-between text-sm mb-2">

          <span className="text-gray-600">
            Occupancy
          </span>

          <span className="font-semibold">
            {hostel.occupancy}%
          </span>

        </div>


        <div className="
          w-full 
          bg-gray-200 
          rounded-full 
          h-2
        ">

          <div
            className="
              bg-blue-600 
              h-2 
              rounded-full
            "
            style={{
              width:`${hostel.occupancy}%`
            }}
          >

          </div>

        </div>

      </div>




      {/* Button */}

      <button
        onClick={() => onView(hostel)}
        className="
          mt-6
          w-full
          bg-blue-600
          text-white
          py-3
          rounded-xl
          hover:bg-blue-700
          transition
          font-semibold
        "
      >
        View Hostel
      </button>


    </div>
  );
};


export default HostelCard;