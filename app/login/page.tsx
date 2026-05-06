import { LoginForm } from "./LoginForm";
import { Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="flex items-center justify-center w-8 h-8 bg-[#111111] border border-[#1F1F1F] rounded-[6px]">
            <Zap size={16} className="text-[#A1A1AA]" />
          </div>
          <span className="font-mono text-base font-semibold tracking-widest text-[#FAFAFA]">
            612
          </span>
        </div>

        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-[#FAFAFA]">Entrar</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Gestão residencial de energia
          </p>
        </div>

        {/* Formulário */}
        <LoginForm />
      </div>
    </div>
  );
}
