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
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"
import { useSelector } from 'react-redux';
import { Tag } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Star } from 'lucide-react';
import * as React from "react"
import { Button } from "./components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Card,
    //   CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet"
import DatePicker from "react-datepicker"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useState } from "react"
import { Locate } from "lucide-react"
import Maps from "./Maps"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSpotData } from './slice/SpotDetailSlice';
import { format } from "date-fns";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import { useEffect } from "react";
import { LOGIN } from "./actions/action-type";
import axios from "./config/axios";
export default function Search() {

    let mydispatch = useDispatch()
    let mynavigate = useNavigate()

    let {authdispatch, userDetails} = useContext(AuthContext)
    console.log('userDetails', userDetails)

    let { data, loading, userrequest } = useSelector((state) => state.searchBranch)
    console.log('kk', data)
    console.log('kk', loading)
    console.log('kk', userrequest)

    let k = useSelector((state) => state.spotBranch)
    console.log("hello inside search page", loading)
    console.log("hello inside search page", data)

    let handleSpotDetails = async (detials) => {
        console.log('detail', detials)
        if (detials.status == 'pending') {
            setAlertopen(true)
        }
        else {
            await mydispatch(setSpotData(detials))
            mynavigate('/spotdetails')
        }


    }

    //suggestion list control
    let [open, setOpen] = useState(false)

    const [aletopen, setAlertopen] = useState(false)


    //sheet control
    const [popdown, setPopdown] = useState(false);
    let [searchinfo, setSearchinfo] = useState({
        location: '',
        startTime: '',
        endTime: ''
    })

    //    let k =  datas,forEach(element=> elem)
    let handleSelect = (value) => {
        console.log(value)
        setOpen(false)
    }
    let handleFocus = (event) => {
        if (window.innerWidth <= 768) {
            setPopdown(!popdown)
        }
        else {
            setOpen(!open)
        }
    }
    //      let starttime= format(new Date(userrequest.startTime), "dd/MM/yyyy h:mm a")

    //    console.log('jaHira', starttime)

    useEffect(() => {
        async function reload() {
            try {
                let result = await axios.get('./account', { headers: { Authorization: localStorage.getItem('token') } })
                console.log('useeffcet test', result.data)
                authdispatch({ type:LOGIN, payload: result.data })
            } catch (error) {
                // mynavigate("/login")
                console.log('inside error', error )

            }

        }
        reload()
    },[])

    return (
        <div className="container-fluid page">

            {/* {JSON.stringify(data)} */}

            <p>{searchinfo.location}</p>
            <div className="flex">
                <div className="relative grow border-2 rounded-lg sm:hidden md:block">
                    <Command className="[&_.border-b]:border-b-0">
                        <CommandInput onFocus={(event) => handleFocus(event)} value={userrequest.details.address} placeholder="Type a command or search..." />
                        {/* {open && <CommandList className='absolute z-10   w-[inherit] top-[60px]'>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                <CommandItem>
                                    <Locate />
                                    <span>Use current location</span>
                                </CommandItem>
                                <CommandItem onSelect={(value) => { handleSelect(value) }}>Calendar</CommandItem>
                                <CommandItem>Search Emoji</CommandItem>
                                <CommandItem>Calculator</CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Settings">
                                <CommandItem>Profile</CommandItem>
                                <CommandItem>Billing</CommandItem>
                                <CommandItem>Settings</CommandItem>
                            </CommandGroup>
                        </CommandList>} */}
                    </Command>
                </div>
                <div className="flex ">

                    <div className="border rounded-xl ms-2 mr-2 hidden lg:block">
                        <p className="text-sm text-start font-bold text-blue-600 ps-2">From</p>
                        {<DatePicker minDate={new Date()} minTime={new Date()} maxTime={new Date().setHours(23, 59)} selected={new Date()} showTimeSelect dateFormat="Pp"
                            className="mt-0 pt-0  rounded m-2  rounded-xl"
                            onSelect={(value) => console.log(value)}
                            value={format(new Date(userrequest.startTime), "dd/MM/yyyy h:mm a")}

                        />}

                    </div>
                    <div className="border rounded-xl hidden lg:block">
                        <p className="text-sm text-start font-bold text-blue-600 ps-2">Until</p>
                        {<DatePicker minDate={new Date()} minTime={new Date()} maxTime={new Date().setHours(23, 59)} selected={new Date()} showTimeSelect dateFormat="Pp"
                            className="mt-0 pt-0  rounded m-2  rounded-xl"
                            value={format(new Date(userrequest.endTime), "dd/MM/yyyy h:mm a")}
                        />}

                    </div>

                </div>

            </div>
            {/* sheet  popup */}
            <Sheet open={popdown} onOpenChange={setPopdown} >
                <SheetContent side='top' >
                    <div>
                        <div className="relative grow border-2 rounded-lg">
                            <Command className="[&_.border-b]:border-b-0">
                                {/* onFocus={(event) => handleFocus(event)} */}
                                <CommandInput onFocus={() => setOpen(true)} placeholder="Type a command or search..." />
                                {open && <CommandList className='absolute z-10  bg-white  w-[inherit] top-[45px]'>
                                    <CommandEmpty>No results found.</CommandEmpty>

                                    <CommandGroup heading="Suggestions">
                                        <CommandItem>
                                            <Locate />
                                            <span>Use current location</span>
                                        </CommandItem>
                                        <CommandItem onSelect={(value) => { handleSelect(value) }}>Calendar</CommandItem>
                                        <CommandItem>Search Emoji</CommandItem>
                                        <CommandItem>Calculator</CommandItem>
                                    </CommandGroup>
                                    <CommandSeparator />
                                    <CommandGroup heading="Settings">
                                        <CommandItem>Profile</CommandItem>
                                        <CommandItem>Billing</CommandItem>
                                        <CommandItem>Settings</CommandItem>
                                    </CommandGroup>
                                </CommandList>}
                            </Command>
                        </div>
                    </div>

                    <div className="border rounded-xl mt-2 mb-2 ">
                        <p className="text-sm text-start font-bold text-blue-600 ps-2">From</p>
                        {<DatePicker minDate={new Date()} minTime={new Date()} maxTime={new Date().setHours(23, 59)} selected={new Date()} showTimeSelect dateFormat="Pp"
                            className="mt-0 pt-0  rounded m-2  rounded-xl"
                            onSelect={(value) => console.log(value)}
                        />}
                    </div>
                    <div className="border rounded-xl ">
                        <p className="text-sm text-start font-bold text-blue-600 ps-2">Until</p>
                        {<DatePicker minDate={new Date()} minTime={new Date()} maxTime={new Date().setHours(23, 59)} selected={new Date()} showTimeSelect dateFormat="Pp"
                            className="mt-0 pt-0  rounded m-2  rounded-xl"
                        />}
                    </div>
                </SheetContent>


            </Sheet>
            <div className='flex flex-col lg:flex-row'>
                
                <ScrollArea className="h-[100vh] w-[350px] rounded-md border p-4">


                    {loading ?

                        <div className="flex flex-col items-center gap-4">
                            <Button disabled size="sm">
                                Finding Parking Space<Spinner />
                            </Button>
                        </div>

                        :


                        data.map(data => <Card disabled='true' onClick={() => handleSpotDetails(data)} className='mt-2 transition-transform duration-300 hover:scale-105 hover:bg-gray-100'>
                            <CardHeader >
                                <div className='flex justify-between'>
                                    <div>
                                        <CardTitle className='text-start'>#{data._id}</CardTitle>
                                        <CardTitle className='p-1 m-1  rounded-md table bg-green-600 border-xl text-white'>4<Star className='inline text-white ms-1 me-1' size={10} /></CardTitle>
                                    </div>
                                    <CardTitle className='text-start bg-blue-300 text-blue-600 text-center rounded-md p-1'>{data.KiloMeter}<p>KM</p></CardTitle>

                                </div>
                                <CardDescription className='text-start'><MapPin size={20} className='inline' /> {data.address}</CardDescription>

                            </CardHeader>

                            <CardFooter className='flex justify-between'>
                                <div className='flex'>
                                    <Tag size={20} className='text-green-300 ' />
                                    <p className='scroll-m-20 border-b pb-2 text-1xl font-semibold tracking-tight first:mt-0'><IndianRupee className='inline' size={20} />{data.amount}/Hrs</p>
                                </div>
                                {/* <p className='text-green-500 scroll-m-20 border-b pb-2 text-1xl font-semibold tracking-tight first:mt-0'>{data.isAvailable ? <p className="text-green-500">Avaialble</p> : <p className="text-red-500">Rent out</p>}</p> */}
                                {/* <p className='text-green-500 scroll-m-20 border-b pb-2 text-1xl font-semibold tracking-tight first:mt-0'>{data.status}</p> */}
                                {data.status === 'pending' && (
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button className='text-orange-600' variant="ghost">Pending</Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Admin has to verify the spot</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                )}

                                {data.status === 'Reserved' && (<Button className='text-red-400' variant="ghost">Reserved</Button>)}

                                {(data.status === 'Not Reserved' || data.status === 'Accept') && <Button className='text-green-600' variant="ghost">Available</Button>}

                            </CardFooter>
                        </Card>)}
                </ScrollArea>
                <div className='grow h-screen bg-blue-200 mt-6'>
                    {data && <Maps/>}
                </div>
            </div>

            {/* alert */}
            <AlertDialog open={aletopen} onOpenChange={setOpen}>
                <AlertDialogContent className="z-[9999]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Booking Pending</AlertDialogTitle>
                        <AlertDialogDescription>
                            This slot is currently under review.
                            Please wait while we confirm the availability.
                            Our team will contact you shortly.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setAlertopen(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


        </div>
    )
}