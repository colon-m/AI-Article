import { List as RWList} from "react-window";
import ListItem from "components/ListItem";
import { Article } from "db/entities/article";
import { ArticleNode } from "utils/searchArticles";

function List({arts, addElement, isFirstRender}: { arts: Article[] | ArticleNode[], addElement: (el: HTMLDivElement) => void, isFirstRender: boolean }) {
    return (
        <RWList
            rowComponent={ListItem}
            rowCount={arts.length}
            rowHeight={95}
            rowProps={{ arts, ref: addElement, isFirstRender }}
        />
    );
}
export default List;