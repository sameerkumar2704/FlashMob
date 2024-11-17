import "./App.css";
import { Toaster } from "./components/ui/toaster";
import { useUserContext } from "./context/usercontex";
import { NavBar } from "./UiElements/NavBar";
import { NotificationBox } from "./UiElements/NotificationDialog";
function App() {
  const { currentUser, verfiying } = useUserContext();
  console.log(!currentUser);
  return (
    <>
      <NavBar />
      {!verfiying && (
        <>
          <NotificationBox isOpen={!currentUser} title='Registration'>
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
