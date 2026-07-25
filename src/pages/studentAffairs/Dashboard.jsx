import React from "react";
import { useNavigate } from "react-router-dom";
import HostelCard from "../../components/studentAffairs/HostelCard";

const StudentAffairsDashboard = () => {

  const navigate = useNavigate();

  // Temporary data
  // Later replace with API call

  const hostels = [

    {
      id:1,
      name:"Sarasavi Hostel",
      floors:4,
      rooms:112,
      students:420,
      occupancy:85
    },


    {
      id:2,
      name:"Wijewardene Hostel",
      floors:3,
      rooms:86,
      students:310,
      occupancy:90
    },


    {
      id:3,
      name:"Gajaba Hostel",
      floors:5,
      rooms:140,
      students:500,
      occupancy:95
    },


    {
      id:4,
      name:"Mihindu Hostel",
      floors:4,
      rooms:100,
      students:350,
      occupancy:70
    }

  ];



  const handleViewHostel = (hostel)=>{

    navigate(
      `/student-affairs/hostel/${hostel.id}`,
      {
        state:hostel
      }
    )
   
  };



  return (

    <div className="
      min-h-screen
      bg-gray-50
      p-8
    ">


      {/* Header */}

      <div className="mb-8">

        <h1 className="
          text-3xl
          font-bold
          text-gray-800
        ">
          Student Affairs Dashboard
        </h1>


        <p className="text-gray-500 mt-2">
          Manage university hostels and student allocations
        </p>


      </div>




      {/* Hostel Cards */}

      <h2 className="
        text-xl
        font-semibold
        mb-5
        text-gray-700
      ">
        University Hostels
      </h2>



      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">


        {
          hostels.map((hostel)=>(

            <HostelCard

              key={hostel.id}

              hostel={hostel}

              onView={handleViewHostel}

            />

          ))
        }


      </div>



    </div>

  );

};


export default StudentAffairsDashboard;