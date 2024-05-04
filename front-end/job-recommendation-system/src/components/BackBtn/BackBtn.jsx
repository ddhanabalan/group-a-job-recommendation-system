import React from 'react'
import { IconButton } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

const BackBtn = ({outlineShape="circle", butColor="black"}) => {
  console.log("outline:", outlineShape, " color:", butColor)
  return (
    <div>
        <IconButton aria-label="back" sx={{display: "flex", alignItems: "center", width: 35, height: 35, borderRadius:(outlineShape=="square"?"0%": "50%")}}>
            <ArrowBackIosIcon sx={{color: ((butColor=="black")?"black":"white"), position: 'relative', left: "0.25rem"}}/>
        </IconButton>
    </div>
  )
}

export default BackBtn