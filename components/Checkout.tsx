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
} from "lucide-react";
import { getPlanById, BillingCycle } from "../plans";

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

const Checkout = () => {
  const navigate = useNavigate();

  // Ler a escolha do plano e ciclo APENAS do sessionStorage gravado no clique do botão da landing page
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

  useEffect(() => {
    // Se não houver plano válido obtido por clique explícito, bloqueia o acesso e volta para a home
    if (!plan) {
      navigate("/", { replace: true });
    }

    // Ao desmontar/sair da tela de checkout, limpa imediatamente os dados do sessionStorage
    return () => {
      sessionStorage.removeItem("selected_plan_id");
      sessionStorage.removeItem("selected_billing_cycle");
    };
  }, [plan, navigate]);

  if (!plan) {
    return null;
  }

  const [tab, setTab] = useState<"credit" | "pix">("credit");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Mascarar Número do Cartão
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

  // Mascarar Nome
  const getMaskedName = () => {
    if (!cardName) return "J. D.";
    const parts = cardName.trim().split(/\s+/);
    if (parts.length === 1 && parts[0] === "") return "";
    return parts.map((p) => p.charAt(0).toUpperCase() + ".").join(" ");
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  const handleCopyPix = () => {
    setStatus("success");
  };

  // Gerar opções de parcelas de acordo com o valor do plano e ciclo
  const getInstallmentOptions = () => {
    const numericPrice = parseFloat(
      displayPrice.replace(".", "").replace(",", "."),
    );
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return [<option key={1}>1x de R$ {displayPrice},00</option>];
    }

    const options = [];
    const maxInstallments =
      numericPrice >= 1000 ? 12 : numericPrice >= 200 ? 6 : 3;

    for (let i = 1; i <= maxInstallments; i++) {
      const installmentValue = (numericPrice / i).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      options.push(
        <option key={i}>
          {i}x de R$ {installmentValue} {i === 1 ? "(à vista)" : "sem juros"}
        </option>,
      );
    }
    return options;
  };

  if (status === "success") {
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
              Contato
            </button>
            <button
              className="hover:text-black transition-colors uppercase"
              onClick={() => navigate("/elite/auth/login")}
            >
              Entrar
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-8 z-10">
          <div className="bg-white border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-16 max-w-xl w-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center mb-8">
              <CheckCircle2 size={24} className="text-black" />
            </div>

            <h1 className="font-serif text-4xl mb-6 text-black">
              Pagamento efetuado
              <br />
              com sucesso
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-12">
              Sua assinatura do plano <strong>{plan.name}</strong> está ativa.
              Você já pode acessar todas as ferramentas e recursos premium.
            </p>

            <div className="flex gap-4 mb-16 w-full justify-center">
              <button
                onClick={() => navigate("/elite")}
                className="bg-black text-white px-8 py-4 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors w-48"
              >
                Acessar o Painel
              </button>
              <button className="bg-white text-black border border-gray-200 px-8 py-4 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors w-48">
                Ver Recibo
              </button>
            </div>

            <div className="w-full h-px bg-gray-100 mb-6" />
            <p className="text-[9px] font-bold tracking-[0.2em] text-black uppercase">
              Pedido #AE-90812-V16
            </p>
          </div>
        </main>
      </div>
    );
  }

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
        <div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] text-gray-400">
          <button
            className="hover:text-black transition-colors uppercase"
            onClick={() => navigate("/")}
          >
            Contato
          </button>
          <button
            className="hover:text-black transition-colors uppercase"
            onClick={() => navigate("/elite/auth/login")}
          >
            Entrar
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full p-8 lg:p-16 gap-16 lg:items-start items-center">
        {/* Resumo do Plano Selecionado */}
        <div className="w-full lg:w-[380px] flex flex-col gap-8 shrink-0">
          <div>
            <h1 className="font-serif text-5xl mb-4 text-black">Checkout</h1>
            <p className="text-gray-600 text-sm">
              Conclua sua assinatura para garantir seu acesso.
            </p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm p-8 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                  Plano
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
                  Preço
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
            <ul className="space-y-4">
              {plan.items.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-600"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-black" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 text-gray-500 text-xs font-bold tracking-wider uppercase">
            <Lock size={14} className="text-gray-500" />
            <span className="tracking-[0.1em]">
              Pagamento Criptografado e Seguro
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
                <span>powered by</span>
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

        {/* Formulário de Pagamento */}
        <div className="flex-1 w-full max-w-[560px] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setTab("credit")}
              className={`flex-1 py-6 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors relative
                ${tab === "credit" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
            >
              <CreditCard size={14} />
              Cartão de Crédito
              {tab === "credit" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
            <button
              onClick={() => setTab("pix")}
              className={`flex-1 py-6 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors relative
                ${tab === "pix" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
            >
              <QrCode size={14} />
              Pix
              {tab === "pix" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          </div>

          <div className="p-8 lg:p-12 flex-1 flex flex-col">
            {tab === "credit" && (
              <div className="flex flex-col max-w-[360px] mx-auto w-full">
                {/* Visual do Cartão */}
                <div className="w-full aspect-[1.586/1] bg-[#111] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-6 flex flex-col justify-between self-center mb-10 text-white relative overflow-hidden transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.03] rounded-full blur-2xl translate-x-10 -translate-y-10" />

                  <div className="flex justify-between items-start relative z-10">
                    <span className="font-serif text-xl tracking-wider">
                      AE·Studio
                    </span>
                    <Wifi size={20} className="rotate-90 opacity-60" />
                  </div>

                  <div className="relative z-10 mt-6">
                    <div className="text-xl tracking-[0.3em] font-mono opacity-90 drop-shadow-sm mb-4 text-center">
                      {getMaskedCardNumber()}
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-xs font-bold tracking-widest uppercase opacity-80">
                        {getMaskedName()}
                      </div>
                      <div className="text-[10px] font-bold tracking-widest opacity-80 flex gap-4">
                        <span>{expiry || "12/25"}</span>
                        {cvv && (
                          <span>
                            CVV: {cvv.replace(/./g, "•").slice(0, -1)}
                            {cvv.slice(-1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handlePayment}
                  className="space-y-8"
                  autoComplete="off"
                >
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      autoComplete="off"
                      data-lpignore="true"
                      className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 font-mono text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="NOME COMO CONSTA NO CARTÃO"
                      value={cardName}
                      onChange={(e) =>
                        setCardName(e.target.value.toUpperCase())
                      }
                      autoComplete="off"
                      data-lpignore="true"
                      className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 text-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                        Data de Validade
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        maxLength={5}
                        autoComplete="off"
                        data-lpignore="true"
                        className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={4}
                        autoComplete="off"
                        data-lpignore="true"
                        className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 font-mono tracking-widest text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-2 uppercase">
                      Parcelas
                    </label>
                    <div className="relative">
                      <select className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors appearance-none pr-8 text-gray-600">
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
                    className="w-full bg-black text-white py-4 mt-8 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors shadow-md"
                  >
                    Finalizar Pagamento
                  </button>
                </form>
              </div>
            )}

            {tab === "pix" && (
              <div className="flex flex-col items-center max-w-[360px] mx-auto w-full pt-8">
                <div className="w-64 h-64 border border-gray-100 p-4 bg-white flex flex-col items-center justify-center relative group">
                  <div className="w-full h-full border border-gray-200 flex items-center justify-center p-2 relative overflow-hidden bg-gray-50">
                    <div
                      className="w-full h-full opacity-60"
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)",
                        backgroundSize: "8px 8px",
                        backgroundPosition: "0 0, 4px 4px",
                      }}
                    />
                    <div className="absolute inset-8 bg-white p-2">
                      <div className="w-full h-full bg-black"></div>
                    </div>
                    <div className="absolute inset-10 bg-white"></div>
                    <div className="absolute top-4 left-4 w-6 h-6 bg-black border-4 border-white"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 bg-black border-4 border-white"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 bg-black border-4 border-white"></div>
                  </div>
                  <div className="absolute bottom-0 translate-y-1/2 text-[7px] font-bold tracking-widest text-black uppercase bg-white px-2">
                    Pagamento Seguro
                  </div>
                </div>

                <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 mt-12 mb-8 text-center uppercase leading-loose">
                  Aponte a câmera do seu celular para o QR Code acima
                </p>

                <div className="w-full">
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-black mb-3 uppercase">
                    Copia e Cola
                  </label>
                  <div className="flex bg-gray-100 p-1 pl-4 h-12 items-center">
                    <input
                      type="text"
                      readOnly
                      value="00020101021126580014br.gov.bcb.pix0136aeb63750-f..."
                      className="bg-transparent border-none focus:outline-none text-xs text-gray-500 w-full font-mono truncate"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="bg-black text-white h-full px-6 flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase shrink-0 hover:bg-gray-800 transition-colors"
                    >
                      <Copy size={12} /> Copiar Código
                    </button>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100 my-10" />

                <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.15em] text-black uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"></span>
                  Aguardando pagamento...
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 px-12 mt-auto flex justify-between items-center bg-[#fafafa]">
        <p className="text-[9px] font-bold tracking-[0.1em] text-black uppercase">
          © 2026 AE·STUDIO. Todos os direitos reservados.
        </p>
        <div className="flex gap-6 text-[9px] font-bold tracking-[0.1em] text-gray-400 uppercase">
          <button className="hover:text-black border-b border-transparent hover:border-black transition-colors pb-0.5">
            Termos de Serviço
          </button>
          <button className="hover:text-black border-b border-transparent hover:border-black transition-colors pb-0.5">
            Política de Privacidade
          </button>
          <button className="hover:text-black border-b border-transparent hover:border-black transition-colors pb-0.5">
            Segurança
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
