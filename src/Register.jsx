// import 
import { Toaster, toast } from "sonner"
import axios from 'axios';
// import React, { useEffect } from 'react';
import { useFormik } from 'formik';
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
import { useState,useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import { REGISTER } from "./actions/action-type";



export default function Register() {

    let {authdispatch} = useContext(AuthContext)
    let mynavigate= useNavigate()    
    
    const formik = useFormik({
    //  initialValues: localStorage.getItem('Registerinfo')?JSON.parse(localStorage.getItem('Registerinfo')) : {
       initialValues:{
            name: '',
            email: '',
            password: '',
            role:''
        },
         validateOnChange: false,
         validateOnBlur: false,
        validate: (values) => {
            console.log('inside validate validation',values)
            const errors = {};

            if(values.name.trim().length == 0 ) {
                errors.name = "Please enter name";
            }

            if (values.email.trim().length == 0) {
                errors.email = "Please enter email";
            } 

            if (values.password.trim().length == 0) {
                errors.password = "Please enter password";
            }

            if (values.role.trim().length == 0) {
                errors.role = "Please select";
            }

                console.log('myerror',errors)
         return errors;
        },


        onSubmit: async (values,{resetForm}) => {
            console.log('inside validate validation',values)
                 
            try {
               
                

                let result = await axios.post('http://localhost:3000/register',values)
                console.log(result.data.message)
                authdispatch({type:REGISTER, payload:result.data.message})
                // localStorage.removeItem("Registerinfo")
                resetForm()
                
                // toast("result.data.message")
                //  toast.success("Successfully Registered")
                 mynavigate('/login')

            } catch (error) {
                console.log('hello', error)
                authdispatch({type:REGISTER, payload:error.response.data.message})
                  toast.error(error.response.data.message)


            }
        }, 
    });
    //     useEffect(()=> {
    //         localStorage.setItem('Registerinfo',JSON.stringify({name:formik.values.name,email:formik.values.email,password:formik.values.password,
    //             role:formik.values.role
    //         }))
    // },[formik.values])
    
    return (
        <div>
            <Card className="w-full max-w-sm m-auto">
                <CardHeader  >
                   
                    <CardTitle >Register</CardTitle>
                    <CardDescription >
                        Create an account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2 text-start">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                />
                            </div>
                            <p className="text-red-800 text-start">{formik.errors.name}</p>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="email">Email</Label>
                                </div>
                                <Input
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    id="email" type="email"  />
                            </div>
                            <p className="text-red-500  text-start">{formik.errors.email}</p>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    id="password" type="password"  />
                            </div>
                            <p className="text-red-500 text-start">{formik.errors.password}</p>
                        
                            {/* Radio button */}
            
                           <p className="font-semibold">What is you are looking for?</p>
            
                            <div className="flex flex-col text-justify ">
                                <div>
                <input  type="radio" className="mx-2" name="role" value="owner" id="role" checked={formik.values.role == 'owner'}
                    onChange={formik.handleChange} />
                <Label  htmlFor="option-one">I own a parking space and wish to rent it out  </Label>
            </div>                 
        <div>
            <input type="radio" className="mx-2" name="role" value="user"id="role" checked={formik.values.role == 'user'}
                onChange={formik.handleChange} />
            <Label htmlFor="option-two">I am a vehicle owner looking for parking space</Label>
        </div>
                            </div>
        
        
                            
                            <p className="text-red-500 text-start">{formik.errors.role}</p>



                            
                            
                            <CardFooter className="flex-col gap-2">
                                <Button type="submit" className="w-full bg-orange-500">
                                    Submit
                                </Button>
                            </CardFooter>

                        </div>
                    </form>
                </CardContent>



            </Card>

            <Toaster richColors position="top-center" />
        </div>



    )
}
