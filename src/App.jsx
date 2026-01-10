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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Route, Link, Routes } from 'react-router-dom'
import './App.css'
import Login from './Login'
import Register from './Register'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {

  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import Dashboard from './Dashboard'
import Search from './Search'
import { useContext } from "react"
import AuthContext from "./context/AuthContext"
import { LOGOUT } from "./actions/action-type"
import { useNavigate } from "react-router-dom"
import Account from "./Account"
import SpotDetails from "./SpotDetails"
import AddParking from "./AddParking"
import DataTables from "./DataTables"
function App() {
  let { userDetails, authdispatch, isLogin } = useContext(AuthContext)
  let navigation = useNavigate()

  let handleLogout = () => {
    console.log('login out')
    localStorage.removeItem('token')
    authdispatch({ type: LOGOUT })
    navigation('/')


  }
  return (
    <div className='container-fluid'>
      {/* {JSON.stringify(userDetails)} */}
      <NavigationMenu className="full-width nav-flex mt-0 mb-8 ">
        {/* logo  */}
        <div>
          <h1 onClick={()=>navigation('/') } className=" cursor-pointer text-2xl font-bold text-blue-600">Park<span className="text-orange-500">IT</span></h1>
        </div>

        {/* desktop view */}

        <div>
          <NavigationMenuList className='hidden lg:block '>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Company</NavigationMenuTrigger>

              <NavigationMenuTrigger>Request Spot</NavigationMenuTrigger>
              <NavigationMenuTrigger>Register Spot</NavigationMenuTrigger>

              

              {!isLogin && 
              <>
                <Link className="bg-orange-400 text-white font-semibold rounded-full p-2 px-4 mx-3" to="/login">Login</Link>
                <Link className="bg-orange-400 text-white font-semibold rounded-full p-2 px-4" to="/register">Register</Link>
                {/* <Button className="bg-orange-400 text-white rounded-full" variant="outline"><Link to="/spotdetails">SpotDetails</Link></Button> */}
              </>
              
              }
              
              {/* <Button className="bg-orange-400 text-white rounded-full" variant="outline"><Link to="/">Dashboard</Link></Button>
               <Button className="bg-orange-400 text-white rounded-full" variant="outline"><Link to="/search">Search</Link></Button>
                */}

              {userDetails && <HoverCard>
                <HoverCardTrigger >
                  <NavigationMenuTrigger>{userDetails.name}</NavigationMenuTrigger>
                </HoverCardTrigger>
                <HoverCardContent>
                  <Link className="block p-2 hover:bg-gray-200  hover:rounded-full" to="/account">My Profile</Link>
                  <AlertDialog>
                    <AlertDialogTrigger className=" p-2 hover:bg-gray-200 hover:rounded-full  hover:w-full hover:rounded-full">Log out</AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='text-blue-600'>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will be logged out from your account. Are you sure you want to continue?.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='bg-orange-600'  onClick={handleLogout}> Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </HoverCardContent>
              </HoverCard>
              }


            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
        <div className="lg:hidden" >
          <Sheet  >
            <SheetTrigger><FontAwesomeIcon icon={faBars} size="lg" /></SheetTrigger>


            <SheetContent className="right-auto">
              <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>

          </Sheet>
        </div>


      </NavigationMenu>





      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Dashboard />} />
        <Route path='/search' element={<Search />} />
        <Route path='/account' element = {<Account />} />
        <Route path='/spotdetails' element = {<SpotDetails />} />
        <Route path='/addparking' element = {<AddParking />} />
        datatable
        <Route path='/datatable' element = {<DataTables/>} />
      </Routes>

    </div>
  )
}

export default App
