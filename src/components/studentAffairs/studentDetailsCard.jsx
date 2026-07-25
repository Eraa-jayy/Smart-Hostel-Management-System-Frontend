import React from "react";


export default function StudentDetails({student,close}){


return(

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white rounded-2xl w-[450px] p-6 shadow-xl">


<h2 className="text-2xl font-bold text-[#101c5c] mb-5">

Student Details

</h2>



<div className="space-y-3">


<p>
<b>Student ID:</b> {student.id}
</p>


<p>
<b>Name:</b> {student.name}
</p>


<p>
<b>Faculty:</b> {student.faculty}
</p>


<p>
<b>Year:</b> {student.year}
</p>


<p>
<b>Email:</b> {student.email}
</p>


<p>
<b>Phone:</b> {student.phone}
</p>


<p>
<b>Hostel:</b> {student.hostel}
</p>


<p>
<b>Room:</b> {student.room}
</p>


<p>
<b>Status:</b> {student.status}
</p>



</div>




<button

onClick={close}

className="mt-6 w-full bg-red-500 text-white py-3 rounded-xl"

>

Close

</button>



</div>


</div>


);


}