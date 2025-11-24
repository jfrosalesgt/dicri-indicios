import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Card, Typography, Button, Alert, LinearProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useAuth } from '../context/AuthContext';
import { PasswordField } from '../components/PasswordField';

const rules = [
  { id: 'length', test: (v: string) => v.length >= 8, label: 'Al menos 8 caracteres' },
  { id: 'upper', test: (v: string) => /[A-Z]/.test(v), label: 'Una letra mayúscula' },
  { id: 'lower', test: (v: string) => /[a-z]/.test(v), label: 'Una letra minúscula' },
  { id: 'digit', test: (v: string) => /\d/.test(v), label: 'Un número' },
  { id: 'special', test: (v: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(v), label: 'Un carácter especial' },
];

interface PasswordFormData {
  current: string;
  next: string;
  confirm: string;
}

export const ChangePasswordPage = () => {
  const { changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid }, watch, reset } = useForm<PasswordFormData>({
    mode: 'onChange',
    defaultValues: {
      current: '',
      next: '',
      confirm: '',
    },
  });

  const nextPassword = watch('next');
  const confirmPassword = watch('confirm');

  const strengthCount = rules.reduce((acc, r) => acc + (r.test(nextPassword) ? 1 : 0), 0);
  const strength = (strengthCount / rules.length) * 100;

  const allRulesMet = rules.every(r => r.test(nextPassword));

  const onSubmit = async (data: PasswordFormData) => {
    setError('');
    setDone(false);

    if (data.next !== data.confirm) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (!allRulesMet) {
      setError('La nueva contraseña no cumple los requisitos mínimos');
      return;
    }

    setLoading(true);
    try {
      await changePassword({ 
        clave_actual: data.current, 
        clave_nueva: data.next 
      });
      setDone(true);
      reset();
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={640} mx="auto" width="100%">
      <Typography variant="h5" mb={3} fontWeight={600} display="flex" alignItems="center" gap={1}>
        <LockResetIcon /> Cambiar Contraseña
      </Typography>

      <Card sx={{ p:{ xs:3, md:4 }, borderRadius:3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {done && <Alert severity="success">Contraseña actualizada correctamente</Alert>}

          <Controller
            name="current"
            control={control}
            rules={{ 
              required: 'Contraseña actual es requerida',
              minLength: { value: 4, message: 'Mínimo 4 caracteres' }
            }}
            render={({ field }) => (
              <Box>
                <PasswordField 
                  label="Contraseña actual" 
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading} 
                  autoComplete="current-password"
                />
                {errors.current && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.current.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          <Controller
            name="next"
            control={control}
            rules={{ 
              required: 'Nueva contraseña es requerida',
              validate: {
                meetsRequirements: (value) => 
                  rules.every(r => r.test(value)) || 'No cumple con los requisitos mínimos'
              }
            }}
            render={({ field }) => (
              <Box>
                <PasswordField 
                  label="Nueva contraseña" 
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading} 
                  autoComplete="new-password"
                />
                {errors.next && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.next.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          <Controller
            name="confirm"
            control={control}
            rules={{ 
              required: 'Confirmar contraseña es requerido',
              validate: {
                matchesPrevious: (value) => 
                  value === nextPassword || 'Las contraseñas no coinciden'
              }
            }}
            render={({ field }) => (
              <Box>
                <PasswordField 
                  label="Confirmar nueva contraseña" 
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading} 
                  autoComplete="new-password"
                />
                {errors.confirm && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.confirm.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          <Box>
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              Requisitos:
            </Typography>
            <List dense>
              {rules.map(rule => {
                const ok = rule.test(nextPassword);
                return (
                  <ListItem key={rule.id} sx={{ py:0 }}>
                    <ListItemIcon sx={{ minWidth:32 }}>
                      {ok ? (
                        <CheckCircleIcon fontSize="small" color="success" />
                      ) : (
                        <CancelIcon fontSize="small" color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primaryTypographyProps={{ variant:'caption' }} 
                      primary={rule.label} 
                    />
                  </ListItem>
                );
              })}
            </List>
            <LinearProgress 
              variant="determinate" 
              value={strength} 
              sx={{ 
                height:8, 
                borderRadius:4,
                '& .MuiLinearProgress-bar': {
                  bgcolor: strength < 40 ? 'error.main' : strength < 80 ? 'warning.main' : 'success.main'
                }
              }} 
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Fortaleza: {strength < 40 ? 'Débil' : strength < 80 ? 'Media' : 'Fuerte'} ({Math.round(strength)}%)
            </Typography>
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || !isValid || !allRulesMet || nextPassword !== confirmPassword}
            sx={{ mt:1, fontWeight:600 }}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
