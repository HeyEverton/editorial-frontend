/**
 * Valida o número de CPF utilizando o algoritmo oficial de dígitos verificadores.
 */
export function validateCPF(cpfRaw: string): boolean {
    if (!cpfRaw) return false;
    const cpf = cpfRaw.replace(/\D/g, '');
    if (cpf.length !== 11) return false;

    // Elimina CPFs com todos os dígitos iguais (ex: 000.000.000-00, 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i), 10) * (10 - i);
    }
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9), 10)) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i), 10) * (11 - i);
    }
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10), 10)) return false;

    return true;
}

/**
 * Valida se a string é um endereço de e-mail válido.
 */
export function validateEmail(emailRaw: string): boolean {
    if (!emailRaw) return false;
    const email = emailRaw.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Formata um CPF no padrão 000.000.000-00.
 */
export function formatCPF(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/**
 * Formata um telefone no padrão (00) 00000-0000 ou (00) 0000-0000.
 */
export function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
        return digits
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
}
