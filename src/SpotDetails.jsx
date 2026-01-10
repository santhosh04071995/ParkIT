import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import DatePicker from "react-datepicker";
import { useSelector } from "react-redux"
import { AlarmClock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button"
import "leaflet/dist/leaflet.css";
import { useContext, useEffect, useState } from "react";
import { addHours, format } from "date-fns";
import axios from "./config/axios";
import AuthContext from "./context/AuthContext";
import { LOGIN } from "./actions/action-type";


export default function SpotDetails() {

  let {userDetails,authdispatch} = useContext(AuthContext)
  console.log('userDetails', userDetails)

    const [dialog, setDialog] = useState({
  open: false,
  title: "",
  message: "",
  type: "info", 
})

    let min_hr = addHours(new Date(), 2)
     let  {data} = useSelector((state)=> state.spotBranch)
             console.log('spotData',data)
        const position = [51.505, -0.09]
        let [booking, setBooking] =useState ({
                                        slots:null,
                                        startTime: new Date(),
                                        endTime: min_hr
                                    })
        

         useEffect(()=> {
            async function bookings(){
                try {
                    let result = await axios.get(`/bookingslot/${data._id}`,{headers:{Authorization:localStorage.getItem('token')}}) 
                    console.log('slot', result.data)
                    setBooking({...booking,slots:result.data})
                } catch (error) {
                  console.log(error)  
                }
            }
            bookings()
            
         },[])

         //relading after login
         useEffect(() => {
                 async function reload() {
                     try {
                         let result = await axios.get('./account', { headers: { Authorization: localStorage.getItem('token') } })
                         console.log('useeffcet test', result.data)
                         authdispatch({ type: LOGIN, payload: result.data })
                     } catch (error) {
                       console.log('inside error', error)
         
                     }
         
                 }
                 reload()
             }, [])
         
         let handleSubmit = async(event)=> {
            event.preventDefault()
            console.log('hello', data._id)
            try {
                let result = await axios.post(`/book/${data._id}`,booking,{headers:{Authorization:localStorage.getItem('token')}} )
                console.log('result', result.data)
                setBooking({...booking,slots:result.data})
                setDialog({
                            open: true,
                            title: "Booking Successful",
                            message:
                                "Your parking slot has been booked successfully. You can view the booking details in your dashboard.",
                            type: "success",
                            })

            } catch (error) {
                    setDialog({
                                open: true,
                                title: "Booking Failed",
                                message:
                                    error.response?.data?.message ||
                                    "Something went wrong. Please try again later.",
                                type: "error",
                                })
                
            }
         }
         
    return (
        <div className="container-fluid page">
            {/* {JSON.stringify(data)} */}
            {/* imaga section */}
            <div className="w-[80%] h-[400px] border-1 flex border border-black  rounded-xl m-auto" >
                <img className="[height:75%] w-50 m-auto" src={data.image} alt="" />
            </div>
            {/* imaga section end */}

            <div className="lg:flex justify-between w-[80%]   m-auto mt-10 ">
                {/* address and payment section */}
                <div className="text-start my-2" >
                    <h2 className="w-full scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        #{data._id} Parking
                    </h2>
                    <h4 className="my-2 scroll-m-20 text-xl font-medium tracking-tight">
                        Address :-
                    </h4>
                    <p className="font-semibold"> {data.address}</p>
                    
                      
                    <p className="font-semibold">Price: ₹{data.amount} / 2 hrs    </p>
                    <p className="font-semibold">Discount: 15%    </p>

                    <hr  className="my-4"/>
                    {/* accessibility */}
                    <div className="my-10 ">
                        <h3 className=" my-[20px]  scroll-m-20 text-2xl font-semibold tracking-tight">
                            What this place offers?
                        </h3>
                        <div className=" transition-all duration-300 hover:scale-110 shadow-md border  w-[150px]  rounded-xl p-2">
                            <div className="flex flex-row justify-between  items-center">
                                <AlarmClock className="text-blue-500" />
                                <p className="w-[100px] text-orange-500 font-bold">24 Hours Access</p>
                            </div>

                        </div>
                    </div>
                    {/* ens of accessibility */}

                </div>
                {/* end of  address section */}

                {/* amount info */}
                <div className="max-w-sm rounded-2xl border shadow-md p-5 bg-white relative">
                    {/* Discount Ribbon */}
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-xl">
                        15% OFF
                    </div>


                    {/* Price */}
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 line-through text-lg">₹{data.amount}</span>
                        <span className="text-2xl font-bold">₹{data.discount}</span>
                    </div>


                    {/* Rating */}
                    <div className="flex text-yellow-400 mt-2">
                        ★★★★☆
                    </div>


                    <hr className="my-4" />


                    {/* Breakdown */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>₹{data.amount} x ({data.TimeScale}hrs) </span>
                            <span>₹{data.amount - data.discount/100}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>- ₹{data.amount*15/100}</span>
                            <span>Discount</span>
                        </div>
                    </div>


                    <hr className="my-4" />


                    {/* Total */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{(data.amount-(data.amount*15/100))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center gap-1">
                                Conv. fee <span className="text-xs text-gray-500">(One time)</span>
                            </span>
                            <span>+ ₹20</span>
                        </div>
                    </div>


                    {/* Status */}
                    {/* <div className="flex items-center gap-2 mt-4 text-red-500 text-sm font-medium">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Rented Out
                     </div> */}


                    {/* Button */}
                    {/* <button className="w-full mt-4 bg-yellow-300 hover:bg-yellow-400 transition rounded-xl py-2 font-medium">
                        Notify me
                    </button> */}

                    {data.status === 'Reserved' && (
                      <button className="w-full mt-4 bg-red-400 hover:bg-red-500 text-white transition rounded-xl py-2 font-medium">
                        Reserved
                    </button>)}
                    {(data.status === 'Not Reserved' || data.status === 'Accept') && 
                    <button className="w-full mt-4 bg-yellow-300 hover:bg-yellow-400 transition rounded-xl py-2 font-medium">
                        Available
                    </button>
                    }
                </div>
            </div>
            
            {/* time slots */}
            
            <div className="my-3">

                    <h1 className="font-semibold">This parking slot is reserved today's time periods listed below. 
                You may book this slot for any other available time outside these reserved intervals.</h1>
                
                
                <form className="my-2 bg-gray-100 p-3 rounded"  onSubmit={handleSubmit}>
                 <Label className="block lg:inline" htmlFor="Entry Time">Entry Time</Label>    
                        <DatePicker minDate={new Date()} minTime={new Date()} maxTime={new Date().setHours(23, 59)} 
                            selected={booking.startTime} onChange={(d) =>setBooking({ ...booking, startTime: d})} showTimeSelect dateFormat="Pp"
                            value={booking.startTime} className="border p-2 rounded m-2 shadow-xl rounded-xl"/>
                  <Label className="block lg:inline" htmlFor="Exit Time">Exit Time</Label>
                        <DatePicker minDate={booking.startTime} minTime={min_hr} maxTime={new Date().setHours(23, 59)} 
                            selected={booking.endTime} onChange={(d) =>setBooking({ ...booking, endTime: d})} showTimeSelect dateFormat="Pp"
                            className="border p-2 rounded m-2 shadow-xl rounded-xl"/>
                    
                        <input type="submit" className="w-full mt-4 bg-yellow-300 hover:bg-yellow-400 transition rounded-xl py-2 font-medium" value="Book Now"  />
                 </form>
            </div>
               
                
                

                <div className="my-6 overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            {/* <th className="px-6 py-3 text-left font-medium">Date</th> */}
            <th className="px-6 py-3 text-left font-medium">Entry Time</th>
            <th className="px-6 py-3 text-left font-medium">Exit Time</th>
            <th className="px-6 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        
        {booking.slots && 
        <tbody className="divide-y">
          {booking.slots.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {/* <td className="px-6 py-4">{item.date}</td> */}
              {/* {item.booking_starttime} */}
              {/* value={format(new Date(userrequest.startTime), "dd/MM/yyyy h:mm a")} */}
              <td className="px-6 py-4 text-left">{ format (new Date(item.booking_starttime), "dd/MM/yyyy h:mm a")}</td>
              <td className="px-6 py-4 text-left">{ format (new Date(item.booking_endtime), "dd/MM/yyyy h:mm a")}</td>
              <td className="px-6 py-4 text-left">
                {item.status == "Not Reserved" && <p className="inline-flex rounded-full px-3 py-1 text-xs font-medium
                bg-yellow-300 text-yellow-700">Completed</p>  }

                  {(item.status == "active" || item.status == "Reserved") && <p className="inline-flex rounded-full px-3 py-1 text-xs font-medium
                bg-red-300 text-yellow-700">Reserved</p>  }
                
              </td>
            </tr>
          ))}
        </tbody>
        }
      </table>
    </div>
            

                {/* {booking.slots &&  <h1>slot is present</h1> } */}
        
            <h3 className=" my-[20px]  scroll-m-20 text-2xl font-semibold tracking-tight">
                How to get here?
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                The provided address is for reference only. For the exact location, book the spot now and our team will share the precise address with you!
            </p>

            <div className="w-[80%] m-auto my-6">
  <div className="h-[300px] w-full rounded-xl overflow-hidden">
    <MapContainer
      center={data.position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={data.position}>
        <Popup>
            <div>
                                       <span> #{data._id}</span> <br/>
                                        <span>{data.address}</span> <br/>
                                        <span className="bg-red-300 p-1 rounded text-red-800 font-bold">{data.status}</span><br/>
                                        <span className="font-bold">Distance:-</span>{data.KiloMeter}<br/>
                                        <span className="font-bold">Rent:-</span>{data.amount} Rs <br/>
                                        <div className="flex flex-row mt-2 justify-between">
                                         <Button variant="outline" className='font-bold m-auto'>
                                            <a
                                                    href={`https://www.google.com/maps/dir/?api=1&origin=${data.currentLocation[0]},${data.currentLocation[1]}&destination=${data.position[0]},${data.position[1]}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                            >
                                            Navigate
                                            </a>
                                               
                                         </Button>   
                                         {/* <Button onClick={()=>handleSpotDetails(element)} variant="outline" className='font-bold'>View spot</Button> */}
                                        </div>
                                </div>
        </Popup>
      </Marker>
    </MapContainer>
  </div>
</div>

      <AlertDialog open={dialog.open} onOpenChange={(open) =>
  setDialog({ ...dialog, open })
}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle
        className={
          dialog.type === "success"
            ? "text-green-600"
            : dialog.type === "error"
            ? "text-red-600"
            : "text-blue-600"
        }
      >
        {dialog.title}
      </AlertDialogTitle>

      <AlertDialogDescription>
        {dialog.message}
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogAction>OK</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

           

        </div>
    )
}