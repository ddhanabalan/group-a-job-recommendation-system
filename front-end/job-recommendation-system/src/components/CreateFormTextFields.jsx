import React from 'react'
import { forwardRef } from 'react'
import { TextField, MenuItem } from '@mui/material'

const CreateFormTextFields = forwardRef(function CreateFormTextFields({inputPlaceholder, textVal="", bordRad="7px", fontsz="auto", wparam="inherit", hparam="auto", minrows=1,multipleLine=false, type="text", items=[] ,select=false, ...props}, ref){
    
    return (
    <TextField  placeholder={inputPlaceholder}  
                variant="standard"
                ref={ref}
                multiline={multipleLine}
                type={type} 
                select={select}
                minRows={minrows}
                InputProps={{
                    disableUnderline: true,
                  }}
                sx={{backgroundColor: "#D9D9D9",
                     paddingX: "10px ",
                     paddingY: "5px 5px",
                     
                     borderRadius: bordRad,
                     '.MuiInputBase-input': { fontSize: fontsz, fontFamily: "Inter-regular" },
                     height: hparam,
                     width: wparam
                     }}
                {...props}>
    {select?items.map((op) => (<MenuItem key={op} value={op}>{op}</MenuItem>)):""}
    </TextField>
    )
});

export default CreateFormTextFields;


