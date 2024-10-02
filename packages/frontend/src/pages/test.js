import React from "react";
import "./test.css";
import socket from "./../socket";

export default function Test() {
    const [start_game, set_start_game] = React.useState(false);
    const [must_play, set_must_play] = React.useState(false);

    React.useEffect(() => {
        socket.emit("join_game", sessionStorage.getItem("TSC"));
        socket.on("play", (cards) => {
            set_must_play(true);
            console.dir(cards);
        });

        socket.on("start_game_allowed", () => {set_start_game(true)});
    }, []);

    const ask_start_game = () => {socket.emit("ask_start_game")}

    return (
        <>
            {!start_game? (
                <>
                    <button onClick={ask_start_game}>Start the test</button>
                </>
            ): (
                <>
                {must_play? (
                    <>
                        <button onClick={() => {
                                socket.emit("play_answer", "draw");
                                set_must_play(false);
                            }}>Draw</button>
                        <button onClick={() => {
                                socket.emit("play_answer", "stay");
                                set_must_play(false);
                            }}>Stay</button>
                    </>
                ): (
                    <>
                    </>
                )}
                </>
            )}
        </>
    );
}