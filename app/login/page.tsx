import { LoginForm } from "./LoginForm";
import { Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Card container */}
        <div className="bg-[#111111] border border-[#1F1F1F] rounded-[12px] p-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="flex items-center justify-center w-8 h-8 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-[8px]">
              <Zap size={16} className="text-[#3B82F6]" />
            </div>
            <span className="font-mono text-base font-semibold tracking-widest text-[#FAFAFA]">
              612
            </span>
          </div>

          {/* Cabeçalho */}
          <div className="mb-7">
            <h1 className="text-lg font-semibold text-[#FAFAFA]">Entrar</h1>
            <p className="text-sm text-[#A1A1AA] mt-1">
              Gestão residencial de energia
            </p>
          </div>

          {/* Formulário */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
