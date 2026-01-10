import { LOGIN, LOGOUT, REGISTER } from "@/actions/action-type";
import { faL } from "@fortawesome/free-solid-svg-icons";
let authreducer = (state,action)=> {
    switch (action.type) {
        case REGISTER:
            // console.log('byeee')
                return {...state, registerStatus:action.payload}
          case LOGIN:
            console.log('agian') 
                return {...state,isLogin:true,userDetails: action.payload}   
           case LOGOUT:
                return {...state, isLogin:false, userDetails:null} 
        default:
            return state
    }
}
export default authreducer
//   userDetails:null,
//         serverError:'',
//         isLoading:'',
//         isLogin:'',
//         registerStatus:''