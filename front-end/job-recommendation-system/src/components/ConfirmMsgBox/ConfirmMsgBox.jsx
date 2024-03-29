import Lottie from "lottie-react";
import "./ConfirmMsgBox.css";
import greentick from '../../images/green-confirm.json'
export default function ConfBox(){
    return (
        <>
        
        <div className="confirm-box">
                <p>Account has been successfully created &emsp; </p>
                <Lottie className="success-ani" animationData={greentick} loop={true} />
        </div>
        </>
    )
}