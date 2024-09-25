import {useState} from "react";
import "./../css/test.css";

export default function Test(){
    const [is_looking_up, set_is_looking_up] = useState(false);

    return (
        <div style={{transformStyle: 'preserve-3d', perspective: '100px', width: '100%', height: '100%', position: 'absolute', overflow: 'hidden'}}>
            <div id="illusion_try" style={
                is_looking_up? {
                    transform: "rotateX(45deg) translate(0%, 0%)",
                    left: '0%',
                    bottom: '0%',
                    transition: 'transform 0.2s linear',
                    height: '100%',
                    width: '100%'
                }: {
                    transform: "rotateX(0deg) translate(0%, 0%)",
                    left: '0%',
                    bottom: '0%',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.2s linear'
                }
            }></div>
            <button onClick={() => {set_is_looking_up(!is_looking_up)}} style={{position: "relative", zIndex: '1'}}>Change looks</button>
        </div>
    )
}