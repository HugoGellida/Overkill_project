import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LightBulb from "../component/Light-bulb";
import "./../css/lobby.css";
import Table from "../component/Table";
import Test from "./test";
import Statistics from "./statictics";


export default function Lobby() {
    const navigate = React.useNavigate;
    const [show_join_game, set_show_join_game] = React.useState(false);
    const [show_statistics, setShow_statistics] = React.useState(false);
    const [show_parameters, setShow_parameters] = React.useState(false);
    const [show_create_game, setShow_create_game] = React.useState(false);
    const [test, setTest] = React.useState(false);
    const [item_behind_mouse, set_item_behind_mouse] = React.useState(null);
    const [cards, set_cards] = React.useState({
        "create_game": {
            rotation_end: Math.floor((Math.random() - 0.5) * 180),
            left_end: 50,
            top_position: 50
        },
        "join_game": {
            rotation_end: Math.floor((Math.random() - 0.5) * 180),
            left_end: 64,
            top_position: 27
        },
        "statistics": {
            rotation_end: Math.floor((Math.random() - 0.5) * 180),
            left_end: 27,
            top_position: 30
        },
        "parameters": {
            rotation_end: Math.floor((Math.random() - 0.5) * 180),
            left_end: 78,
            top_position: 46
        },
        "test": {
            rotation_end: Math.floor((Math.random() - 0.5) * 180),
            left_end: 32,
            top_position: -20
        }
    });

    const show = (event) => {
        switch (event.target.id) {
            case "game_list":
                set_show_join_game(true);
                break;
            case "create_game":
                setShow_create_game(true);
                break;

            case "statistics":
                setShow_statistics(true);
                break;
            case "parameters":
                setShow_parameters(true);
                break;
            default:
                setTest(true);
                break;
        }
    }
    const set_attribute_card = (id) => {
        console.log(cards[id]);
        const random_rotation = cards[id].rotation_end;
        const left_end = cards[id].left_end;
        const top_position = cards[id].top_position;
        return {
            width: "10vh",
            height: "10vh",
            position: "relative",
            transform: `rotate(${random_rotation}deg)`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            borderRadius: "5%",
            left: `${left_end}%`,
            top: `${top_position}%`,
            border: "1px solid rgb(20, 20, 20)",
            boxShadow: "0px 0px 1px 1px rgb(100, 100, 100)",
            backgroundColor: id === item_behind_mouse ? "rgb(100, 100, 100)" : "rgb(40, 40, 40)",
            animation: `flicker 10s infinite, throw_card${random_rotation} 1s ease-out`
        }
    }

    const simulate_throw_card = (rotation_end, left_end) => {
        return `@keyframes throw_card${rotation_end} {
                0% {
                    left: 150vw;
                    transform: rotate(90deg);
                }
                100% {
                left: ${left_end}%;
                    transform: translateX(0%) rotate(${rotation_end}deg);
                }
            }`;
    }

    useEffect(() => {
        const style = document.createElement("style");
        document.head.appendChild(style);
        Object.keys(cards).forEach(name => {
            console.dir(cards[name]);
            const generate_animation = simulate_throw_card(cards[name].rotation_end, cards[name].left_end);
            style.sheet.insertRule(generate_animation, style.sheet.cssRules.length);
        });
        return () => {
            document.head.removeChild(style);
        }
    }, [cards]);

    return (
        <>
            {!test && (
                <div id="background_lobby">
                    {show_statistics && (
                        <Statistics />
                    )}
                    {!show_statistics && (
                        <>
                            <div id="light" style={{ left: '20%' }} />
                            <div id="light" style={{ right: '20%', animation: 'secondary_flicker 10s alternate infinite' }} />
                            <LightBulb />
                            <Table><div id="create_game" title="Create a game" onMouseOver={() => { set_item_behind_mouse("create_game") }} onMouseLeave={() => { set_item_behind_mouse(null) }} style={{
                                ...set_attribute_card("create_game"),
                                backgroundImage: "url('./Create_game.png'"
                            }} /><div id="join_game" title="Join a game" onMouseOver={() => { set_item_behind_mouse("join_game") }} onMouseLeave={() => { set_item_behind_mouse(null) }} style={{
                                ...set_attribute_card("join_game"),
                                backgroundImage: "url('./Join_game.png')"
                            }} /><div id="parameters" title="Check parameters" onMouseOver={() => { set_item_behind_mouse("parameters") }} onMouseLeave={() => { set_item_behind_mouse(null) }} onClick={show} style={{
                                ...set_attribute_card("parameters"),
                                backgroundImage: "url('./Parameters.png')"
                            }} /><div id="statistics" title="Check statistics" onMouseOver={() => { set_item_behind_mouse("statistics") }} onMouseLeave={() => { set_item_behind_mouse(null) }} onClick={show} style={{
                                ...set_attribute_card("statistics"),
                                backgroundImage: "url('./Statistics.png')"
                            }} /><div id="test" title="Activate test" onMouseOver={() => { set_item_behind_mouse("test") }} onMouseLeave={() => { set_item_behind_mouse(null) }} style={{
                                ...set_attribute_card("test"),
                                backgroundImage: "url('./Test.png')"
                            }} onClick={show} /></Table>
                        </>
                    )}
                </div>
            )}
            {test && (<Test />)}
        </>
    )
}