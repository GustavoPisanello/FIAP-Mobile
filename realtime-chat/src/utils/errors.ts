import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
    'auth/invalid-email': 'Informe um endereço de e-mail válido.',
    'auth/missing-password': 'Informe sua senha.',
    'auth/weak-password': 'A senha deve possuir pelo menos 6 caracteres.',
    'auth/email-already-in-use': 'Já existe uma conta utilizando este e-mail.',
    'auth/user-not-found': 'E-mail ou senha inválidos.',
    'auth/wrong-password': 'E-mail ou senha inválidos.',
    'auth/invalid-credential': 'E-mail ou senha inválidos.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/operation-not-allowed': 'Este provedor de login não está habilitado no Firebase Authentication.',
    'auth/configuration-not-found': 'A configuração do Firebase Authentication não foi encontrada.',
    'auth/network-request-failed': 'Não foi possível conectar ao Firebase. Verifique sua conexão com a internet.',
    'auth/too-many-requests': 'Muitas tentativas de acesso. Tente novamente mais tarde.',
    'auth/account-exists-with-different-credential': 'Este e-mail já está cadastrado com outro provedor de login.',
    'auth/popup-closed-by-user': 'A janela de login foi fechada antes da conclusão.',
    'auth/cancelled-popup-request': 'O login anterior ainda estava em andamento. Tente novamente.',
    PERMISSION_DENIED: 'Você não tem permissão para acessar estes dados.',
};

const DATABASE_ERROR_MESSAGES: Record<string, string> = {
    'database/permission-denied': 'Você não tem permissão para acessar esta conversa.',
    'database/unavailable': 'Não foi possível conectar ao banco de dados. Verifique sua conexão.',
    'database/network-error': 'Falha de conexão com o Realtime Database.',
    'database/disconnected': 'Conexão com o Realtime Database perdida. Tentando reconectar...',
};

export function getErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado. Tente novamente.'): string {
    if (error instanceof FirebaseError) {
        return AUTH_ERROR_MESSAGES[error.code] ?? DATABASE_ERROR_MESSAGES[error.code] ?? `${fallback} (${error.code})`;
    }

    if (error instanceof Error) {
        if (error.message.includes('PERMISSION_DENIED')) {
            return AUTH_ERROR_MESSAGES.PERMISSION_DENIED;
        }

        return error.message;
    }

    return fallback;
}
