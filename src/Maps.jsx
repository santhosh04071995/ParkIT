import { useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Button } from "@/components/ui/button"
import { useDispatch } from 'react-redux';    
import { useNavigate } from 'react-router-dom';
import { setSpotData } from './slice/SpotDetailSlice';
export default function Maps() {

    let mydispatch = useDispatch()
    let mynavigate = useNavigate()
let searchData = useSelector((state)=> state.searchBranch)
               console.log('searchData',searchData)

  let handleSpotDetails= async(detials)=> {
        console.log('detail',detials)
       await  mydispatch(setSpotData(detials))
        mynavigate('/spotdetails')

  }
    
    
        return (
        <div className=''>
            <MapContainer center={searchData.data[0].position} zoom={11} scrollWheelZoom={false} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {searchData.data && searchData.data.map(element=> <Marker position={element.position}><Popup>
                    
                    <div>
                           <span> #{element._id}</span> <br/>
                            <span>{element.address}</span> <br/>
                            <span className="bg-red-300 p-1 rounded text-red-800 font-bold">{element.status}</span><br/>
                            <span className="font-bold">Distance:-</span>{element.KiloMeter}<br/>
                            <span className="font-bold">Rent:-</span>{element.amount} Rs <br/>
                            <div className="flex flex-row mt-2 justify-between">
                             <Button variant="outline" className='font-bold'>
                                <a
                                        href={`https://www.google.com/maps/dir/?api=1&origin=${element.currentLocation[0]},${element.currentLocation[1]}&destination=${element.position[0]},${element.position[1]}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                >
                                Navigate
                                </a>
                                   
                             </Button>   
                             <Button onClick={()=>handleSpotDetails(element)} variant="outline" className='font-bold'>View spot</Button>
                            </div>
                    </div>
                    </Popup></Marker>)}
                
                {/* <Marker position={searchData.data[0].position}>
                    <Popup>
                        {searchData.data[0].address}. <br /> Easily customizable.
                    </Popup>
                </Marker> */}
            </MapContainer>
        </div>

    )
}