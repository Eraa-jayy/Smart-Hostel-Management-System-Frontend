import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "../../components/studentAffairs/RoomCard";


const FloorRooms = ()=>{

    const navigate = useNavigate();

const [search,setSearch]=useState("");



const rooms=[

{
id:1,
number:"101",
capacity:4,
occupied:4
},

{
id:2,
number:"102",
capacity:4,
occupied:2
},

{
id:3,
number:"103",
capacity:4,
occupied:3
},

{
id:4,
number:"104",
capacity:4,
occupied:1
}

];




const filteredRooms =
rooms.filter(room=>

room.number
.includes(search)

);




const viewRoom=(room)=>{

    navigate(
    `/student-affairs/room/${room.id}`,
    {
        state:room
    }
    );

};




return (

<div className="
bg-gray-50
min-h-screen
p-8
">


<h1 className="
text-3xl
font-bold
mb-6
">

Floor 1 Rooms

</h1>



<input

type="text"

placeholder="Search Room Number..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="
w-full
md:w-96
p-3
rounded-xl
border
mb-8
"

/>




<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">


{

filteredRooms.map(room=>(


<RoomCard

key={room.id}

room={room}

onView={viewRoom}

/>


))

}


</div>


</div>

)


}


export default FloorRooms;