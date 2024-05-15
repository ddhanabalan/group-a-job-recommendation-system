import Lottie from "lottie-react";
import LoaderAni from '../../images/loaderAnimation.json';
import './LoaderAnimation.css';
export default function LoaderAnimation() {

    return (
        <div className="loader-container">
            <Lottie className="loader" animationData={LoaderAni} loop={true} />
        </div>
    )
}