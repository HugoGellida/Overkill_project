import "./../css/Log_in.css";
import React, { useEffect, useState } from "react";
import socket from "./../socket";
import Lobby from "./lobby";

export default function Log_in() {
    const [username, setUsername] = useState("");
    const [TSC, setTSC] = useState("");
    const [show_warning, setShow_warning] = useState(false);
    const [method, setMethod] = useState("log_in");
    const [show_lobby, set_show_lobby] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("TSC")){
            set_show_lobby(true);
        }


        const log_in_response = (response) => {
            if (response) {
                set_show_lobby(true);
                sessionStorage.setItem("TSC", TSC);
            }
            else setShow_warning(true);
        }
        socket.on("log_in_response", log_in_response);

        return () => {
            socket.off("log_in_response", log_in_response);
        }
    });

    function clicked_confirm() {
        if ((!username && method === "sign_in") || !TSC) setShow_warning(true);
        else socket.emit("log_in_request", username, TSC, method);
    }

    const change_username = (event) => setUsername(event.target.value);
    const change_TSC = (event) => setTSC(event.target.value);

    return (
        <>
            {!show_lobby && (
                <div id="Log_in" style={{ backgroundImage: "url('/Log_in_menu.png')" }}>
                    {!show_warning && (
                        <>
                            {method === "log_in" && (
                                <>
                                    <div id="center_div">
                                        <text style={{ fontSize: "150%", marginTop: "auto", marginBottom: "auto" }}>Log in</text>
                                        <label className="Log_in_label">TSC</label>
                                        <input type="text" id="TSC" style={{ marginBottom: "auto" }} value={TSC} onChange={change_TSC}></input>
                                        <button onClick={clicked_confirm}>Confirm</button>
                                    </div>
                                    <button onClick={() => { setMethod("sign_in") }}>Sign in</button>
                                </>
                            )}
                            {method === "sign_in" && (
                                <>
                                    <div id="center_div">
                                        <text style={{ fontSize: "150%", marginTop: "auto", marginBottom: "auto" }}>Sign in</text>
                                        <label className="Log_in_label">Username</label>
                                        <input type="text" id="Username" style={{ marginBottom: "auto" }} value={username} onChange={change_username}></input>
                                        <label className="Log_in_label">TSC</label>
                                        <input type="text" id="TSC" style={{ marginBottom: "auto" }} value={TSC} onChange={change_TSC}></input>
                                        <button onClick={clicked_confirm}>Confirm</button>
                                    </div>
                                    <button onClick={() => { setMethod("log_in") }}>Log in</button>
                                </>
                            )}
                        </>
                    )}
                    {show_warning && (
                        <>
                            <text>Warning</text>
                            <button onClick={() => { setShow_warning(false) }}>Continue</button>
                        </>
                    )}
                </div>
            )}
            {show_lobby && (<Lobby disconnect={() => {
                sessionStorage.removeItem("TSC");
                set_show_lobby(false);
            }}/>)}
        </>


    );
}