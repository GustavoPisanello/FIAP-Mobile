import { Redirect } from 'expo-router';
import { Loading } from '../components/Loading';
import { useAuth } from '../hooks/useAuth';
import { LoginScreen } from '../screens/LoginScreen';

export default function LoginRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <Loading fullScreen label="Verificando sessão..." />;
    }

    if (user) {
        return <Redirect href="/users" />;
    }

    return <LoginScreen />;
}
