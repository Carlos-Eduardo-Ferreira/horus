'use client'
import { useState } from 'react'
import { IoArrowBack } from "react-icons/io5"
import { maskCpfCnpj } from '@/utils/maskCpfCnpj'
import LabeledInput from '@/components/LabeledInput'
import Title from '@/components/Title'
import TextLink from '@/components/TextLink'
import Text from '@/components/Text'
import Button from '@/components/Button'

type UserType = 'consumer' | 'company' | null;

export default function RegisterPage() {
  const [userType, setUserType] = useState<UserType>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    document: '',
    password: '',
    password_confirmation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: implementar lógica de envio do formulário
  }

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setForm({
      name: '',
      email: '',
      document: '',
      password: '',
      password_confirmation: ''
    });
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCpfCnpj(e.target.value, userType === 'consumer' ? 'cpf' : 'cnpj');
    setForm({ ...form, document: maskedValue });
  };

  if (userType === null) {
    return (
      <>
        <Title className="mb-6" size="md" align="center">
          Crie sua conta
        </Title>
        
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <Text size="sm" align="center" className="mb-4">
            Selecione o tipo de conta que deseja criar:
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
      <Title className="mb-6" size="md" align="center">
        {userType === 'consumer' ? 'Cadastro de Consumidor' : 'Cadastro de Empresa'}
      </Title>
      
      <Button 
        variant="secondary"
        outline
        className="mb-6" 
        onClick={() => setUserType(null)}
      >
        <IoArrowBack className="mr-2" /> Voltar
      </Button>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:space-y-6">
        <div className="grid gap-6">
          {userType === 'consumer' ? (
            <>
              <div>
                <LabeledInput
                  id="name"
                  title="Nome"
                  type="text"
                  tabIndex={1}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <LabeledInput
                  id="document"
                  title="CPF"
                  type="text"
                  tabIndex={2}
                  value={form.document}
                  onChange={handleDocumentChange}
                  maxLength={14}
                />
              </div>

              <div>
                <LabeledInput
                  id="email"
                  title="Endereço de e-mail"
                  type="email"
                  tabIndex={3}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </>
          ) : (
            <div>
              <LabeledInput
                id="document"
                title="CNPJ"
                type="text"
                tabIndex={1}
                value={form.document}
                onChange={handleDocumentChange}
                maxLength={18}
              />
            </div>
          )}

          <div>
            <LabeledInput
              id="password"
              title="Senha"
              type="password"
              tabIndex={userType === 'consumer' ? 4 : 2}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <LabeledInput
              id="password_confirmation"
              title="Confirmar senha"
              type="password"
              tabIndex={userType === 'consumer' ? 5 : 3}
              value={form.password_confirmation}
              onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full">
          Criar conta
        </Button>

        <Text size="xs" align="center">
          Já tem uma conta?{' '}
          <TextLink href="/auth/login" size="sm">
            Entrar
          </TextLink>
        </Text> 
      </form>
    </>
  )
}
