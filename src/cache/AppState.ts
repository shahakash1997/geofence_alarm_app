import {hookstate, useHookstate} from '@hookstate/core';

export interface UserSession {
    isLoggedIn: boolean;
    token: string | null;
    user: string | null;
}

const initialGlobalState = hookstate({
    isLoggedIn: false,
    token: null,
    user: null,
});

export const useGlobalSessionState = () => {
    const currentUserSession = useHookstate(initialGlobalState);
    return {
        getUserSession: () => currentUserSession.value,
        setUserSession: (session: any) => {
            currentUserSession.set(session);
        },
    };
};
