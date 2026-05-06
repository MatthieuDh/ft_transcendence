import Layout from './layout';
import { Outlet } from 'react-router-dom';

export default function ConditionalLayout() {
    // simple client-side check: if access_token exists, render the Layout (which contains its own Outlet)
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    if (token) {
        return <Layout />;
    }

    return <Outlet />;
}
