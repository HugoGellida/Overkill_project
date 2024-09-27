import React from "react";
import "./statistics.css";
import socket from "../socket";

const Statistics = ({ hide_stats }) => {

    const [simulation_failed, set_simulation_failed] = React.useState();
    const [simulation_success, set_simulation_success] = React.useState();
    const [username, set_username] = React.useState();


    React.useEffect(() => {
        socket.emit("get_stats", sessionStorage.getItem("TSC"));
        const stats_answer = (username, simulation_failed, simulation_success) => {
            set_simulation_failed(simulation_failed);
            set_simulation_success(simulation_success);
            set_username(username);
        }

        socket.on("stats_answer", stats_answer);

        return () => {
            socket.off("stats_answer", stats_answer);
        }
    }, [])

    return (
        <div style={{ overflow: 'hidden', position: 'absolute', width: '100%', height: '100%' }}>
            <div id="subject_container" />
            <div id="information_panel">
                <div className="information_on_panel">
                    <text>Subject name: {username}</text><br />
                    <text>Torture Subject Code: {sessionStorage.getItem("TSC")}</text><br />
                    <text>Simulations failed: {simulation_failed}</text><br />
                    <text>Simulations success: {simulation_success}</text><br />
                </div>
                <div id="pulse" />
            </div>
            <button onClick={hide_stats} style={{ backgroundColor: 'white', position: "absolute" }}>Go back</button>
        </div>
    );
}

export default Statistics;