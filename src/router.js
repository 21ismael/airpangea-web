
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Root from "./components/Root";
import Main from "./components/Main/Main";
import BuyTicket from "./components/BuyTicket/BuyTicket";
import Payment from "./components/Payment/Payment";

export const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Root />}>
    <Route path="/" element={<Main />}/>
    <Route path="buy-ticket" element={<BuyTicket />} />
    <Route path="buy-ticket/pay" element={<Payment />} />
  </Route >
));

