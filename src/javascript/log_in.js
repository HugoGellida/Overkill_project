import "./../css/Log_in.css";
import React, { useEffect, useState } from "react";
import socket from "./../socket";
import { useNavigate } from "react-router-dom";

export default function Log_in() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [TSC, setTSC] = useState("");
    const [show_warning, setShow_warning] = useState(false);
    const [method, setMethod] = useState("log_in");

    useEffect(() => {
        const log_in_response = (response) => {
            if (response) navigate("/Lobby");
            else setShow_warning(true);
        }
        socket.on("log_in_response", log_in_response);

        return () => {
            socket.off("log_in_response", log_in_response);
        }
    });

    function clicked_confirm() {
        if (!username || !TSC || !method) setShow_warning(true);
        else socket.emit("log_in_request", username, TSC, method);
    }

    const change_username = (event) => setUsername(event.target.value);
    const change_TSC = (event) => setTSC(event.target.value);
    const change_method = (event) => {setMethod(event.target.value)}

    return (
        <div id="Log_in" style={{ backgroundImage: "url('/Log_in_menu.png')" }}>
            {!show_warning && (
                <>
                    <div id="center_div">
                        <text style={{ fontSize: "150%", marginTop: "auto", marginBottom: "auto" }}>Overkill</text>
                        <label className="Log_in_label">Username</label>
                        <input type="text" id="Username" style={{ marginBottom: "auto" }} value={username} onChange={change_username}></input>
                        <label className="Log_in_label">TSC</label>
                        <input type="text" id="TSC" style={{ marginBottom: "auto" }} value={TSC} onChange={change_TSC}></input>
                        <select id="log_type" onChange={change_method}>
                            <option value={"log_in"} selected={method === "log_in"? true: false}>Log in</option>
                            <option value={"sign_in"} selected={method === "sign_in"? true: false}>Sign in</option>
                        </select>
                        <button onClick={clicked_confirm}>Confirm</button>
                    </div>
                </>

            )}
            {show_warning && (
                <>
                    <text>Warning</text>
                    <button onClick={() => { setShow_warning(false) }}>Continue</button>
                </>
            )}
        </div>
    );
}