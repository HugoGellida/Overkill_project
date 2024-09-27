import { useState } from "react";
import "./test.css";
import { CSSTransition } from "react-transition-group";
import Test2 from "./test2";

export default function Test() {
    const [condition, setCondition] = useState(false);

    return (
        <>
            <CSSTransition
                in={condition}
                timeout={2000}
                classNames="fade"
                unmountOnExit
                appear
            >
                <div style={{ width: "30%", height: "30%" }}><Test2 /></div>
            </CSSTransition>
            <CSSTransition
                in={!condition}
                timeout={2000}
                classNames="fade"
                unmountOnExit
                appear
            >
                <div>
                    <button onClick={() => setCondition(true)}>Activer la condition</button>
                    <text>Hi :3</text> DIE.
                </div>
            </CSSTransition>
        </>
    );
}