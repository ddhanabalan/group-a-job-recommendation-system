import React from 'react'
import './ReviewBox.css'
import StarIcon from '@mui/icons-material/Star';

const ReviewBox = ({reviewCount,rating}) => {
  const totalReviews = Object.values(reviewCount).reduce((partialSum, a) => partialSum + a, 0);
  

  function getWidth(revCount){
    return `${(revCount/totalReviews)*100}%`
  }
  function getColor(review){
    if(review > (3/4 * totalReviews))
    {
        return "green"
    }
    else if(review > (1/2 * totalReviews))
    {
        return "yellow"
    }
    else
    {
        return "red"
    }
  }
  return (
    <>
    <div className="rating-container">
    <div className='rating'>
        <div className='rating-num'>
        <p>{rating}</p>
        </div>
        <div className='star-icon'>
            <StarIcon sx={{color: "green"}}/>
        </div>
    </div>
    <div className='review-box'>
        {Object.keys(reviewCount).reverse().map(e => 
        <div className='review-level'>
            <div className='review-star-level'>
                <p>{e}</p>
                <StarIcon fontSize="small" sx={{color: "gray"}}/>
            </div>
            <div className='review-bar'>
                <div className='review-bar-fill' style={{width: getWidth(reviewCount[e]), backgroundColor: getColor(reviewCount[e])}}/>
            </div>
            <p>{reviewCount[e]}</p>
            
            
        </div>)
        }
    </div>
    </div>
    </>
  )
}

export default ReviewBox