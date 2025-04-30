'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { maskCpfCnpj } from '@/lib/maskCpfCnpj'
import { authService } from '@/services/auth'
import { validateRegisterForm } from '@/validators/registerValidator'
import LabeledInput from '@/components/LabeledInput'
import Title from '@/components/Title'
import TextLink from '@/components/TextLink'
import Text from '@/components/Text'
import Button from '@/components/Button'
import { IoIosArrowBack } from 'react-icons/io'

type UserType = 'consumer' | 'company' | null;

// Tipagem para possíveis erros de campo
interface FieldErrors {
  name?: string;
  email?: string;
  document?: string;
  password?: string;
  password_confirmation?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    document: '',
    password: '',
    password_confirmation: ''
  });
  
  // Estados para validação e erros
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setForm({
      name: '',
      email: '',
      document: '',
      password: '',
      password_confirmation: ''
    });
    setFieldErrors({});
    setGlobalError('');
    setHasSubmitted(false);
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCpfCnpj(e.target.value, userType === 'consumer' ? 'cpf' : 'cnpj');
    
    const updated = { ...form, document: maskedValue };
    setForm(updated);
    
    // Se já tentou enviar, revalida o campo conforme digita
    if (hasSubmitted && userType) {
      setFieldErrors(validateRegisterForm(updated, userType));
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    
    // Se já tentou enviar, revalida o campo conforme digita
    if (hasSubmitted && userType) {
      setFieldErrors(validateRegisterForm(updated, userType));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType) return;
    
    setHasSubmitted(true);
    
    // Valida os campos
    const errors = validateRegisterForm(form, userType);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      
      // Foca no primeiro campo que estiver inválido
      for (const field of ['name', 'document', 'email', 'password', 'password_confirmation']) {
        if (errors[field as keyof FieldErrors]) {
          document.getElementById(field)?.focus();
          break;
        }
      }
      
      return; // Interrompe o envio se houver erros
    }
    
    // Limpa erros e inicia carregamento
    setFieldErrors({});
    setGlobalError('');
    setLoading(true);
    
    try {
      // Tenta registrar o usuário
      const registerData = {
        ...form,
        type: userType
      };
      
      const { token, user } = await authService.register(registerData);
      
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
          
          // Foca no primeiro campo com erro
          for (const field of Object.keys(newErrors)) {
            document.getElementById(field)?.focus();
            break;
          }
        } else {
          // Outros erros de servidor
          setGlobalError(payload.message || 'Erro ao criar conta');
        }
      } else {
        // Erros de conexão
        setGlobalError('Erro de conexão');
      }
    }
  };

  if (userType === null) {
    return (
      <>
        <Title className="mb-1" size="md" align="center">
          Crie sua conta
        </Title>
        
        <div className="flex flex-col space-y-6">
          <Text size="sm" align="center" className="mb-6">
            Selecione o tipo de conta que deseja criar
          </Text>
          
          <div className="flex flex-row gap-4 w-full">
            <Button 
              variant="primary" 
              outline 
              className="flex-1"
              onClick={() => handleUserTypeSelect('consumer')}
            >
              Consumidor
            </Button>
            
            <Button 
              variant="primary" 
              outline 
              className="flex-1"
              onClick={() => handleUserTypeSelect('company')}
            >
              Empresa
            </Button>
          </div>
          
          <Text size="xs" align="center">
            Já tem uma conta?{' '}
            <TextLink href="/auth/login" size="sm">
              Entrar
            </TextLink>
          </Text>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <TextLink 
          size="sm" 
          variant="secondary"
          className="flex items-center"
          onClick={() => setUserType(null)}
        >
          <IoIosArrowBack className="mr-2 text-indigo-500" /> Voltar
        </TextLink>
      </div>
      
      <Title className="mb-1" size="md" align="center">
        {userType === 'consumer' ? 'Cadastro de Consumidor' : 'Cadastro de Empresa'}
      </Title>
      
      <Text size="sm" align="center" className="mb-8">
        Preencha os dados para criar sua conta
      </Text>
      
      {/* Exibe erro global caso exista */}
      {globalError && (
        <Text size="sm" className="text-red-500 mb-4 text-center">
          {globalError}
        </Text>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div className="grid gap-6">
          {userType === 'consumer' ? (
            <>
              <div>
                <LabeledInput
                  mutedBackground
                  id="name"
                  title="Nome"
                  type="text"
                  tabIndex={1}
                  value={form.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  error={hasSubmitted ? fieldErrors.name : undefined}
                />
              </div>

              <div>
                <LabeledInput
                  mutedBackground
                  id="document"
                  title="CPF"
                  type="text"
                  tabIndex={2}
                  value={form.document}
                  onChange={handleDocumentChange}
                  maxLength={14}
                  error={hasSubmitted ? fieldErrors.document : undefined}
                />
              </div>

              <div>
                <LabeledInput
                  mutedBackground
                  id="email"
                  title="Endereço de e-mail"
                  type="email"
                  tabIndex={3}
                  value={form.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  error={hasSubmitted ? fieldErrors.email : undefined}
                />
              </div>
            </>
          ) : (
            <div>
              <LabeledInput
                mutedBackground
                id="document"
                title="CNPJ"
                type="text"
                tabIndex={1}
                value={form.document}
                onChange={handleDocumentChange}
                maxLength={18}
                error={hasSubmitted ? fieldErrors.document : undefined}
              />
            </div>
          )}

          <div>
            <LabeledInput
              mutedBackground
              id="password"
              title="Senha"
              type="password"
              tabIndex={userType === 'consumer' ? 4 : 2}
              value={form.password}
              onChange={e => handleInputChange('password', e.target.value)}
              error={hasSubmitted ? fieldErrors.password : undefined}
            />
          </div>

          <div>
            <LabeledInput
              mutedBackground
              id="password_confirmation"
              title="Confirmar senha"
              type="password"
              tabIndex={userType === 'consumer' ? 5 : 3}
              value={form.password_confirmation}
              onChange={e => handleInputChange('password_confirmation', e.target.value)}
              error={hasSubmitted ? fieldErrors.password_confirmation : undefined}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Criando conta...
            </span>
          ) : (
            'Criar conta'
          )}
        </Button>

        <Text size="xs" align="center">
          Já tem uma conta?{' '}
          <TextLink href="/auth/login" size="sm">
            Entrar
          </TextLink>
        </Text> 
      </form>
    </>
  );
}