import StoresPage from './features/sample-stores/StoresPage';
import LoginPage from './features/auth/LoginPage';
import useHashRoute from './useHashRoute';

export default function App() {
    const route = useHashRoute();

    if (route === '/login') return <LoginPage />;
    return <StoresPage />;
}
