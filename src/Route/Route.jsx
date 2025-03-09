import Payment from "../page/Cart/Payment/Payment";
import ViewCart from "../page/Cart/ViewCart";
import Contact from "../page/Contact/Contact";
import Home from "../page/Home/Home";
import News from "../page/News/News";
import ShowNew from "../page/News/ShowNew";
import Product from "../page/Product/Product";
import ShowProduct from "../page/Product/ShowProduct";
import Change_password from "../page/Profile/Change_password";
import Delivery_history from "../page/Profile/Delivery_history";
import Your_account from "../page/Profile/Your_account";

export const menu = [
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/product",
    Component: Product,
  },
  {
    path: "/news",
    Component: News,
  },
  {
    path: "/contact",
    Component: Contact,
  },
  {
    path: "product/:product_name",
    Component: ShowProduct,
  },
  {
    path: "new/:new_name",
    Component: ShowNew,
  },
  {
    path: "cart",
    Component: ViewCart,
  },
  {
    path: "payment",
    Component: Payment,
  },
];
export const smember = [
  {
    path: "Delivery-history",
    Component: Delivery_history,
  },
  {
    path: "Your-account",
    Component: Your_account,
  },
  {
    path: "Change-password",
    Component: Change_password,
  },
];