import './MultipleOptions.css';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { v4 as uuid } from 'uuid';
export default function MultipleOptions({ heading, options }) {
    return (
        <div className='options-container'>
                <p className="options-heading">{heading}</p>

            <FormGroup row>
                {options.map(e => {
                    return (
                        <FormControlLabel key={uuid()} control={<Checkbox defaultChecked icon={<RadioButtonUncheckedRoundedIcon />} checkedIcon={<CheckCircleRoundedIcon />} />}
                            label={<span style={{ fontSize: '.938rem' }}>{ e}</span>} />
                    )
                })}
                </FormGroup>       
        </div>

    )
}