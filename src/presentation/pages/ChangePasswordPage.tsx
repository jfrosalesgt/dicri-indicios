import { useState } from 'react';
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

export const ChangePasswordPage = () => {
  const { changePassword } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const strengthCount = rules.reduce((acc, r) => acc + (r.test(next) ? 1 : 0), 0);
  const strength = (strengthCount / rules.length) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDone(false);
    if (next !== confirm) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    const unmet = rules.filter(r => !r.test(next));
    if (unmet.length) {
      setError('La nueva contraseña no cumple los requisitos mínimos');
      return;
    }
    setLoading(true);
    try {
      await changePassword({ clave_actual: current, clave_nueva: next });
      setDone(true);
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={640} mx="auto" width="100%">
      <Typography variant="h5" mb={3} fontWeight={600} display="flex" alignItems="center" gap={1}><LockResetIcon /> Cambiar Contraseña</Typography>
      <Card sx={{ p:{ xs:3, md:4 }, borderRadius:3 }}>
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {done && <Alert severity="success">Contraseña actualizada correctamente</Alert>}
          <PasswordField label="Contraseña actual" value={current} onChange={setCurrent} required disabled={loading} autoComplete="current-password" />
          <PasswordField label="Nueva contraseña" value={next} onChange={setNext} required disabled={loading} autoComplete="new-password" />
          <PasswordField label="Confirmar nueva contraseña" value={confirm} onChange={setConfirm} required disabled={loading} autoComplete="new-password" />
          <Box>
            <Typography variant="caption" fontWeight={600} color="text.secondary">Requisitos:</Typography>
            <List dense>
              {rules.map(rule => {
                const ok = rule.test(next);
                return (
                  <ListItem key={rule.id} sx={{ py:0 }}>
                    <ListItemIcon sx={{ minWidth:32 }}>
                      {ok ? <CheckCircleIcon fontSize="small" color="success" /> : <CancelIcon fontSize="small" color="disabled" />}
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ variant:'caption' }} primary={rule.label} />
                  </ListItem>
                );
              })}
            </List>
            <LinearProgress variant="determinate" value={strength} sx={{ height:8, borderRadius:4 }} />
          </Box>
          <Button type="submit" variant="contained" color="primary" disabled={loading || !current || !next || !confirm} sx={{ mt:1, fontWeight:600 }}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
