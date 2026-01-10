import { useNavigate } from "react-router-dom"
import axios from "./config/axios"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Card,
    //   CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext, useEffect, useRef, useState } from "react"
import AuthContext from "./context/AuthContext"
import { LOGIN } from "./actions/action-type"

export default function Login() {
    let {registerStatus,userDetails} = useContext(AuthContext)
    let {authdispatch} = useContext(AuthContext)
    let initial = useRef(false)
    let [loginDetails, setLoginDetails] = useState({
        email: '',
        password: ''    
    })
    let [errortrackor, setErrortrackor] = useState({})

    // useEffect(()=> {
    //     localStorage.setItem('loginInfo',JSON.stringify({email:loginDetails.email,password:loginDetails.password}))
    // },[loginDetails])

    let navigation = useNavigate();
    useEffect(()=> {
     if(registerStatus){
        toast.success(registerStatus)
     }   
    },[])
    
    
    
    
    useEffect(() => {
        if (initial.current == true) {
            async function fetchData() {
                if (Object.entries(errortrackor).length > 0) {
                    console.log('form feilds are empty')
                }
                else {
                    
                    try {
                        let result = await axios.post("http://localhost:3000/login", loginDetails)
                        // console.log(result.data.token)
                        localStorage.setItem('token',result.data.token)
                        let accountDetails = await   axios.get('/account',{headers:{Authorization:localStorage.getItem('token')}})
                        console.log('helll', accountDetails.data)
                        authdispatch({type:LOGIN,payload:accountDetails.data })
                        // toast.success('Login successfully')
                        // navigation('/dashboard')
                    } catch (error) {
                        toast.error(error.response.data.message)
                        console.log('hello', error.response.data.message)
                    }
                }
            }


            fetchData()

        }

    }, [errortrackor])

    //changeing page base on role
    useEffect(()=> {
        if(userDetails){
                if(userDetails.role == 'user'){
            navigation('/')
        }
        else if(userDetails.role == 'owner'){
            navigation('/addparking')
         }
         else if(userDetails.role == 'admin'){
            navigation('/datatable')
         }
        }
        
        
    })



    let handleLogin = async () => {
        // console.log('hello')
        let error = {}
        initial.current = true
        if (loginDetails.email.trim().length == 0) {
            error.email = 'Please enter username'
        }
        else if (loginDetails.password.trim().length == 0) {
            error.password = 'Please enter password'
        }
        // console.log('error', error)
        setErrortrackor(error)
    }

    return (
        <div>

                


            <Card className="w-full max-w-sm m-auto">
                <CardHeader className='d-flex flex-row items-end' >
                    <div>
                        <CardTitle className='text-left'>Login to your account</CardTitle>
                        <CardDescription className='text-left'>
                            Enter your email below to login to your account
                        </CardDescription>
                    </div>
                    <CardHeader >
                        <Button variant="link">Sign Up</Button>
                    </CardHeader>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2 text-start">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    onChange={(event) => setLoginDetails({ ...loginDetails, email: event.target.value })}
                                    id="email"
                                    type="email"
                                    placeholder="sample@example.com"
                                    value= {loginDetails.email}
                                />
                                <p className="text-red-500">{errortrackor.email}</p>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                value={loginDetails.password}
                                    onChange={(event) => setLoginDetails({ ...loginDetails, password: event.target.value })}
                                    id="password" type="password" />
                                <p className="text-red-500 text-start">{errortrackor.password}</p>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                 <Button  onClick={handleLogin} className="w-full bg-orange-500">
                        Login
                    </Button> 
                    
                    <Button variant="outline" className="w-full">
                        Login with Google
                    </Button>
                </CardFooter>
            </Card>


            <Toaster richColors position="top-center" />
        </div>



    )
}
