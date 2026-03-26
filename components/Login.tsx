import React, { useState, FormEvent } from 'react';
import { login } from '../services/authService';
import styles from './Login.module.css';

interface LoginProps {
    onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validação básica
        if (!email || !senha) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            const response = await login(email, senha);
            setSuccess(`Bem-vindo, ${response.user.nome || response.user.email}!`);

            // Callback de sucesso após breve delay para mostrar mensagem
            setTimeout(() => {
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            }, 1000);
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Editorial Architect</h1>
                    <p className={styles.subtitle}>ACCESS CONTROL V11.0</p>
                </div>

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">
                            Identificação
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            placeholder="editor@elite.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            autoComplete="email"
                            autoFocus
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="senha">
                            Chave de Acesso
                        </label>
                        <input
                            id="senha"
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className={styles.footer}>
                    Restricted Area • Authorized Personnel Only
                </div>
            </div>
        </div>
    );
};

export default Login;
