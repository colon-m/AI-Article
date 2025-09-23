import MenuInMobie from "./MenuInMobie";
import MenuNotInMobie from "./MenuNotInMobie";
import styles from "./index.module.scss";

type Props = {
    isMobile: Boolean,
    time?: number,
}
const Menu = ({isMobile,time}:Props) => {
    return (
        isMobile
        ?
        <MenuInMobie time={time!}/>
        :
        <MenuNotInMobie />
    )
};

export default Menu;