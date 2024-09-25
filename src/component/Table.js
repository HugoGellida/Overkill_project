import "./Table.css";

const Table = ({children}) => {
    console.log(children);
    return (
        <div id="table3deffect">
            <div id="table">{children}</div>
        </div>
    )
}

export default Table;