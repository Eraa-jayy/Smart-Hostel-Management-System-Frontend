import React, { useState } from "react";
import { createHostel } from "../../service/hostelService";


export default function Hostel() {


    const [formData, setFormData] = useState({

        hostelName: "",
        hostelType: "",
        location: "",
        totalCapacity: ""

    });


    const [message, setMessage] = useState("");



    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value

        });

    };



    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            const response = await createHostel({

                hostelName: formData.hostelName,

                hostelType: formData.hostelType,

                location: formData.location,

                totalCapacity: Number(formData.totalCapacity)

            });



            console.log(
                "Created Hostel:",
                response.data
            );


            setMessage(
                "Hostel created successfully"
            );


        } catch(error) {


            console.log(error);

            setMessage(
                "Failed to create hostel"
            );

        }

    };




    return (

        <div className="p-8">


            <h1 className="text-3xl font-bold mb-6">
                Hostel Management
            </h1>



            <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg">


                <h2 className="text-xl font-semibold mb-4">
                    Create Hostel
                </h2>



                <form onSubmit={handleSubmit}>


                    <input

                        name="hostelName"

                        value={formData.hostelName}

                        onChange={handleChange}

                        placeholder="Hostel Name"

                        className="w-full border p-3 rounded mb-3"

                    />



                    <select

                        name="hostelType"

                        value={formData.hostelType}

                        onChange={handleChange}

                        className="w-full border p-3 rounded mb-3"

                    >

                        <option value="">
                            Select Type
                        </option>

                        <option value="MALE">
                            Male
                        </option>

                        <option value="FEMALE">
                            Female
                        </option>


                    </select>




                    <input

                        name="location"

                        value={formData.location}

                        onChange={handleChange}

                        placeholder="Location"

                        className="w-full border p-3 rounded mb-3"

                    />




                    <input

                        type="number"

                        name="totalCapacity"

                        value={formData.totalCapacity}

                        onChange={handleChange}

                        placeholder="Total Capacity"

                        className="w-full border p-3 rounded mb-4"

                    />




                    <button

                        type="submit"

                        className="bg-blue-700 text-white px-6 py-3 rounded"

                    >

                        Create Hostel

                    </button>



                </form>



                {
                    message &&

                    <p className="mt-4">
                        {message}
                    </p>
                }


            </div>


        </div>

    );

}