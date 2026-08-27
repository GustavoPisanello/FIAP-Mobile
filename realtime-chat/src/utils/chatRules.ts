import { AuthProvider } from '../types/user';

const PROVIDER_LABELS: Record<AuthProvider, string> = {
    password: 'E-mail e senha',
    google: 'Google',
    apple: 'Apple',
};

export function getProviderLabel(provider: AuthProvider): string {
    return PROVIDER_LABELS[provider];
}

/**
 * Regra do trabalho: E-mail/Senha só conversa com Google ou Apple, e vice-versa.
 * Ou seja, exatamente um dos dois participantes precisa ser 'password'.
 */
export function canChatWith(current: AuthProvider, other: AuthProvider): boolean {
    return (current === 'password') !== (other === 'password');
}

export function getAllowedProviders(provider: AuthProvider): AuthProvider[] {
    return provider === 'password' ? ['google', 'apple'] : ['password'];
}

/**
 * Id determinístico com os dois uids ordenados, para que os dois participantes
 * cheguem sempre à mesma conversa e as regras de segurança consigam validar
 * o acesso apenas pelo nome do nó.
 */
export function buildConversationId(uidA: string, uidB: string): string {
    return [uidA, uidB].sort().join('_');
}
