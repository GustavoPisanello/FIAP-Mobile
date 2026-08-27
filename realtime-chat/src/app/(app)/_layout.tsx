import { Redirect, Stack } from 'expo-router';
import { Loading } from '../../components/Loading';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen label="Verificando sessão..." />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
