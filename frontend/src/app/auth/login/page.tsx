'use client';

import { useState } from 'react';
import { maskCpfCnpj } from '@/utils/maskCpfCnpj'; 
import LabeledInput from '@/components/LabeledInput';
import Title from '@/components/Title';
import Button from '@/components/Button';
import Text from '@/components/Text';
import TextLink from '@/components/TextLink';

export default function LoginPage() {
  const [form, setForm] = useState({
    document: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implementar lógica de login
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCpfCnpj(e.target.value);
    setForm({ ...form, document: maskedValue });
  };

  return (
    <>
      <Title className="mb-1" size="md" align="center">
        Seja bem-vindo!
      </Title>
      
      <Text size="sm" align="center" className="mb-8">
        Faça login para continuar
      </Text>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:space-y-6">
        <div className="grid gap-6">
          <div>
            <LabeledInput
              id="document"
              title="CPF/CNPJ"
              type="text"
              tabIndex={1}
              value={form.document}
              onChange={handleDocumentChange}
              maxLength={18}
            />
          </div>

          <div>
            <LabeledInput
              id="password"
              title="Senha"
              type="password"
              tabIndex={2}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <div className="mt-2 text-right">
              <TextLink href="/auth/recover-password" size="xs" tabIndex={3}>
                Esqueceu sua senha?
              </TextLink>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          tabIndex={4}
        >
          Entrar
        </Button>

        <Text size="xs" align="center">
          Não tem conta?{' '}
          <TextLink href="/auth/register" size="sm" tabIndex={5}>
            Crie sua conta
          </TextLink>
        </Text>
      </form>
    </>
  );
}