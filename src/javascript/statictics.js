import React from "react";
import "./../css/statistics.css";

const Statistics = ({ simulation_success, simulation_failed, username, TSC }) => {

    return (
        <>
            <div id="subject_container" />
            <div id="information_panel">
                <div className="information_on_panel"><text style={{fontSize: '75%'}}>Subject name: {username}</text></div>
                <div className="information_on_panel">Torture Subject Code: {TSC}</div>
                <div className="information_on_panel">Simulations failed: {simulation_failed}</div>
                <div className="information_on_panel">Simulations success: {simulation_success}</div>
                <div id="pulse" />
            </div>
        </>
    );
}

export default Statistics;