import { createSlice } from "@reduxjs/toolkit";
let SpotDetailSlice = createSlice({
    name:'SpotDeatils',
    initialState:{
        loading :true,
        data: null,
        error:null
      },
    reducers :{
        setSpotData:(state, action)=> {
            return {...state, data:action.payload}
        }
    }
    
})

export default SpotDetailSlice.reducer;
export let {setSpotData} = SpotDetailSlice.actions;