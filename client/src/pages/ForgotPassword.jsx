import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

export function ForgotPassword() {
  const email = useRef();
  return (
    <div className='w-64 '>
      <Input ref={email} type='email' />
      <button onClick={() => console.log(email)}>Send</button>
    </div>
  );
}
