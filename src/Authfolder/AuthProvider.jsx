import AuthContext from "@/context/AuthContext"
import { useReducer } from "react"

import authreducer from "@/reducer/authreducer"

export default function AuthProvider(props){
    let [user,authdispatch] = useReducer(authreducer,{
        userDetails:null,
        serverError:'',
        isLoading:'',
        isLogin:'',
        registerStatus:''
    })
    // console.log('auth provider')
    return (
        <div>
           <AuthContext.Provider value={{...user, authdispatch:authdispatch}} >
             {props.children}
        </AuthContext.Provider>
        </div>
    )
}