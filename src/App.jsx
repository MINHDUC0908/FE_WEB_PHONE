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
import Chat from "./page/Chat/Chat";
import { ChatProvider } from "./Context/ChatContext";
import { ForgotProvider } from "./Context/ForgotPassword";
import ForgotPassword from "./Component/Auth/ForgotPassword";
import Product_By_Category from "./page/Product/Product_By/Product_By_Category";
import Product_By_Brand from "./page/Product/Product_By/Product_By_Brand";
import { SearchProductProvider } from "./Context/SearchContext";
import ProductSearch from "./page/Product/Search/ProductSearch";
import { CommentProvider } from "./Context/CommentContext";
import { RatingProvider } from "./Context/RatingContext";
import ChatBotAi from "./page/Chat/Ai/ChatBotAI";


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
            <ForgotProvider>
            <RatingProvider>
                <UserProvider>
                    <ChatProvider>
                        <CartProvider>
                            <ProductProvider>
                                <CommentProvider>
                                <SearchProductProvider>
                                    <DataProvider>
                                        <GetProductCategoryProvider>
                                            <GetProductBrandProvider>
                                                <NavBar/>
                                                <Header/>
                                                <Top/>
                                                <Chat/>
                                                <ChatBotAi/>
                                                <Routes>
                                                    <Route path="/search" element={<ProductSearch setCurrentTitle={setCurrentTitle}/>} />
                                                    <Route path="/product-brand/:brand_name" element={<Product_By_Brand setCurrentTitle={setCurrentTitle} />} />
                                                    <Route path="/product-category/:category_name" element={<Product_By_Category setCurrentTitle={setCurrentTitle} />} />
                                                    <Route path="/forgot-password/:token" element={<ForgotPassword setCurrentTitle={setCurrentTitle}/>}/>
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
                                </SearchProductProvider>
                                </CommentProvider>
                            </ProductProvider>
                        </CartProvider>
                    </ChatProvider>
                </UserProvider>
                </RatingProvider>
            </ForgotProvider>
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
