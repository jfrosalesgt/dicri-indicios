import { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  errorText?: string;
  autoComplete?: string;
}

export const PasswordField = ({ label, value, onChange, name, required, disabled, errorText, autoComplete }: PasswordFieldProps) => {
  const [show, setShow] = useState(false);
  return (
    <TextField
      fullWidth
      type={show ? 'text' : 'password'}
      label={label}
      name={name}
      value={value}
      required={required}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      error={Boolean(errorText)}
      helperText={errorText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" onClick={() => setShow(s => !s)} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
