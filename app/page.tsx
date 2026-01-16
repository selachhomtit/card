import { Button } from "@/components/ui/button";
import PostCard from "../components/PostCard";
import { Flag, Gem } from "lucide-react";
import LoginForm from "@/components/login-form";
import RegisterForm from "@/components/register-form";

export default function Home() {
  return (
    <div className="flex justify-center">
      {/* <Button
      variant="destructive"
      >
        <Flag>

        </Flag>
      
      </Button>

      <Button 
      variant="secondary">
        <Gem>
          
        </Gem>

      </Button>



      <Button
       variant="ghost">Click me</Button> */}
       {/* <LoginForm/> */}
       <RegisterForm/>
    </div>
  );
}
  