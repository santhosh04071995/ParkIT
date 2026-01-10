import axios from "@/config/axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"      

export let searchspace =  createAsyncThunk('user/sechspace', async(dashinfo, {rejectedWithValue}) => {
    
    try {
        let result = await axios.post(`/search`,dashinfo,{headers:{Authorization:localStorage.getItem('token')}})
        console.log('result today',result.data)
        return result.data
    } catch (error) {
        console.log(error)
        return rejectedWithValue(error)
    }
})


let UserSearchSlice = createSlice({
    name:'SearchSlice',
    initialState:{
        loading :"",
        data: null,
        error:null,
        userrequest:null
    },
    reducers :{
        setData:(state, action)=> {
            return {...state, userrequest:action.payload}
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(searchspace.fulfilled,(state,action)=> {
            return {...state, data: action.payload,loading:false }
        })
        .addCase(searchspace.pending,(state,action)=> {
            return {...state, loading:true }
        })
    }
})

export default UserSearchSlice.reducer;
export let {setData} = UserSearchSlice.actions;