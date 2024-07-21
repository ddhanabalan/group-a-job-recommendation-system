import React, { forwardRef, useState, useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';

const CreateFormTextFields = forwardRef(function CreateFormTextFields({ inputPlaceholder, textVal = "", bordRad = "7px", fontsz = "auto", wparam = "inherit", hparam = "auto", minrows = 1, multipleLine = false, type = "text",bgColor = "#D9D9D9", items = [], select = false, disabled = false, onChange=null, ...props }, ref) {
 const [textInput, setTextInput] = useState('');
 const handleTextInput=(event)=>{
  setTextInput(event.target.value);
 }
 useEffect(()=>{if(onChange)onChange(textInput)}, [textInput])
  return (
    <TextField
      placeholder={inputPlaceholder}
      variant="standard"
      ref={ref}
      disabled={disabled}
      multiline={multipleLine}
      type={type}
      select={select}
      minRows={minrows}
      value={textInput}
      onChange={handleTextInput}
      onPaste={handlePaste}
      InputProps={{
        disableUnderline: true,
        sx: {
          '& .MuiInputBase-input': {
            textAlign: multipleLine && justify ? 'justify' : 'auto',
          },
        },
      }}
      sx={{
        backgroundColor: bgColor,
        paddingX: "10px ",
        paddingY: "5px 5px",

        borderRadius: bordRad,
        '.MuiInputBase-input': { fontSize: fontsz, fontFamily: "Inter-regular" },
        height: hparam,
        width: wparam,
      }}
      {...props}
    >
      {select && items.map((op) => (
        <MenuItem key={op} value={op}>
          {op}
        </MenuItem>
      ))}
    </TextField>
  );
});

export default CreateFormTextFields;
