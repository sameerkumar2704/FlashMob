import "./App.css";
import { useUserContext } from "./context/usercontex";
import { NavBar } from "./UiElements/NavBar";
import { NotificationBox } from "./UiElements/NotificationDialog";
function App() {
  const { currentUser, verfiying } = useUserContext();
  console.log(currentUser === undefined);
  return (
    <>
      <NavBar />
      <NotificationBox
        isOpen={currentUser === undefined && !verfiying}
        title='Registration'
      >
        <NotificationBox.Registration />
      </NotificationBox>
    </>
  );
}

export default App;
