import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  CreditCard,
  QrCode,
  Copy,
  CheckCircle2,
  ChevronDown,
  Check,
  Wifi,
  User as UserIcon,
  Mail,
  FileText,
  Phone,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { getPlanById, BillingCycle } from "../plans";
import { getCurrentUser, User } from "../services/authService";
import { subscribePlan, getPaymentStatus } from "../services/paymentService";
import { validateCPF, validateEmail, formatCPF, formatPhone } from "../utils/validators";

const GridTexture = ({ opacity = 0.04, size = 40 }) => (
  <svg
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    }}
  >
    <defs>
      <pattern
        id={`g${size}${opacity}`}
        width={size}
        height={size}
        patternUnits="userSpaceOnUse"
      >
        <path
          d={`M ${size} 0 L 0 0 0 ${size}`}
          fill="none"
          stroke={`rgba(0,0,0,${opacity})`}
          strokeWidth="0.5"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#g${size}${opacity})`} />
  </svg>
);

type Step = 1 | 2 | 3;

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  // Ler a escolha do plano e ciclo do sessionStorage
  const [plan] = useState(() => {
    const storedId = sessionStorage.getItem("selected_plan_id");
    return getPlanById(storedId);
  });

  const [cycle] = useState<BillingCycle>(() => {
    const storedCycle = sessionStorage.getItem("selected_billing_cycle");
    return storedCycle === "anual" ? "anual" : "mensal";
  });

  const isAnual = cycle === "anual";
  const displayPrice = isAnual ? plan?.priceAnual || "" : plan?.priceMensal || "";
  const displayPeriod = isAnual ? plan?.periodAnual || "" : plan?.periodMensal || "";

  // Estado do Wizard (Etapa 1, 2, 3)
  const [step, setStep] = useState<Step>(1);
  const [tab, setTab] = useState<"pix" | "credit">("pix");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dados de Identificação (Etapa 1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
  });

  // Erros de validação
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    cpf?: string;
    cardNumber?: string;
    cardName?: string;
    expiry?: string;
    cvv?: string;
  }>({});

  // Dados do Cartão de Crédito (Etapa 2 - Aba Cartão)
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [installments, setInstallments] = useState("1");

  // Retorno da Cobrança Pix do Asaas
  const [paymentData, setPaymentData] = useState<{
    paymentId?: string;
    subscriptionId?: string;
    pixQrCode?: {
      encodedImage: string;
      payload: string;
    } | null;
  } | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [pollingActive, setPollingActive] = useState(false);

  // Carregar usuário autenticado para pré-preenchimento
  useEffect(() => {
    if (!plan) {
      navigate("/", { replace: true });
      return;
    }

    getCurrentUser().then((user: User | null) => {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.nome || prev.name,
          email: user.email || prev.email,
          cpf: user.cpf ? formatCPF(user.cpf) : prev.cpf,
          phone: user.phone ? formatPhone(user.phone) : prev.phone,
        }));
      }
    });

    return () => {
      sessionStorage.removeItem("selected_plan_id");
      sessionStorage.removeItem("selected_billing_cycle");
    };
  }, [plan, navigate]);

  // Polling automático para Pix (rota GET /api/payments/:id/status)
  useEffect(() => {
    let intervalId: any = null;

    if (pollingActive && paymentData?.paymentId && step === 2 && tab === "pix") {
      intervalId = setInterval(async () => {
        try {
          const res = await getPaymentStatus(paymentData.paymentId!);
          if (res.isPaid || res.status === "RECEIVED" || res.status === "CONFIRMED") {
            setPollingActive(false);
            setStep(3);
          }
        } catch (error) {
          console.error("Erro no polling de status Pix:", error);
        }
      }, 4000); // Polling a cada 4 segundos
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pollingActive, paymentData?.paymentId, step, tab]);

  if (!plan) {
    return null;
  }

  // Mascaramento e Formatação visual do Cartão de Crédito
  const getMaskedCardNumber = () => {
    const digits = cardNumber.replace(/\D/g, "");
    if (digits.length === 0) return "•••• •••• •••• 3492";

    let dynamicMasked = "";
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) dynamicMasked += " ";
      if (i < 12) dynamicMasked += "•";
      else dynamicMasked += digits[i];
    }
    return dynamicMasked;
  };

  const getMaskedName = () => {
    if (!cardName) return "NOME TITULAR";
    return cardName.toUpperCase();
  };

  // Gerar opções de parcelamento
  const getInstallmentOptions = () => {
    const numericPrice = parseFloat(displayPrice.replace(".", "").replace(",", "."));
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return [<option key={1} value="1">1x de R$ {displayPrice},00 (à vista)</option>];
    }

    const options = [];
    const maxInstallments = numericPrice >= 1000 ? 12 : numericPrice >= 200 ? 6 : 3;

    for (let i = 1; i <= maxInstallments; i++) {
      const installmentValue = (numericPrice / i).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      options.push(
        <option key={i} value={i}>
          {i}x de R$ {installmentValue} {i === 1 ? "(à vista)" : "sem juros"}
        </option>
      );
    }
    return options;
  };

  // Validação da Etapa 1 (Dados do Usuário)
  const validateStep1 = () => {
    const errors: { name?: string; email?: string; cpf?: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Nome completo é obrigatório";
    }

    if (!formData.email.trim()) {
      errors.email = "E-mail é obrigatório";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Por favor, insira um e-mail válido";
    }

    if (!formData.cpf.trim()) {
      errors.cpf = "CPF é obrigatório para emissão da cobrança";
    } else if (!validateCPF(formData.cpf)) {
      errors.cpf = "CPF inválido. Verifique os números informados";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Avançar da Etapa 1 para Etapa 2
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateStep1()) {
      return;
    }

    setStep(2);

    // Se a aba padrão for Pix, gera a cobrança Pix imediatamente
    if (tab === "pix" && !paymentData) {
      generatePixCharge();
    }
  };

  // Função para gerar a cobrança Pix no Asaas
  const generatePixCharge = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await subscribePlan({
        planId: plan.id,
        billingCycle: cycle,
        billingType: "PIX",
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ""),
        phone: formData.phone.replace(/\D/g, ""),
      });

      setPaymentData({
        paymentId: response.paymentId,
        subscriptionId: response.subscriptionId,
        pixQrCode: response.pixQrCode,
      });

      if (response.paymentId) {
        setPollingActive(true);
      }
    } catch (err: any) {
      console.error("Erro ao gerar Pix:", err);
      setErrorMessage(
        err.message || err.error || "Ocorreu um erro ao gerar a cobrança Pix no gateway."
      );
    } finally {
      setLoading(false);
    }
  };

  // Trocar de aba entre Pix e Cartão de Crédito
  const handleTabChange = (newTab: "pix" | "credit") => {
    setTab(newTab);
    setErrorMessage(null);
    if (newTab === "pix" && !paymentData && !loading) {
      generatePixCharge();
    }
  };

  // Processar pagamento via Cartão de Crédito
  const handleCreditCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const errors: { cardNumber?: string; cardName?: string; expiry?: string; cvv?: string } = {};

    const cleanCardNumber = cardNumber.replace(/\D/g, "");
    if (cleanCardNumber.length < 13) {
      errors.cardNumber = "Insira um número de cartão válido";
    }

    if (!cardName.trim()) {
      errors.cardName = "Nome no cartão é obrigatório";
    }

    if (!expiry || expiry.length < 5 || !expiry.includes("/")) {
      errors.expiry = "Validade inválida (MM/AA)";
    }

    const cleanCvv = cvv.replace(/\D/g, "");
    if (cleanCvv.length < 3) {
      errors.cvv = "CVV inválido";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    const expiryParts = expiry.split("/");
    const expiryMonth = expiryParts[0].padStart(2, "0");
    let expiryYear = expiryParts[1] || "";
    if (expiryYear.length === 2) expiryYear = "20" + expiryYear;

    try {
      const response = await subscribePlan({
        planId: plan.id,
        billingCycle: cycle,
        billingType: "CREDIT_CARD",
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ""),
        phone: formData.phone.replace(/\D/g, ""),
        creditCard: {
          holderName: cardName.toUpperCase(),
          number: cleanCardNumber,
          expiryMonth,
          expiryYear,
          ccv: cleanCvv,
        },
        creditCardHolderInfo: {
          name: cardName.toUpperCase(),
          email: formData.email,
          cpfCnpj: formData.cpf.replace(/\D/g, ""),
          postalCode: "01001-000",
          addressNumber: "100",
          phone: formData.phone.replace(/\D/g, "") || "11999999999",
        },
      });

      setPaymentData({
        paymentId: response.paymentId,
        subscriptionId: response.subscriptionId,
      });

      // Transiciona para a tela de Sucesso se o pagamento/assinatura foi aprovado
      setStep(3);
    } catch (err: any) {
      console.error("Erro no pagamento por cartão:", err);
      setErrorMessage(
        err.message || err.error || "Transação não autorizada. Verifique os dados do cartão e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Copiar chave Pix Copia e Cola
  const handleCopyPix = () => {
    if (paymentData?.pixQrCode?.payload) {
      navigator.clipboard.writeText(paymentData.pixQrCode.payload);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  // -------------------------------------------------------------
  // RENDERIZAÇÃO: ETAPA 3 (SUCESSO)
  // -------------------------------------------------------------
  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col relative overflow-hidden font-sans text-gray-900">
        <GridTexture opacity={0.03} size={30} />

        <header className="flex justify-between items-center py-6 px-12 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm z-10">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="font-serif text-xl font-bold tracking-widest text-black">
              AE·STUDIO
            </span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold tracking-widest text-gray-400">
            <button
              className="hover:text-black transition-colors uppercase"
              onClick={() => navigate("/")}
            >
              Suporte
            </button>
            <button
              className="hover:text-black transition-colors uppercase"
              onClick={() => navigate("/elite")}
            >
              Painel
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-8 z-10">
          <div className="bg-white border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-12 lg:p-16 max-w-xl w-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full border border-emerald-500/30 bg-emerald-50 flex items-center justify-center mb-8">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>

            <h1 className="font-serif text-3xl lg:text-4xl mb-4 text-black">
              Pagamento Confirmado!
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
              Sua assinatura do plano <strong>{plan.name}</strong> ({isAnual ? "Anual" : "Mensal"}) está <strong>ATIVA</strong>.
              Seu acesso às ferramentas premium da Arquitetura Editorial foi liberado.
            </p>

            <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg w-full mb-8 text-left text-xs text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Plano Contratado:</span>
                <span className="font-bold text-black">{plan.name} ({isAnual ? "Anual" : "Mensal"})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Método de Pagamento:</span>
                <span className="font-bold text-black uppercase">{tab === "pix" ? "Pix Instantâneo" : "Cartão de Crédito"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Status no Asaas:</span>
                <span className="font-bold text-emerald-600 uppercase">Confirmado</span>
              </div>
              {paymentData?.paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">ID da Transação:</span>
                  <span className="font-mono text-[11px] text-gray-700">{paymentData.paymentId}</span>
                </div>
              )}
            </div>

            <div className="flex gap-4 mb-8 w-full justify-center">
              <button
                onClick={() => navigate("/elite")}
                className="bg-black text-white px-8 py-4 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors w-full"
              >
                Acessar o Painel Principal
              </button>
            </div>

            <div className="w-full h-px bg-gray-100 mb-6" />
            <p className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">
              ARQUITETURA EDITORIAL · ASSINATURA VERIFICADA
            </p>
          </div>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDERIZAÇÃO: ETAPAS 1 & 2 (WIZARD)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-gray-900">
      <header className="flex justify-between items-center py-6 px-12 border-b border-gray-200 bg-white">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="font-serif text-xl font-bold tracking-widest text-black">
            AE·STUDIO
          </span>
        </div>

        {/* Indicador de Etapas do Wizard */}
        <div className="hidden md:flex items-center gap-6 text-xs">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-black font-bold" : "text-gray-400"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}>
              1
            </span>
            <span>Identificação</span>
          </div>

          <div className="w-8 h-px bg-gray-200" />

          <div className={`flex items-center gap-2 ${step >= 2 ? "text-black font-bold" : "text-gray-400"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}>
              2
            </span>
            <span>Pagamento ({tab === "pix" ? "Pix" : "Cartão"})</span>
          </div>

          <div className="w-8 h-px bg-gray-200" />

          <div className={`flex items-center gap-2 ${step >= 3 ? "text-black font-bold" : "text-gray-400"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}>
              3
            </span>
            <span>Conclusão</span>
          </div>
        </div>

        <div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] text-gray-400">
          <button
            className="hover:text-black transition-colors uppercase"
            onClick={() => navigate("/")}
          >
            Contato
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full p-8 lg:p-16 gap-16 lg:items-start items-center">
        {/* Resumo do Plano Selecionado */}
        <div className="w-full lg:w-[380px] flex flex-col gap-8 shrink-0">
          <div>
            <h1 className="font-serif text-4xl lg:text-5xl mb-3 text-black">Checkout</h1>
            <p className="text-gray-600 text-sm">
              Conclua sua assinatura do Arquitetura Editorial.
            </p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm p-8 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                  Plano Selecionado
                </div>
                <h2 className="font-serif text-3xl leading-tight text-black">
                  Plano {plan.name}
                  <span className="block text-[11px] font-sans font-medium text-gray-500 mt-1 uppercase tracking-wider">
                    {isAnual ? "Plano Anual" : "Plano Mensal"}
                  </span>
                </h2>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                  Valor
                </div>
                <div className="flex items-baseline gap-1 text-black">
                  <span className="font-serif text-lg font-bold">R$</span>
                  <span className="font-serif text-3xl font-bold">
                    {displayPrice}
                  </span>
                  <span className="text-xs font-serif">{displayPeriod}</span>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 my-6" />

            {/* Benefícios do Plano */}
            <ul className="space-y-3">
              {plan.items.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <Check size={16} className="mt-0.5 shrink-0 text-black" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 text-gray-500 text-xs font-bold tracking-wider uppercase">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="tracking-[0.1em]">
              Pagamento Criptografado via Asaas Gateway
            </span>
          </div>

          <div>
            <a
              href="https://www.asaas.com/sobre-nos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 border border-gray-200/80 hover:border-blue-200 rounded-full px-4 py-2 bg-white text-[9px] font-bold text-gray-400 tracking-widest uppercase transition-all hover:bg-blue-50/30"
            >
              <i>
                <span>processado por</span>
              </i>
              <span className="flex items-center gap-1.5 font-bold tracking-tight text-[#0030FF]">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <rect width="32" height="32" rx="8" fill="#0030FF" />
                  <path
                    d="M21.5 22H18.8V20.1H18.9C18.4 20.9 17.3 22.2 15.4 22.2C13.1 22.2 11.6 20.6 11.6 18.3C11.6 15.8 13.4 14.3 16.2 14.2L18.8 14.1V13.6C18.8 12.7 18.2 12.1 17 12.1C15.9 12.1 15 12.5 14.2 13.1L13.3 11.5C14.4 10.7 15.8 10.3 17.3 10.3C19.9 10.3 21.5 11.6 21.5 13.7V22ZM18.8 17.1L17 17.2C15.6 17.3 14.7 18 14.7 19.1C14.7 20.1 15.5 20.8 16.6 20.8C18.1 20.8 18.8 19.7 18.8 18.5V17.1Z"
                    fill="white"
                  />
                </svg>
                <span className="font-extrabold text-[12px] tracking-tight">
                  asaas
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* Card Principal do Wizard */}
        <div className="flex-1 w-full max-w-[560px] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          {/* Mensagem de Erro Global */}
          {errorMessage && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs flex items-start gap-3">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <div>
                <p className="font-bold mb-0.5">Erro no processamento</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Abas de Navegação / Etapas */}
          <div className="flex border-b border-gray-100">
            {step === 1 ? (
              <div className="flex-1 py-5 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-black relative">
                <UserIcon size={14} />
                1. Seus Dados Pessoais
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleTabChange("pix")}
                  className={`flex-1 py-5 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors relative
                    ${tab === "pix" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <QrCode size={14} />
                  Pix Instantâneo
                  {tab === "pix" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
                </button>
                <button
                  onClick={() => handleTabChange("credit")}
                  className={`flex-1 py-5 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors relative
                    ${tab === "credit" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <CreditCard size={14} />
                  Cartão de Crédito
                  {tab === "credit" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
                </button>
              </>
            )}
          </div>

          <div className="p-8 lg:p-12 flex-1 flex flex-col">
            {/* -------------------------------------------------------------
                ETAPA 1: DADOS DO USUÁRIO
               ------------------------------------------------------------- */}
            {step === 1 && (
              <form onSubmit={handleProceedToStep2} className="space-y-6 max-w-[400px] mx-auto w-full">
                <div className="mb-2">
                  <h3 className="font-serif text-2xl text-black mb-1">Identificação</h3>
                  <p className="text-xs text-gray-500">
                    Insira seus dados para gerar a cobrança e associar sua assinatura.
                  </p>
                </div>

                {/* Campo: Nome Completo */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase flex items-center gap-1.5">
                    <UserIcon size={12} /> Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors text-gray-800 ${
                      formErrors.name ? "border-red-500" : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {formErrors.name && (
                    <span className="text-[11px] text-red-500 mt-1 block">{formErrors.name}</span>
                  )}
                </div>

                {/* Campo: E-mail */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase flex items-center gap-1.5">
                    <Mail size={12} /> E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                    }}
                    className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors text-gray-800 ${
                      formErrors.email ? "border-red-500" : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-red-500 mt-1 block">{formErrors.email}</span>
                  )}
                </div>

                {/* Campo: CPF (Obrigatório para Asaas) */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase flex items-center gap-1.5">
                    <FileText size={12} /> CPF <span className="text-xs text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      setFormData({ ...formData, cpf: formatted });
                      if (formErrors.cpf) setFormErrors({ ...formErrors, cpf: undefined });
                    }}
                    maxLength={14}
                    className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors font-mono text-gray-800 ${
                      formErrors.cpf ? "border-red-500" : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {formErrors.cpf ? (
                    <span className="text-[11px] text-red-500 mt-1 block">{formErrors.cpf}</span>
                  ) : (
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Obrigatório pelo Banco Central e Asaas para emissão da cobrança.
                    </span>
                  )}
                </div>

                {/* Campo: Telefone (Opcional) */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase flex items-center gap-1.5">
                    <Phone size={12} /> Telefone / WhatsApp <span className="text-gray-400 text-[9px]">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setFormData({ ...formData, phone: formatted });
                    }}
                    maxLength={15}
                    className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors font-mono text-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 mt-8 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  Avançar para o Pagamento <ArrowRight size={14} />
                </button>
              </form>
            )}

            {/* -------------------------------------------------------------
                ETAPA 2: FORMAS DE PAGAMENTO (PIX & CARTÃO DE CRÉDITO)
               ------------------------------------------------------------- */}
            {step === 2 && (
              <div className="w-full">
                {/* Botão de voltar para a etapa 1 */}
                <div className="w-full flex items-center justify-between mb-6">
                  <button
                    onClick={() => {
                      setPollingActive(false);
                      setStep(1);
                    }}
                    className="text-xs text-gray-500 hover:text-black flex items-center gap-1 uppercase tracking-wider font-bold"
                  >
                    <ArrowLeft size={14} /> Alterar dados cadastrais
                  </button>
                  <span className="text-[10px] font-bold tracking-widest text-black uppercase bg-gray-100 px-2.5 py-1 rounded">
                    {formData.name.split(" ")[0]} ({formData.email})
                  </span>
                </div>

                {/* --- ABA 1: PIX INSTANTÂNEO --- */}
                {tab === "pix" && (
                  <div className="flex flex-col items-center max-w-[400px] mx-auto w-full">
                    {loading ? (
                      <div className="py-16 flex flex-col items-center text-center">
                        <Loader2 size={36} className="animate-spin text-black mb-4" />
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                          Gerando QR Code Pix no Asaas...
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Exibição do QR Code Imagem Dinâmico */}
                        <div className="w-64 h-64 border border-gray-200 p-4 bg-white flex flex-col items-center justify-center relative shadow-sm">
                          {paymentData?.pixQrCode?.encodedImage ? (
                            <img
                              src={`data:image/png;base64,${paymentData.pixQrCode.encodedImage}`}
                              alt="QR Code Pix Asaas"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4 text-center">
                              <QrCode size={48} className="mb-2 text-gray-300" />
                              <span className="text-xs">QR Code indisponível</span>
                            </div>
                          )}
                        </div>

                        <p className="text-[10px] font-bold tracking-[0.15em] text-gray-600 mt-6 mb-6 text-center uppercase leading-relaxed">
                          Aponte a câmera do seu aplicativo bancário para o QR Code
                        </p>

                        {/* Código Copia e Cola */}
                        <div className="w-full">
                          <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                            Código Pix Copia e Cola
                          </label>
                          <div className="flex bg-gray-100 p-1.5 pl-3 h-12 items-center rounded border border-gray-200">
                            <input
                              type="text"
                              readOnly
                              value={paymentData?.pixQrCode?.payload || "Carregando..."}
                              className="bg-transparent border-none focus:outline-none text-xs text-gray-600 w-full font-mono truncate"
                            />
                            <button
                              onClick={handleCopyPix}
                              className="bg-black text-white h-full px-4 flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase shrink-0 hover:bg-gray-800 transition-colors rounded-sm"
                            >
                              {copiedCode ? (
                                <>
                                  <Check size={12} className="text-emerald-400" /> Copiado!
                                </>
                              ) : (
                                <>
                                  <Copy size={12} /> Copiar
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="w-full h-px bg-gray-100 my-8" />

                        {/* Status em Tempo Real / Polling */}
                        <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.15em] text-black uppercase bg-gray-50 px-4 py-3 rounded-full border border-gray-200">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                          <Loader2 size={14} className="animate-spin text-gray-600" />
                          <span>Aguardando pagamento Pix...</span>
                        </div>

                        <p className="text-[10px] text-gray-400 text-center mt-3">
                          Você será redirecionado automaticamente assim que o banco confirmar o pagamento.
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* --- ABA 2: CARTÃO DE CRÉDITO --- */}
                {tab === "credit" && (
                  <div className="flex flex-col max-w-[380px] mx-auto w-full">
                    {/* Visual de Cartão de Crédito Luxo */}
                    <div className="w-full aspect-[1.586/1] bg-[#111] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-6 flex flex-col justify-between self-center mb-8 text-white relative overflow-hidden transition-all">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.03] rounded-full blur-2xl translate-x-10 -translate-y-10" />

                      <div className="flex justify-between items-start relative z-10">
                        <span className="font-serif text-xl tracking-wider text-white">
                          AE·Studio
                        </span>
                        <Wifi size={20} className="rotate-90 opacity-60 text-white" />
                      </div>

                      <div className="relative z-10 mt-4">
                        <div className="text-lg tracking-[0.25em] font-mono opacity-90 drop-shadow-sm mb-4 text-center text-white">
                          {getMaskedCardNumber()}
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="text-xs font-bold tracking-widest uppercase opacity-80 text-white truncate max-w-[200px]">
                            {getMaskedName()}
                          </div>
                          <div className="text-[10px] font-bold tracking-widest opacity-80 flex gap-4 text-white">
                            <span>{expiry || "MM/AA"}</span>
                            {cvv && <span>CVV: {cvv}</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleCreditCardPayment} className="space-y-6" autoComplete="off">
                      {/* Número do Cartão */}
                      <div>
                        <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                          Número do Cartão
                        </label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                            let formatted = "";
                            for (let i = 0; i < raw.length; i++) {
                              if (i > 0 && i % 4 === 0) formatted += " ";
                              formatted += raw[i];
                            }
                            setCardNumber(formatted);
                            if (formErrors.cardNumber) setFormErrors({ ...formErrors, cardNumber: undefined });
                          }}
                          maxLength={19}
                          autoComplete="off"
                          className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors font-mono text-gray-800 ${
                            formErrors.cardNumber ? "border-red-500" : "border-gray-300 focus:border-black"
                          }`}
                        />
                        {formErrors.cardNumber && (
                          <span className="text-[11px] text-red-500 mt-1 block">{formErrors.cardNumber}</span>
                        )}
                      </div>

                      {/* Nome no Cartão */}
                      <div>
                        <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                          Nome como impresso no Cartão
                        </label>
                        <input
                          type="text"
                          placeholder="NOME COMO CONSTA NO CARTÃO"
                          value={cardName}
                          onChange={(e) => {
                            setCardName(e.target.value.toUpperCase());
                            if (formErrors.cardName) setFormErrors({ ...formErrors, cardName: undefined });
                          }}
                          autoComplete="off"
                          className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors text-gray-800 ${
                            formErrors.cardName ? "border-red-500" : "border-gray-300 focus:border-black"
                          }`}
                        />
                        {formErrors.cardName && (
                          <span className="text-[11px] text-red-500 mt-1 block">{formErrors.cardName}</span>
                        )}
                      </div>

                      {/* Validade e CVV */}
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                            Validade (MM/AA)
                          </label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            value={expiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                              if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                              setExpiry(v);
                              if (formErrors.expiry) setFormErrors({ ...formErrors, expiry: undefined });
                            }}
                            maxLength={5}
                            autoComplete="off"
                            className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors text-gray-800 ${
                              formErrors.expiry ? "border-red-500" : "border-gray-300 focus:border-black"
                            }`}
                          />
                          {formErrors.expiry && (
                            <span className="text-[11px] text-red-500 mt-1 block">{formErrors.expiry}</span>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                            CVV
                          </label>
                          <input
                            type="password"
                            placeholder="•••"
                            value={cvv}
                            onChange={(e) => {
                              setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
                              if (formErrors.cvv) setFormErrors({ ...formErrors, cvv: undefined });
                            }}
                            maxLength={4}
                            autoComplete="off"
                            className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors font-mono tracking-widest text-gray-800 ${
                              formErrors.cvv ? "border-red-500" : "border-gray-300 focus:border-black"
                            }`}
                          />
                          {formErrors.cvv && (
                            <span className="text-[11px] text-red-500 mt-1 block">{formErrors.cvv}</span>
                          )}
                        </div>
                      </div>

                      {/* Parcelamento */}
                      <div>
                        <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                          Opções de Parcelamento
                        </label>
                        <div className="relative">
                          <select
                            value={installments}
                            onChange={(e) => setInstallments(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors appearance-none pr-8 text-gray-800"
                          >
                            {getInstallmentOptions()}
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 mt-8 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Processando Pagamento...
                          </>
                        ) : (
                          <>
                            <Lock size={14} /> Finalizar Assinatura com Cartão
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 px-12 mt-auto flex justify-between items-center bg-[#fafafa]">
        <p className="text-[9px] font-bold tracking-[0.1em] text-black uppercase">
          © 2026 ARQUITETURA EDITORIAL. Todos os direitos reservados.
        </p>
        <div className="flex gap-6 text-[9px] font-bold tracking-[0.1em] text-gray-400 uppercase">
          <button className="hover:text-black transition-colors">Termos de Serviço</button>
          <button className="hover:text-black transition-colors">Política de Privacidade</button>
          <button className="hover:text-black transition-colors">Segurança</button>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
