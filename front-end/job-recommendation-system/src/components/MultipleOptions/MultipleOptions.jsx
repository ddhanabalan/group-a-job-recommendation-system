import './MultipleOptions.css';
import FormGroup from '@mui/material/FormGroup';
import { Box } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { v4 as uuid } from 'uuid';
import { useState } from 'react';


export default function MultipleOptions({ heading, options, onChange=() => {}, preselected=null, dataType=null, checkLimit=1, fSize=".938rem", margY="15px"}) {
    const [checkedItems, setCheckedItems] = useState(preselected?{[preselected]: true}:{});
    //console.log(checkedItems)

    //function to handle changed check boxes way it 
    function handleChange(option){
        const updatedCheckedItems = {...checkedItems, [option]: !checkedItems[option]}
        setCheckedItems(updatedCheckedItems);
        onChange(updatedCheckedItems, checkLimit, dataType);
    }
    return (
        <Box className='options-container' sx={{marginY: margY}}>
                {heading==""?<></>:<p className="options-heading">{heading}</p>}

                <FormGroup row >
                    {options.map(e => {
                        return (
                            <FormControlLabel key={uuid()} control={<Checkbox value={e} checked={checkedItems[e] || false} onChange={() => handleChange(e)} icon={<RadioButtonUncheckedRoundedIcon />} checkedIcon={<CheckCircleRoundedIcon />} />}
                                label={<span style={{ fontSize: fSize }}>{ e}</span>} />
                        )
                    })}
                </FormGroup>       
        </Box>

    )
}