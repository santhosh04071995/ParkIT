
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
import { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import axios from "./config/axios"
import { Select } from "react-day-picker"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "./context/AuthContext"
import { LOGIN } from "./actions/action-type"
export default function DataTables(){
  let  {userDetails,authdispatch}  = useContext(AuthContext)
  
  
  let navigate = useNavigate()
  let [status,setStatus] = useState('')
    let [open,setOpen] = useState(false)    
    let [data,setData] = useState([])
    
    //reloading after login
    useEffect(()=> {
      
      async function  reloading(){
        let result = await axios.get('/account',{headers:{Authorization:localStorage.getItem('token')}})
         console.log(result.data)
         authdispatch({type:LOGIN,payload: result.data})
      }
      reloading()
    },[])

    
    
    useEffect(()=> {
            async function myfunc(){
              try {
                  let result = await axios.get('/parkings', {headers:{Authorization:localStorage.getItem('token')}})
                console.log('pendings', result.data)
                setData(result.data)
              } catch (error) {
                 console.log('error',error)
                if(error.status == 401){
                  navigate('/login')
                }

              }
                
            }
        myfunc()
    },[status])
  
    

    let handlechange= async (event,row)=> {
        let {_id} = row
        console.log('event', event.target.value)
        setOpen(true)
        let result = await axios.post(`/accept/${_id}`,{verificationStatus:event.target.value}, {headers:{Authorization:localStorage.getItem('token')}})
        console.log('result',result.data)
        
        setStatus(event.target.value)
        
    }


    let columns = [
        {name:'Name',
            selector:row => row.owner.name
            // sortable:true
        },
        {name:'Address',
            selector:row => row.address,
            // sortable:true
        },
        {name:'Pincode',
            selector:row => row.pincode,
            sortable:true
        },
        {name:'Amount',
            selector:row => row.amount,
            sortable:true
        },
        {name:'Email',
            selector:row => row.email,
            // sortable:true
        },
        {name:'Mobile',
            selector:row => row.mobile,
            sortable:true
        },
        ,
        {name:'Status',
            selector:row =>{
    let className =
      "px-2 py-1 rounded-full text-sm font-medium capitalize"

    if (row.status === "Reserved" || row.status === "Accept" ) {
      className += "  text-green-500"
    } else if (row.status === "pending") {
      className += "  text-orange-500"
    } else if (row.status === "Not Reserved" || row.status === "Reject" ) {
      className += "  text-red-600"
    }

    return <span className={className}>{row.status}</span>
  },
            sortable:true
        },
        {name:'Action',
            selector:row => <select  onChange={(event)=> handlechange(event,row)} className="px-3 py-1.5 text-sm border rounded-md bg-white
             
             hover:border-blue-400" name="" id="">
                <option value="">select</option>
                <option value="Accept">Accept</option>
                <option value="Reject">Reject</option>
            </select>
        }
    ]

    // let data = [
    //     {
    //         id:1, 
    //         name:'hyundai',
    //         email:'hyundai@gmail.com',
    //         age:20
    //     },
    //     {
    //         id:2,
    //         name:'maruthi',
    //         email:'maruthi@gmail.com',
    //         age:30
    //     },
    //     {
    //         id:3,
    //         name:'kia',
    //         email:'kia@gmail.com',
    //         age:10
    //     },
    //     {
    //         id:4, 
    //         name:'hyundai',
    //         email:'hyundai@gmail.com',
    //         age:20
    //     },
    //     {
    //         id:5,
    //         name:'maruthi',
    //         email:'maruthi@gmail.com',
    //         age:30
    //     },
    //     {
    //         id:6,
    //         name:'kia',
    //         email:'kia@gmail.com',
    //         age:10
    //     }
    //     ,{
    //         id:7, 
    //         name:'hyundai',
    //         email:'hyundai@gmail.com',
    //         age:20
    //     },
    //     {
    //         id:8,
    //         name:'maruthi',
    //         email:'maruthi@gmail.com',
    //         age:30
    //     },
    //     {
    //         id:9,
    //         name:'kia',
    //         email:'kia@gmail.com',
    //         age:10
    //     },
    //     {
    //         id:10, 
    //         name:'hyundai',
    //         email:'hyundai@gmail.com',
    //         age:20
    //     },
    //     {
    //         id:11,
    //         name:'maruthi',
    //         email:'maruthi@gmail.com',
    //         age:30
    //     },
    //     {
    //         id:12,
    //         name:'kia',
    //         email:'kia@gmail.com',
    //         age:10
    //     }
    // ]
    
  
  if(userDetails && userDetails.role != 'admin')
{
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <span className="text-6xl">🚫</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Access Denied
        </h1>

        <p className="text-gray-600 mb-6">
          You are not accessible to this page.  
          Please contact the administrator or login with proper permissions.
        </p>

        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
        >
          Go Back
        </button>
      </div>
    </div>

  )
}
else{
  return (
        <div>
          {/* {JSON.stringify(userDetails)} */}
            
            
                {/* <input  type="text" className=" bg-red-400" placeholder="Search" /> */}
            <DataTable 
            columns={columns} 
            data={data}
            selectableRows
            fixedHeader
            pagination
            ></DataTable>

            <AlertDialog open={open}  onOpenChange={setOpen}>
  {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Action</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to change status?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction >Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
            
        </div>
    )
}
}
    