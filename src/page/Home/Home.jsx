import { useEffect } from "react"
import Hero from "./Component/Hero";
import Banner from "./Component/Banner";
import TopBar from "./Component/TopBar";
import Product from "./Component/Product";
import FooterProduct from "../Product/FooterProduct";


function Home( {setCurrentTitle} )
{
    useEffect(() => {
        setCurrentTitle("DUC COMPUTER")
    }, [setCurrentTitle])
    return (
        <div className="mt-5 sm:mt-0">
            <hr />
            <div className="bg-[#EEEEEE]">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <Hero />
                </div>
            </div>
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 mb-32 lg:mb-0">
                <div>
                    <div>
                        <TopBar />
                        <Banner />
                        <Product/>
                    </div>
                </div>
            </div>
            <FooterProduct />
        </div>
    );
}
export default Home