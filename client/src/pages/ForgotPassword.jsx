import { Input } from "@/components/ui/input";
import { getDetails, postDetails } from "@/util/fetchHandlers";
import { useRef, useState } from "react";

export function ForgotPassword() {
  // post resquest of forgot passwrod -> postDetails('/api/users/forgotpassword , {email:userEmail})
  // after recived mail get the token form mail and send to postDetails('/api/users/resetPassword/:token , {password: new_password})
}
