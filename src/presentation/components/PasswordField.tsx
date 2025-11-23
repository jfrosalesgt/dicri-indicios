import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoComplete?: string;
  error?: boolean;
  helperText?: string;
}

export const PasswordField = ({
  label,
  value,
  onChange,
  disabled = false,
  autoComplete = 'current-password',
  error = false,
  helperText,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      label={label}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoComplete={autoComplete}
      error={error}
      helperText={helperText}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
              disabled={disabled}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
