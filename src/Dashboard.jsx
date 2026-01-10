import { LOGIN } from "./actions/action-type";
import { Spinner } from "@/components/ui/spinner"
import { useSelector, useDispatch } from 'react-redux';
import { ArrowRight, ThumbsUp, Gem, CircleParking } from 'lucide-react';
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

import { Locate } from 'lucide-react';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Card,
  //   CardAction,
  CardContent,

  CardFooter

} from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import axios from './config/axios';
import { addHours, addMinutes, format } from 'date-fns';
import { searchspace, setData } from './slice/userSearchSlice';
import ChatBot from "./Chatbot";
import AuthContext from "./context/AuthContext";
export default function Dashboard() {
  let navigate = useNavigate()
 
  //fetching apikey for locationIQ
   const key = import.meta.env.VITE_LOCATIONIQ_API_KEY;

   let {userDetails,authdispatch} = useContext(AuthContext)
    console.log('userDetails', userDetails)

  let min_hr = addHours(new Date(), 2)

  let [open, setOpen] = useState(false);

  let [resultarray, setResultarray] = useState(null)
  let [searchResult, setSearchResult] = useState(true)

  let [input, setInput] = useState({
    isloading:false,
    data:''
  })
  
  let [dashinfo, setDashinfo] = useState({
    details: null,
    startTime: new Date(),
    endTime: ""
  })


  console.log('hello', dashinfo)

  useEffect(() => {
    async function fetchList() {
      let result = await axios.get(`https://api.locationiq.com/v1/autocomplete?key=${key}&q=${input.data}`)
      setResultarray(result.data)
    }
    if (input.data.length > 4) {
      fetchList()
      setSearchResult(false)
    }
    else {
      setSearchResult(true)
    }

  }, [input.data])


  // getting details of user after reload page
  useEffect(()=> {
      async function reload(){
          try {
              let result = await axios.get('./account',{headers:{Authorization:localStorage.getItem('token')}})
              if(result.data == null){
                navigate('/register')
              }
              else{
                console.log('useeffcet test', result.data)
           authdispatch({type:LOGIN,payload:result.data})
              }
                
            // if(Object.entries(dashinfo.details).length == 0){
            //   navigate('/register')
            // } 
            console.log('byee', Object.entries(dashinfo.details).length) 
          } catch (error) {
              // mynavigate("/login")
              
          }
             
       }
          reload()
      },[])

  //handle select and close suggesstion
  let handleSelect = (value) => {
    console.log(value)
    setInput({...input,data:value.display_address})
    let obj = {}
    obj.address = value.display_address
    obj.pincode = value.address.postcode
    obj.longitude = value.lon
    obj.latitude = value.lat
    // console.log(obj)
    setDashinfo({ ...dashinfo, details: obj })

    setOpen(false)

  }

  let dispatch = useDispatch()


  let submitHandler = async (event) => {
    event.preventDefault()
    console.log('dashinfo', dashinfo)
     dispatch(searchspace(dashinfo))
     
     dispatch(setData(dashinfo))
     //navigate('/search')
     let token = localStorage.getItem('token')
     console.log('token', token)
     if(token == null){
      navigate('/login')
     }
     else{
        navigate('/search')
     }
  }

  let getLocation = () => {
    console.log('clicked in console')
    navigator.geolocation.getCurrentPosition(async (position) => {
      setInput({...input,isloading:true})
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(latitude + longitude)
      let API_KEY = import.meta.env.VITE_REVERSE_GEOCODE_API_KEY

      let result = await axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${API_KEY}`)
      console.log(result.data)
      setInput({...input,data:result.data.display_name,isloading:false})
      let obj = {}
      obj.address = result.data.display_name
      obj.pincode = result.data.address.postcode
      obj.longitude = result.data.lon
      obj.latitude = result.data.lat
      setDashinfo({ ...dashinfo, details: obj })

    },
      (error) => {
        console.error("Error getting location:", error.message);
      })
  }

  

  return (
    <div className="container-fluid min-h-dvh">
      {/* {JSON.stringify(userDetails)} */}
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-start lg:text-center ">
            <span className="text-blue-600 "> The smarter way </span> to find parking
          </h1>
          <div className='lg:flex justify-center items-center mt-3 hidden'>
            <p className='font-medium mx-2 flex '><Gem size='22' className='text-blue-600  mx-1'/>Best price guarantee</p>
            <p className='font-medium mx-2 flex '><ThumbsUp size='22' className='text-blue-600  mx-1' />Trusted by 13m+ drivers</p>
            <p className='font-medium mx-2 flex '><CircleParking size='22' className='text-blue-600  mx-1' />Trusted by 13m+ drivers</p>
          </div>
          <p className='text-muted-foreground text-xl my-1 text-start lg:text-center'>
            Thousands of reservable spaces located right where you need them. Join over 13 million drivers and enjoy stress-free, cheaper parking.
          </p>
      
      {/* div for form and image */}
      <div className='flex flex-col-reverse  lg:flex-row justify-between   items-center  my-2'>
        <div className=' grow'>
          
          <Card className="sm:w-full lg:w-3/4 mt-5 pt-5 m-auto bg-blue-300">
          <form onSubmit={submitHandler}>
            <CardContent>

              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="search location" value={input.data} onValueChange={(value) => setInput({...input,data:value})} onFocus={() => {
                  console.log('focus')
                  setOpen(true)
                   
                }} />
                <CommandList className={open ? 'block' : 'hidden'} >
                  {input.isloading && <Spinner className='m-auto' /> }
                  {searchResult && <CommandEmpty > Seaching....</CommandEmpty>}
                  <CommandGroup heading="Suggestions"  >
                    <CommandItem onSelect={getLocation}>
                      <Locate />
                      <span>Use current location</span>
                    </CommandItem>


                    {resultarray && resultarray.map(element => <CommandItem className="break-anywhere"
                      key={element.place_id} value={`${element.display_address}`} onSelect={() => { handleSelect(element) }}
                    >
                      <MapPin />
                      <p className='text-start'>{element.display_address} </p>
                    </CommandItem>
                    )}

                  </CommandGroup>
                  <CommandSeparator />
                </CommandList>
              </Command>

             
              <div className="d-flex flex-row mt-5 sm:flex-col">
                <Label className='text-end w-full' >Start Time</Label>
                <DatePicker minDate={new Date()} minTime={new Date()} maxTime={new Date().setHours(23, 59)} 
                  selected={dashinfo.startTime} onChange={(d) =>setDashinfo({ ...dashinfo, startTime: d})} showTimeSelect dateFormat="Pp"
                  className="border p-2 rounded m-2 shadow-xl rounded-xl"/>

                <div className='sm:block  my-3 '>
                  <ArrowRight className='text-white   m-auto' size={20} />
                </div>

                <Label className='text-start sm-block'>End Time</Label>
                <DatePicker minDate={dashinfo.startTime} placeholderText='Exit Time' minTime={min_hr} maxTime={new Date().setHours(23, 59)}
                  selected={dashinfo.endTime} onChange={(d) => setDashinfo({ ...dashinfo, endTime: d })} showTimeSelect dateFormat="Pp"
                  className="border p-2 rounded m-2 shadow-xl rounded-xl "
                />
              </div>
            </CardContent>
            <CardFooter className=
              "flex-col gap-2">
              <Button type="submit" className="w-full bg-orange-400 hover:bg-gray-300">
                Show parking space
              </Button>

            </CardFooter>
          </form>
          </Card> 
        </div>
        

      
        
        {/* image */}
        <div className='w-full lg:w-[60%]'>
          <img  className=' w-full h-full  ' src="src/assets/homepage_image.jpg" alt="homepage" />
        </div>
      </div>
      
                   <ChatBot classNam='bg-red-300' />
      {/* parking made essy */}
      <section className="w-full py-16 bg-white">
      {/* Title */}
      <h2 className="text-center text-3xl font-semibold text-blue-600 mb-14">
        Parking made easy
      </h2>

      {/* Features */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
        
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-red-100 flex items-center justify-center mb-6">
            <img
              src="src/assets/location.jpg"
              alt="Location"
              className="w-16 h-16 "
            />
          </div>

          <h3 className="text-blue-600 text-xl font-semibold mb-3">
            Wherever, whenever
          </h3>

          <p className="text-gray-600 leading-relaxed">
            Choose from millions of spaces across the UK
            <br />
            <br />
            Find your best option for every car journey
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-green-100 flex items-center justify-center mb-6">
            <img
              src="src/assets/location.jpg"
              alt="Payment"
              className="w-16 h-16"
            />
          </div>

          <h3 className="text-blue-600 text-xl font-semibold mb-3">
            Peace of mind
          </h3>

          <p className="text-gray-600 leading-relaxed">
            View information on availability, price
            <br />
            and restrictions
            <br />
            <br />
            Reserve in advance at over 45,000+ locations
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-green-100 flex items-center justify-center mb-6">
            <img
              src="src/assets/location.jpg"
              alt="Directions"
              className="w-16 h-16"
            />
          </div>

          <h3 className="text-blue-600 text-xl font-semibold mb-3">
            Seamless experience
          </h3>

          <p className="text-gray-600 leading-relaxed">
            Pay for ParkIT spaces via the app or website
            <br />
            <br />
            Follow easy directions and access instructions
          </p>
        </div>

      </div>
    </section>

    </div>
  )
}