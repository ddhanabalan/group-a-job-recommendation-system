import Lottie from "lottie-react";
import Turtle from '../../images/Turtle-in-space.json'
export default function NothingToShow() {
    return (
        <div className='qualification-card-h3 data-exception-featurebox' style={{ fontFamily: 'Inter-light-italic' }}>
            <Lottie className="data-exception-ani" animationData={Turtle} loop={true} />
            {/* <p>Your profile is like the vast expanse of space let's add some stars! 🌟</p> */}
        </div>
    )
}