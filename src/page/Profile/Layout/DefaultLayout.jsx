import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";

function DefaultLayout() {
    return (
        <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
            <div className="text-sm text-gray-600">
                <div className="grid grid-cols-1 mt-0 lg:mt-5 lg:grid-cols-4 gap-6">
                    {/* Sidebar Sticky */}
                    <div className="col-span-1 relative">
                        <div className="sticky top-[5px] mb-10">
                            <SideBar />
                        </div>
                    </div>

                    {/* Nội dung chính */}
                    <div className="col-span-3 ml-0 lg:ml-10 mb-10">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
