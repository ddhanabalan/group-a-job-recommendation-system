import React, { forwardRef, useState, useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';

const CreateFormTextFields = forwardRef(function CreateFormTextFields(
  {
    inputPlaceholder = "",
    defaultValue = "",
    bordRad = "7px",
    fontsz = "auto",
    wparam = "inherit",
    hparam = "auto",
    minrows = 1,
    multipleLine = false,
    type = "text",
    bgColor = "#D9D9D9",
    items = [],
    select = false,
    disabled = false,
    justify = false,
    onChange = null,
    ...props
  },
  ref
) {
  const [textInput, setTextInput] = useState(defaultValue);

  const handleTextInput = (event) => {
    setTextInput(event.target.value);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text');

    // Insert the pasted text at the current cursor position
    const { selectionStart, selectionEnd } = event.target;
    const newValue =
      textInput.slice(0, selectionStart) +
      pastedText +
      textInput.slice(selectionEnd);

    setTextInput(newValue);
  };

  useEffect(() => {
    if (onChange) onChange(textInput);
  }, [textInput, onChange]);

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
        paddingX: multipleLine && justify ? "20px" : "10px",
        paddingY: multipleLine && justify ? "20px" : "0px",
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
