import { ReactElement } from "react";
import NavBar from "../NavBar";
import Footer from "../Footer";
import SideCard from "../SideCard";

interface Iprops{
    children:ReactElement,
    showSideCard?: boolean
}
const Layout = ({children, showSideCard = true}:Iprops) => {
    return(
        <div>
            <NavBar />
            {children}
            {showSideCard && <SideCard />}
            <Footer />
        </div>
    )
}

export default Layout;