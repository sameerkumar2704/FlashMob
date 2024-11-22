import { useEffect, useState } from "react";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import { useUserContext } from "./context/usercontex";
import { NavBar } from "./UiElements/NavBar";
import { NotificationBox } from "./UiElements/NotificationDialog";
import { useGlobalContext } from "./context/globaleContext";
import { ComponentTitle } from "./UiElements/ComponentTitle";
import { ProductView } from "./UiElements/ProductView";
import { Category } from "./UiElements/category";

function App() {
  const { currentUser, verfiying } = useUserContext();
  const { setShow } = useGlobalContext();
  useEffect(() => {
    setShow(!currentUser);
  }, [currentUser, setShow]);

  return (
    <>
      <NavBar />
      <Category />
      <div className=' p-4 space-y-4'>
        <ComponentTitle title={"Product"} />
        <div className=' max-lg:flex overflow-x-auto grid grid-cols-5 gap-2'>
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 1,
              price: 200,
              faviourate: true,
            }}
          />
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 2,
              price: 100,
              faviourate: true,
            }}
          />
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 3,
              price: 100,
              faviourate: true,
            }}
          />
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 2,
              price: 900,
              faviourate: false,
            }}
          />
          <ProductView
            productDetails={{ title: "Mouse", starCount: 2, price: 1000 }}
          />
        </div>
      </div>
      <div className=' p-4 space-y-4'>
        <ComponentTitle title={"Product"} />
        <div className=' max-lg:flex overflow-x-auto grid grid-cols-5 gap-2'>
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 1,
              price: 200,
              faviourate: true,
            }}
          />
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 2,
              price: 100,
              faviourate: true,
            }}
          />
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 3,
              price: 100,
              faviourate: true,
            }}
          />
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 2,
              price: 900,
              faviourate: false,
            }}
          />
          <ProductView
            productDetails={{ title: "Mouse", starCount: 2, price: 1000 }}
          />
        </div>
      </div>
      <div className=' p-4 space-y-4'>
        <ComponentTitle title={"Product"} />
        <div className=' max-lg:flex overflow-x-auto grid grid-cols-5 gap-2'>
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 1,
              price: 200,
              faviourate: true,
            }}
          />
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 2,
              price: 100,
              faviourate: true,
            }}
          />
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 3,
              price: 100,
              faviourate: true,
            }}
          />
          <ProductView
            productDetails={{
              title: "Mouse",
              starCount: 2,
              price: 900,
              faviourate: false,
            }}
          />
          <ProductView
            productDetails={{ title: "Mouse", starCount: 2, price: 1000 }}
          />
        </div>
      </div>

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
