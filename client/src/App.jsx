import { useEffect, useState } from "react";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import { useUserContext } from "./context/usercontex";
import { NavBar } from "./UiElements/NavBar";
import { NotificationBox } from "./UiElements/NotificationDialog";
import { useGlobalContext } from "./context/globaleContext";
function App() {
  const { currentUser, verfiying } = useUserContext();
  const { setShow } = useGlobalContext();
  useEffect(() => {
    setShow(!currentUser);
  }, [currentUser, setShow]);

  return (
    <>
      <NavBar />
      {!verfiying && (
        <>
          <NotificationBox title='Registration'>
            <NotificationBox.Registration />
            <NotificationBox.Login />
          </NotificationBox>
          <Toaster />
        </>
      )}
    </>
  );
}

export default App;
