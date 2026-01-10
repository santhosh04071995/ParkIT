import { LOGIN } from "./actions/action-type";
import { Toaster, toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    User,
    ShieldCheck,
    CreditCard,
    Headphones,
    Sliders,
    TrendingUp,
    Clock,
} from "lucide-react";

import { Spinner } from "@/components/ui/spinner"
import { useSelector, useDispatch } from 'react-redux';
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

import { Locate } from 'lucide-react';
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
import { Button } from "@/components/ui/button"
import {
    Card,
    //   CardAction,
    CardContent,

    CardFooter

} from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import axios from './config/axios';
import { searchspace, setData } from './slice/userSearchSlice';
import ChatBot from "./Chatbot";
import AuthContext from "./context/AuthContext";

import { MapPin } from 'lucide-react';

export default function AddParking() {
    let mynavigate = useNavigate()

    let {authdispatch} = useContext(AuthContext);
       let [confirm,setConfirm] = useState({
        btnevent:false,
        popup:false
       })

       console.log(confirm)
    
    const points = [
        {
            icon: <User size={20} />,
            text: "Trusted by 1000+ Happy Spot Owners across India.",
        },
        {
            icon: <ShieldCheck size={20} />,
            text: "Safe and Verified Renters",
        },
        {
            icon: <CreditCard size={20} />,
            text: "Hassle-free payments.",
        },
        {
            icon: <Headphones size={20} />,
            text: "Dedicated Support – Always on Call.",
        },
        {
            icon: <Sliders size={20} />,
            text: "Complete Control Over Your Parking Space.",
        },
        {
            icon: <TrendingUp size={20} />,
            text: "Zero Listing Fees, Maximum Earnings.",
        },
        {
            icon: <Clock size={20} />,
            text: "Earn Daily, Weekly, or Monthly – You Choose.",
        },
    ];
   
    let [details,setDetails] = useState({
        uname: '',
        mobile:'',
        email:'',
        pincode:'',
        amount : '',
        size:'',
        security :'',
        address:'',
        addressData:null,
        image:null
        
    })
    
    let { userDetails } = useContext(AuthContext)
    let [resultarray, setResultarray] = useState(null)
    let [searchResult, setSearchResult] = useState(true)
    

    
    let navigate = useNavigate()
    const key = import.meta.env.VITE_LOCATIONIQ_API_KEY;

    
    let [open, setOpen] = useState(false);
    
    let [input, setInput] = useState({
        isloading: false,
        data: ''

    })
    
    // let [dashinfo, setDashinfo] = useState({
    //     details: null,
    //     startTime: new Date(),
    //     endTime: ""

    // })

    useEffect(() => {
        // console.log(input.data)
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
        // console.log('useeffcet test', result.data)
         authdispatch({type:LOGIN,payload:result.data})    
        } catch (error) {
            mynavigate("/login")
            
        }
           
     }
        reload()
    },[])

    //handle select and close suggesstion
    let handleSelect = (value) => {
        console.log(value)
        setInput({ ...input, data: value.display_address })
        let obj = {}
        obj.address = value.display_address
        obj.pincode = value.address.postcode
        obj.longitude = value.lon
        obj.latitude = value.lat
        console.log('test', obj)
        // setDashinfo({ ...dashinfo, details: obj })
        setDetails({...details,address:obj.address,  addressData:obj})
        setOpen(false)

    }

    let dispatch = useDispatch()


    let submitHandler = async (event) => {
        event.preventDefault()
        console.log('data', details)
        const formData = new FormData();

        formData.append("uname", details.uname);
        formData.append("mobile", details.mobile);
        formData.append("email", details.email);
        formData.append("pincode", details.pincode);
        formData.append("amount", details.amount);
        formData.append("size", details.size);
        formData.append("security", details.security);
        formData.append("address", details.address);
        formData.append("image", details.image);
        formData.append("latitude", details.addressData.latitude);
        formData.append("longitude", details.addressData.longitude)
            console.log('before', formData)
            setConfirm({...confirm, btnevent:true})
        try {
            let result = await axios.post('/owner', formData, {headers:{Authorization:localStorage.getItem('token')}})
            console.log(result.data)
            setConfirm({...confirm,popup:true,btnevent:false})
            setDetails({...details,uname:'', mobile:"", email:"", pincode:"", amount:'', size:'', security:'',
                address:'', addressData:null,image:'',  
            })
            setInput({...input,data:''})

        } catch (error) {
            console.log('error',error.message)     
            setConfirm({...confirm, btnevent:false})       
            toast.error('Something went wrog!!!')
        }
        
    }

    let getLocation = () => {
        console.log('clicked in console')
        navigator.geolocation.getCurrentPosition(async (position) => {
            setInput({ ...input, isloading: true })
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(latitude + longitude)
            let API_KEY = import.meta.env.VITE_REVERSE_GEOCODE_API_KEY

            let result = await axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${API_KEY}`)
            console.log(result.data)
            setInput({ ...input, data: result.data.display_name, isloading: false })
            let obj = {}
            obj.address = result.data.display_name
            obj.pincode = result.data.address.postcode
            obj.longitude = result.data.lon
            obj.latitude = result.data.lat
            console.log('hello', obj)
            // setDashinfo({ ...dashinfo, details: obj })
             setDetails({...details,address:result.data.display_name,  addressData:obj})

        },
            (error) => {
                console.error("Error getting location:", error.message);
            })
    }
    
    let handleOnchange = (event)=> {
        setDetails({...details,[event.target.name]:event.target.value})

    }
    return (
        
        <div className="container-fluid min-h-dvh">
            {/* headings */}
            {/* {JSON.stringify(userDetails)} */}
            <div>
                <h1 className="scroll-m-20 text-center text-4xl font-bold tracking-tight text-balance">Welcome to <span className="text-blue-600">Park</span><span className="text-orange-600">IT</span></h1>
                <h4 className="scroll-m-20 text-blue-600 font-semibold tracking-tight">
                    Let's turn your empty spot into Easy income!
                </h4>
            </div>

            {/* left and right  */}
            <div className="flex flex-col-reverse lg:flex-row my-6">
                <section className="max-w-4xl ">
                    {/* Heading */}
                    <h2 className="text-3xl text-start font-semibold text-blue-700 mb-10">
                        Why should you choose ParkIT?
                    </h2>

                    {/* List */}
                    <ul className="space-y-6">
                        {points.map((item, index) => (
                            <li key={index} className="flex items-start gap-5">
                                <div className="w-11 h-11 rounded-full border-2 border-yellow-400 flex items-center justify-center text-blue-600 shrink-0">
                                    {item.icon}
                                </div>
                                <p className="text-gray-800 font-medium leading-relaxed">
                                    {item.text}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
                <div className='flex flex-col-reverse  lg:flex-row justify-between   items-center  my-2 grow  '>
                    <div className='grow'>

                        <Card className="sm:w-full lg:w-3/4 mt-5 pt-5 m-auto bg-blue-300">
                            <form onSubmit={submitHandler}>
                                <CardContent>
                                    <div className="flex flex-col lg:flex-row justify-around items-baseline ">
                                        <div className="text-start my-2 ">
                                            <Label className='text-end'>Full Name</Label> <br/> 
                                            {/*  */}
                                            <input type="text" placeholder="Enter your full name" name= 'uname'  value={details.uname} 
                                                onChange={handleOnchange} 
                                                 className="w-[90%] p-2 px-5 lg:lg:mx-2 rounded" />
                                        </div>
                                        <div className="text-start">
                                            <Label className='text-end'>Mobile No.</Label><br/>
                                            <input type="text" placeholder="Enter Mobile Number" name="mobile"   value= {details.mobile} 
                                                onChange={handleOnchange} className="w-[90%] p-2 px-5 rounded " />
                                        </div>
                                    </div>
                                    <div className="flex flex-col lg:flex-row justify-around my-2 items-baseline ">
                                        <div className="text-start ">
                                            <Label className='text-end'>Email</Label> <br/>
                                            <input type="text" placeholder="Enter your Email" name="email"   value= {details.email}
                                             onChange={handleOnchange} className="w-[90%] p-2 px-5 lg:lg:mx-2  rounded" />
                                        </div>
                                        <div className="text-start">
                                            <Label className='text-end'>Pincode</Label><br/>
                                            <input type="text" placeholder="Enter your Pincode" name="pincode"   value= {details.pincode}
                                            onChange={handleOnchange}  className="w-[90%] p-2 px-5 rounded " />
                                        </div>
                                    </div>
                                    <div className="flex flex-col lg:flex-row justify-around my-2 items-baseline ">
                                        <div className="text-start ">
                                            <Label className='text-end'>Expected Rent</Label> <br/>
                                            <input type="Number" placeholder="Enter Amount" name="amount"   value= {details.amount}
                                            onChange={handleOnchange} className="w-[90%] p-2 px-5 lg:lg:mx-2  rounded" />
                                        </div>
                                        <div className="text-start">
                                            <Label className='text-end'>Parking Size</Label><br/>
                                            <select name="size" value={details.size} onChange={handleOnchange} class="w-[220px] p-2 px-5  rounded">
                                                <option value='' >Select size</option>
                                                <option value='Hatchback'>Hatchback </option>
                                                <option value="Compact SUV">Compact SUV </option>
                                                <option value="XUV">XUV</option>
                                            </select>

                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row justify-around my-2 items-baseline ">
                                        <div className="text-start">
                                            <Label className='text-end'>Google Map Link</Label><br/>
                                            {/* setDetails({...details,image:event.target.files[0]}) */}
                                            <input type="file" onChange={(event)=>setDetails({...details,image:event.target.files[0]})}  
                                                className="w-[90%] p-2 px-5 lg:mx-2 rounded" />
                                        </div>
                                        <div className="text-start ">
                                            <Label className='text-end'>Security</Label> <br/>
                                            <select name="security" value={details.security} onChange={handleOnchange} class=" w-[220px] p-2 px-5  rounded">
                                                <option value=''>Select security</option>
                                                <option value='Covered'>Covered</option>
                                                <option value='Gated'>Gated </option>
                                                <option value="Security Guard">Security Guard</option>
                                            </select>
                                        </div>
                                    </div>

                                    
                                    
                                    <div className="leading-none px-3">
                                        <Label className='block text-start py-2'>Current Address</Label><br/>
                                        <Command className="rounded-lg border shadow-md">
                                            <CommandInput placeholder="search location" name='address'  value={input.data}
                                            onValueChange={(value)=> setInput({...input, data:value})} 
                                            onFocus={() => {
                                                console.log('focus')
                                                setOpen(true)

                                            }} />
                                            
                                        
                                        <CommandList className={open ? 'block' : 'hidden'} >
                                            {input.isloading && <Spinner className='m-auto' />}
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
                                    </div>
                                    


                                    
                                </CardContent>
                                <CardFooter className=
                                    "flex-col gap-2">
                                    <Button type="submit" disabled={confirm.btnevent} className="w-full bg-orange-400 hover:bg-gray-300">
                                       {confirm.btnevent ? 'Please wait...': 'Submit'} 
                                    </Button>

                                </CardFooter>
                            </form>
                        </Card>
                    </div>





                </div>

            </div>




            {/* form */}


                    <AlertDialog open={confirm.popup}>
  {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className='text-blue-600'>Spot Added!!!</AlertDialogTitle>
      <AlertDialogDescription>
        The parking spot has been added to the queue successfully,
                    Our team will contact you soon to complete the verification.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
      <AlertDialogAction className='bg-orange-600' onClick={()=> setConfirm({...confirm,popup:false})}>OK</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
                    <Toaster richColors position="top-center" />
        </div>
    )
}