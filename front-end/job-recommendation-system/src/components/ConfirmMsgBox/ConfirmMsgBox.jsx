import Lottie from "lottie-react";
import "./ConfirmMsgBox.css";

export default function ConfBox({message, animation, bgcolor}){
    return (
        <>
        
        <div className="confirm-box" style={{backgroundColor: bgcolor}}>
                <p>{message} &emsp; </p>
                <Lottie className="success-ani" animationData={animation} loop={true} />
        </div>
        </>
    )
}