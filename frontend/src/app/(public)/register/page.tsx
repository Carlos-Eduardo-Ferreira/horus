'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { formatField } from '@/utils/fieldFormatters'
import { authService } from '@/services/auth'
import { cnpjService } from '@/services/cnpjService'
import { validateRegisterForm } from '@/validators/registerValidator'
import { getDefaultDashboard } from '@/config/routes'
import LabeledInput from '@/components/LabeledInput'
import Title from '@/components/Title'
import TextLink from '@/components/TextLink'
import Text from '@/components/Text'
import Button from '@/components/Button'
import { IoIosArrowBack } from 'react-icons/io'
import { usePageTitle } from '@/hooks/usePageTitle'
import { UserRole } from '@/types/auth'
import { useAuthContext } from '@/context/auth.context'

type UserType = 'consumer' | 'company' | null;

// Tipagem para possíveis erros de campo
interface FieldErrors {
  name?: string;
  legal_name?: string;
  email?: string;
  document?: string;
  password?: string;
  password_confirmation?: string;
}

export default function RegisterPage() {
  // Define o título da página
  usePageTitle('Cadastro');
  
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>(null);
  const [form, setForm] = useState({
    name: '',
    legal_name: '',
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
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cnpjError, setCnpjError] = useState<string | null>(null);
  const cnpjLoadingRef = useRef(setCnpjLoading);
  cnpjLoadingRef.current = setCnpjLoading;

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setForm({
      name: '',
      legal_name: '',
      email: '',
      document: '',
      password: '',
      password_confirmation: ''
    });
    setFieldErrors({});
    setGlobalError('');
    setHasSubmitted(false);
    setCnpjLoading(false);
    setCnpjError(null);
  };

  const handleCnpjAutoFill = async (cnpj: string) => {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) {
      return;
    }

    setCnpjError(null);
    cnpjLoadingRef.current(true);

    try {
      const data = await cnpjService.fetchCompany(cleanCnpj);
      
      if (data && (data.nome || data.fantasia)) {
        setForm(prev => ({
          ...prev,
          name: data.fantasia || data.nome || '',
          legal_name: data.nome || ''
        }));
      }
    } catch (error) {
      if (error instanceof Error) {
        setCnpjError(error.message);
      } else {
        setCnpjError('Erro ao consultar CNPJ. Verifique se a informação está correta.');
      }
    } finally {
      cnpjLoadingRef.current(false);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Aplica o formatador de acordo com o tipo de usuário
    const formatterType = userType === 'consumer' ? 'cpf' : 'cnpj';
    const formattedValue = formatField(formatterType, e.target.value);
    
    const updated = { ...form, document: formattedValue };
    setForm(updated);

    if (userType === 'company' && cnpjError) {
      setCnpjError(null);
    }

    if (userType === 'company') {
      const cleanValue = formattedValue.replace(/\D/g, '');
      if (cleanValue.length === 14) {
        handleCnpjAutoFill(cleanValue);
      }
    }
    
    // Se já tentou enviar, revalida o campo conforme digita
    if (hasSubmitted && userType) {
      setFieldErrors(validateRegisterForm(updated, userType));
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'email') {
      formattedValue = value.toLowerCase();
    } else if (field === 'name') {
      formattedValue = formatField('uppercase', value);
    }
    
    const updated = { ...form, [field]: formattedValue };
    setForm(updated);
    
    // Se já tentou enviar, revalida o campo conforme digita
    if (hasSubmitted && userType) {
      setFieldErrors(validateRegisterForm(updated, userType));
    }
  };

  const { loadUser } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType) return;

    if (cnpjLoading) {
      return;
    }
    
    setHasSubmitted(true);
    
    // Valida os campos
    const errors = validateRegisterForm(form, userType);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      
      // Foca no primeiro campo que estiver inválido
      for (const field of ['name', 'legal_name', 'document', 'email', 'password', 'password_confirmation']) {
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
      
      // Recarrega o usuário no contexto de autenticação
      await loadUser();
      
      // Redireciona baseado na role do usuário
      const defaultDashboard = getDefaultDashboard(user.role as UserRole);
      router.replace(defaultDashboard);
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
            <TextLink href="/login" size="sm">
              Entrar
            </TextLink>
          </Text>
        </div>
      </>
    );
  }

  // Verifica se deve bloquear o botão de envio
  const isSubmitDisabled = loading || cnpjLoading;

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

      <form noValidate onSubmit={handleSubmit} className="flex flex-col space-y-6">
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
            </>
          ) : (
            <>
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
                {cnpjLoading && (
                  <div className="flex items-center text-xs mt-1 ml-1 text-blue-600">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-1"></div>
                    Buscando empresa...
                  </div>
                )}
                {cnpjError && (
                  <div className="text-xs mt-1 ml-1 text-orange-600">
                    {cnpjError}
                  </div>
                )}
              </div>

              <div>
                <LabeledInput
                  mutedBackground
                  id="name"
                  title="Nome Fantasia"
                  type="text"
                  tabIndex={2}
                  value={form.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  error={hasSubmitted ? fieldErrors.name : undefined}
                  disabled={true}
                />
              </div>

              <div>
                <LabeledInput
                  mutedBackground
                  id="legal_name"
                  title="Razão Social"
                  type="text"
                  tabIndex={3}
                  value={form.legal_name}
                  onChange={e => handleInputChange('legal_name', e.target.value)}
                  error={hasSubmitted ? fieldErrors.legal_name : undefined}
                  disabled={true}
                />
              </div>
            </>
          )}

          <div>
            <LabeledInput
              mutedBackground
              id="email"
              title="Endereço de e-mail"
              type="email"
              tabIndex={userType === 'consumer' ? 3 : 4}
              value={form.email}
              onChange={e => handleInputChange('email', e.target.value)}
              error={hasSubmitted ? fieldErrors.email : undefined}
            />
          </div>

          <div>
            <LabeledInput
              mutedBackground
              id="password"
              title="Senha"
              type="password"
              tabIndex={userType === 'consumer' ? 4 : 5}
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
              tabIndex={userType === 'consumer' ? 5 : 6}
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
          disabled={isSubmitDisabled}
        >
          {isSubmitDisabled ? (
            <span className="inline-flex items-center">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              {cnpjLoading ? 'Aguarde...' : 'Criando conta...'}
            </span>
          ) : (
            'Criar conta'
          )}
        </Button>

        <Text size="xs" align="center">
          Já tem uma conta?{' '}
          <TextLink href="/login" size="sm">
            Entrar
          </TextLink>
        </Text> 
      </form>
    </>
  );
}