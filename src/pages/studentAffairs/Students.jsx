import React, {useState} from "react";
//import StudentDetails from "../../components/studentAffairs/studentList";
import StudentDetails from "../../components/studentAffairs/StudentDetails";


const students = [

{
id:"CS001",
name:"Amal Perera",
faculty:"Computer Science",
year:"3",
email:"amal@gmail.com",
phone:"0771234567",
hostel:"Arunachalam Hall",
room:"203",
status:"Allocated"
},

{
id:"CS002",
name:"Nimal Silva",
faculty:"Computer Science",
year:"2",
email:"nimal@gmail.com",
phone:"0769876543",
hostel:"Hindu Hall",
room:"105",
status:"Allocated"
},

{
id:"IT001",
name:"Kamal Fernando",
faculty:"Information Technology",
year:"1",
email:"kamal@gmail.com",
phone:"0712345678",
hostel:"New Hostel",
room:"302",
status:"Pending"
}

];



export default function Students(){


const [search,setSearch]=useState("");

const [selected,setSelected]=useState(null);



const filteredStudents = students.filter((student)=>

student.id
.toLowerCase()
.includes(search.toLowerCase())

);



return(

<div className="p-6">


<h1 className="text-3xl font-bold text-[#101c5c] mb-6">

Students

</h1>




<div className="bg-white shadow rounded-xl p-5">



<input

type="text"

placeholder="Search Student ID"

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="border rounded-xl px-4 py-3 w-full md:w-96 mb-6"

/>





<table className="w-full">


<thead>

<tr className="bg-slate-100">


<th className="p-3 text-left">
Student ID
</th>


<th className="p-3 text-left">
Name
</th>


<th className="p-3 text-left">
Faculty
</th>


<th className="p-3 text-left">
Year
</th>


<th>
Action
</th>


</tr>

</thead>




<tbody>


{

filteredStudents.map((student)=>(


<tr key={student.id} className="border-b">


<td className="p-3">
{student.id}
</td>


<td className="p-3">
{student.name}
</td>


<td className="p-3">
{student.faculty}
</td>


<td className="p-3">
{student.year}
</td>


<td className="text-center">


<button

onClick={()=>setSelected(student)}

className="bg-[#101c5c] text-white px-4 py-2 rounded-lg"

>

View

</button>


</td>


</tr>


))

}


</tbody>



</table>



</div>





{

selected &&

<StudentDetails

student={selected}

close={()=>setSelected(null)}

/>

}



</div>


)

}