import { Redirect } from 'expo-router';
import { Loading } from '../components/Loading';
import { useAuth } from '../hooks/useAuth';

export default function IndexRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen label="Verificando sessão..." />;
  }

  return <Redirect href={user ? '/users' : '/login'} />;
}
