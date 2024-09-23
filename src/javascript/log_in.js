import "./../css/Log_in.css";
import React, { useEffect, useState } from "react";
import socket from "./../socket";
import { useNavigate } from "react-router-dom";

export default function Log_in() {
    const { navigate } = useNavigate();
    const [username, setUsername] = useState("");
    const [TSC, setTSC] = useState("");
    const [show_warning, setShow_warning] = useState(false);

    useEffect(() => {
        socket.on("log_in_response", (response) => {
            if (response) navigate("/Lobby");
            else setShow_warning(true);
        });

        return () => {
            socket.off("log_in_response");
        }
    });

    function clicked_confirm(){
        if (!username || !TSC) setShow_warning(true);
        else {
            socket.emit("log_in_request", username, TSC);
        }
    }

    const change_username = (event) => setUsername(event.target.value);
    const change_TSC = (event) => setTSC(event.target.value);

    return (
        <div id="Log_in" style={{ backgroundImage: "url('/Log_in_menu.png')" }}>
            <div id="center_div">
                <text style={{ fontSize: "150%", marginTop: "auto", marginBottom: "auto" }}>Overkill</text>
                <label className="Log_in_label">Username</label>
                <input type="text" id="Username" style={{marginBottom: "auto"}} value={username} onChange={change_username}></input>
                <label className="Log_in_label">TSC</label>
                <input type="text" id="TSC" style={{marginBottom: "auto"}} value={TSC} onChange={change_TSC}></input>
                <button onClick={clicked_confirm}>Confirm</button>
            </div>
        </div>
    );
}