import { ReactElement } from "react";
import NavBar from "../NavBar";
import Footer from "../Footer";

interface Iprops{
    children:ReactElement
}
const Layout = ({children}:Iprops) =>{
    return(
        <div>
            <NavBar />
                {children}
            <Footer />
        </div>
    )
}

export default Layout;