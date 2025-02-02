import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { menu, smember } from "./Route/Route";
import Header from "./Component/Header/Header";
import { ToastContainer, Bounce } from "react-toastify";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import { UserProvider } from "./Context/UserContext";
import { CartProvider } from "./Context/CartContext";
import { ProductProvider } from "./Context/ProductContext";
import { DataProvider } from "./Context/DataContext";
import { GetProductCategoryProvider } from "./Context/getProductCategory";
import { GetProductBrandProvider } from "./Context/getProductBrand";
import NavBar from "./Component/Navbar/NavBar";
import Login from "./Component/Auth/Login";
import Register from "./Component/Auth/Register";
import Top from "./Component/Top/Top";
import DefaultLayout from "./page/Profile/Layout/DefaultLayout";
import Footer from "./Component/Footer/Footer";


function App() {
    const [currentTitle, setCurrentTitle] = useState("");
    useEffect(() => {
        document.title = currentTitle
    }, [currentTitle])

    useEffect(() => {
        AOS.init({
          offset: 100, 
          duration: 800,
          easing: "ease-in-sine",
          delay: 100,
        });
        AOS.refresh();
      }, []);
    return (
        <Router>
            <UserProvider>
                <CartProvider>
                    <ProductProvider>
                        <DataProvider>
                            <GetProductCategoryProvider>
                                <GetProductBrandProvider>
                                    <NavBar/>
                                    <Header/>
                                    <Top/>
                                    <Routes>
                                        <Route path="/login" element={<Login setCurrentTitle={setCurrentTitle}/>}/>
                                        <Route path="/register" element={<Register setCurrentTitle={setCurrentTitle}/>} />
                                        <Route path="/profiles" element={<DefaultLayout/>}>
                                            {smember.map((route, index) => (
                                                <Route key={index} path={route.path} element={<route.Component setCurrentTitle={setCurrentTitle}/> } />
                                            ))}
                                        </Route>
                                        {
                                            menu.map((item, index) => (
                                                <Route
                                                    key={index}
                                                    path={item.path}
                                                    element={<item.Component setCurrentTitle={setCurrentTitle}/>}
                                                />
                                            ))
                                        }
                                    </Routes>
                                    <Footer/>
                                </GetProductBrandProvider>
                            </GetProductCategoryProvider>
                        </DataProvider>
                    </ProductProvider>
                </CartProvider>
            </UserProvider>
            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </Router>
    );
}

export default App;
