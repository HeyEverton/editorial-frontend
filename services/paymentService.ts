import api from './authService';

export interface SubscribePayload {
    planId: string;
    billingCycle: 'mensal' | 'anual';
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
    name: string;
    email: string;
    cpf: string;
    phone?: string;
    creditCard?: {
        holderName: string;
        number: string;
        expiryMonth: string;
        expiryYear: string;
        ccv: string;
    };
    creditCardHolderInfo?: {
        name: string;
        email: string;
        cpfCnpj: string;
        postalCode: string;
        addressNumber: string;
        phone: string;
    };
}

export interface SubscribeResponse {
    message: string;
    subscriptionId?: string;
    paymentId?: string;
    billingType: string;
    status: string;
    pixQrCode?: {
        encodedImage: string;
        payload: string;
        expirationDate?: string;
    } | null;
    bankSlipUrl?: string | null;
    invoiceUrl?: string | null;
}

export interface PaymentStatusResponse {
    id: string;
    status: string;
    isPaid: boolean;
    paymentDate?: string | null;
    pixQrCodeUrl?: string | null;
    pixCopyPaste?: string | null;
}

/**
 * Cria a assinatura e a cobrança inicial (Pix/Cartão/Boleto).
 */
export async function subscribePlan(payload: SubscribePayload): Promise<SubscribeResponse> {
    try {
        const response = await api.post<SubscribeResponse>('/payments/subscribe', payload);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { error: 'Erro ao processar assinatura' };
    }
}

/**
 * Consulta o status atual de um pagamento via Polling.
 */
export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    try {
        const response = await api.get<PaymentStatusResponse>(`/payments/${paymentId}/status`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { error: 'Erro ao consultar status do pagamento' };
    }
}
