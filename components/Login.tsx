import React, { useState, FormEvent } from 'react';
import { login, resetPassword } from '../services/authService';
import styles from './Login.module.css';

interface LoginProps {
    onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [mode, setMode] = useState<'login' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (mode === 'login') {
            if (!email || !senha) {
                setError('Por favor, preencha todos os campos.');
                return;
            }

            setLoading(true);

            try {
                const response = await login(email, senha);
                setSuccess(`Bem-vindo, ${response.user.nome || response.user.email}!`);

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
        } else {
            // Modo Redefinir / Criar Senha
            if (!email || !novaSenha) {
                setError('Por favor, informe seu e-mail e a nova senha.');
                return;
            }

            if (novaSenha.length < 6) {
                setError('A nova senha deve ter no mínimo 6 caracteres.');
                return;
            }

            setLoading(true);

            try {
                const response = await resetPassword(email, novaSenha);
                setSuccess('Senha cadastrada com sucesso! Autenticando...');

                setTimeout(() => {
                    if (onLoginSuccess) {
                        onLoginSuccess();
                    }
                }, 1200);
            } catch (err: any) {
                setError(err.message || 'Erro ao cadastrar senha. Verifique o e-mail informado.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Editorial Architect</h1>
                    <p className={styles.subtitle}>
                        {mode === 'login' ? 'ACCESS CONTROL V11.0' : 'CADASTRAR / REDEFINIR SENHA'}
                    </p>
                </div>

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">
                            Identificação (E-mail da Assinatura)
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

                    {mode === 'login' ? (
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="senha">
                                Chave de Acesso (Senha)
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
                    ) : (
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="novaSenha">
                                Criar Nova Senha de Acesso
                            </label>
                            <input
                                id="novaSenha"
                                type="password"
                                className={styles.input}
                                placeholder="Mínimo 6 caracteres"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                disabled={loading}
                                autoComplete="new-password"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading
                            ? 'Processando...'
                            : mode === 'login'
                            ? 'Entrar'
                            : 'Salvar Senha e Entrar'}
                    </button>
                </form>

                <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between text-[11px]">
                    <button
                        type="button"
                        onClick={() => {
                            setMode(mode === 'login' ? 'reset' : 'login');
                            setError('');
                            setSuccess('');
                        }}
                        className="text-gray-400 hover:text-white transition-colors underline"
                    >
                        {mode === 'login'
                            ? 'Assinou e não tem senha? Criar/Redefinir Senha'
                            : '← Voltar para a tela de Login'}
                    </button>
                </div>

                <div className={styles.footer}>
                    Restricted Area • Authorized Personnel Only
                </div>
            </div>
        </div>
    );
};

export default Login;
