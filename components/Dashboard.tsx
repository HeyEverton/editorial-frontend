import React from 'react';
import { logout, getCurrentUser, User } from '../services/authService';

interface DashboardProps {
    onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleLogout = () => {
        logout();
        if (onLogout) {
            onLogout();
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Dashboard</h1>
                <div style={styles.content}>
                    <p style={styles.welcome}>
                        Bem-vindo, <strong>{user?.nome || user?.email}</strong>!
                    </p>
                    <p style={styles.info}>
                        Você está autenticado no sistema Editorial Architect.
                    </p>
                    <p style={styles.email}>
                        Email: {user?.email}
                    </p>
                    <button style={styles.button} onClick={handleLogout}>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    card: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '60px 50px',
        maxWidth: '500px',
        width: '100%',
        margin: '20px',
    },
    title: {
        fontSize: '32px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '30px',
        textAlign: 'center',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    welcome: {
        fontSize: '18px',
        color: '#333',
        margin: 0,
    },
    info: {
        fontSize: '14px',
        color: '#666',
        margin: 0,
    },
    email: {
        fontSize: '14px',
        color: '#999',
        fontFamily: 'monospace',
        margin: 0,
    },
    button: {
        marginTop: '20px',
        padding: '14px 28px',
        border: 'none',
        background: '#667eea',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'all 0.3s ease',
    },
};

export default Dashboard;
