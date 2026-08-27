import type { Persistence } from 'firebase/auth';

/**
 * O bundle React Native do firebase/auth exporta getReactNativePersistence em runtime,
 * mas os tipos publicados apontam apenas para o bundle web. Declaramos o export aqui.
 */
declare module 'firebase/auth' {
    export type ReactNativeAsyncStorage = {
        setItem(key: string, value: string): Promise<void>;
        getItem(key: string): Promise<string | null>;
        removeItem(key: string): Promise<void>;
    };

    export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
