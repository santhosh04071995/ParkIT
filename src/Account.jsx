import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";

export default function Account(){
    let { userDetails } =useContext(AuthContext)
    // console.log('hello', userDetails)
    return (
       
            
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-14 w-14">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>SS</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">{userDetails.name} / Edit Profile</h1>
          <p className="text-sm text-muted-foreground">
            Set up your Parkspot account.
          </p>
        </div>
      </div>

      {/* Card */}
      <Card className="rounded-xl">
        {/* Blue section header */}
        <CardHeader className="bg-[#007ea7] text-white rounded-t-xl">
          <h2 className="text-lg font-semibold">General Info</h2>
          <p className="text-sm opacity-90">Please fill all the fields</p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={userDetails.name} />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={userDetails.email}/>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <Label>Contact No.</Label>
            <Input placeholder="Contact No." />
          </div>

          {/* Radio options */}
          <div className="space-y-3">
            <Label>What is you are looking for?</Label>
            
            <RadioGroup defaultValue={userDetails.role} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner" className="font-normal">
                  I own a parking space and wish to rent it out.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="driver" />
                <Label htmlFor="user" className="font-normal">
                  I am a vehicle owner looking for a parking spot to rent.
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Actions */}
          <div className="pt-4">
            <Button className="bg-[#007ea7] hover:bg-[#006b8f]">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    )
}