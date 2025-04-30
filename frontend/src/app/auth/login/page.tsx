'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { maskCpfCnpj } from '@/lib/maskCpfCnpj';
import { authService } from '@/services/auth';
import { validateLoginForm } from '@/validators/loginValidator';
import LabeledInput from '@/components/LabeledInput';
import Title from '@/components/Title';
import Button from '@/components/Button';
import Text from '@/components/Text';
import TextLink from '@/components/TextLink';

// Tipagem para possíveis erros de campo
interface FieldErrors { document?: string; password?: string }

export default function LoginPage() {
  const router = useRouter();

  // Estado para armazenar dados do formulário
  const [form, setForm] = useState({ document: '', password: '' });

  // Estado para armazenar erros de validação de campos
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Estado para armazenar erro global (não relacionado a campos específicos)
  const [globalError, setGlobalError] = useState('');

  // Estado para controlar carregamento (loading) do botão
  const [loading, setLoading] = useState(false);

  // Estado para identificar se o usuário já tentou enviar o formulário
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Função para atualizar os campos do formulário
  const onChangeField = (field: 'document' | 'password', value: string) => {
    const updated = {
      ...form,
      [field]: field === 'document' ? maskCpfCnpj(value) : value // Aplica máscara se for documento
    };
    setForm(updated);
    setGlobalError('');

    // Se já tentou enviar, revalida os campos conforme digita
    if (hasSubmitted) {
      setFieldErrors(validateLoginForm(updated.document, updated.password));
    }
  };

  // Função para envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    // Valida os campos
    const errors = validateLoginForm(form.document, form.password);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);

      // Foca no primeiro campo que estiver inválido
      if (errors.document) {
        document.getElementById('document')?.focus();
      } else if (errors.password) {
        document.getElementById('password')?.focus();
      }
      return; // Interrompe o envio se houver erros
    }

    // Limpa erros e inicia carregamento
    setFieldErrors({});
    setGlobalError('');
    setLoading(true);

    try {
      // Tenta autenticar usuário
      const { token, user } = await authService.login({
        document: form.document,
        password: form.password,
      });

      // Armazena token e informações do usuário no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redireciona para dashboard
      router.push('/dashboard');
    } catch (error: unknown) {
      setLoading(false);

      // Trata diferentes tipos de erro de resposta
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        const payload = data as {
          message?: string;
          errors?: Record<string, string[]>;
        };

        if (status === 422 && payload.errors) {
          // Erros de validação no servidor
          const newErrors: FieldErrors = {};
          for (const [field, messages] of Object.entries(payload.errors)) {
            newErrors[field as keyof FieldErrors] = messages[0];
          }
          setFieldErrors(newErrors);

          // Foca no campo com erro
          if (newErrors.document) {
            document.getElementById('document')?.focus();
          } else if (newErrors.password) {
            document.getElementById('password')?.focus();
          }
        } else if (status === 401) {
          // Erro de credenciais inválidas
          const msg = payload.message ?? 'Documento ou senha inválidos';
          setFieldErrors({ document: msg, password: msg });
          document.getElementById('document')?.focus();
        } else {
          // Outros erros de servidor
          setGlobalError('Erro ao fazer login');
        }
      } else {
        // Erros de conexão
        setGlobalError('Erro de conexão');
      }
    }
  };

  return (
    <>
      {/* Título da página */}
      <Title size="md" align="center" className="mb-1">
        Seja bem-vindo!
      </Title>

      {/* Subtítulo da página */}
      <Text size="sm" align="center" className="mb-8">
        Faça login para continuar
      </Text>

      {/* Exibe erro global caso exista */}
      {globalError && (
        <Text size="sm" className="text-red-500 mb-4 text-center">
          {globalError}
        </Text>
      )}

      {/* Formulário de login */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-6">
          {/* Campo de CPF/CNPJ */}
          <LabeledInput
            mutedBackground
            id="document"
            title="CPF/CNPJ"
            type="text"
            tabIndex={1}
            value={form.document}
            onChange={e => onChangeField('document', e.target.value)}
            maxLength={18}
            error={hasSubmitted ? fieldErrors.document : undefined}
          />

          {/* Campo de Senha */}
          <LabeledInput
            mutedBackground
            id="password"
            title="Senha"
            type="password"
            tabIndex={2}
            value={form.password}
            onChange={e => onChangeField('password', e.target.value)}
            error={hasSubmitted ? fieldErrors.password : undefined}
          />
        </div>

        {/* Link para recuperação de senha */}
        <div className="text-right mt-1 mb-6">
          <TextLink href="/auth/recover-password" size="xs" tabIndex={3}>
            Esqueceu sua senha?
          </TextLink>
        </div>

        {/* Botão de envio */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          tabIndex={4}
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Entrando...
            </span>
          ) : (
            'Entrar'
          )}
        </Button>

        {/* Link para criação de conta */}
        <Text size="xs" align="center" className="mt-3">
          Não tem conta?{' '}
          <TextLink href="/auth/register" size="sm" tabIndex={5}>
            Crie sua conta
          </TextLink>
        </Text>
      </form>
    </>
  );
}