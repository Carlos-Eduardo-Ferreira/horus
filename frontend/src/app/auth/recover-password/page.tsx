'use client';

import { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import LabeledInput from '@/components/LabeledInput';
import Title from '@/components/Title';
import Button from '@/components/Button';
import Text from '@/components/Text';
import TextLink from '@/components/TextLink';

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implementar lógica de recuperação de senha
  };

  return (
    <>
      <div className="mb-6">
        <TextLink 
          href="/auth/login" 
          size="sm" 
          variant="secondary"
          className="flex items-center"
        >
          <IoIosArrowBack className="mr-2 text-indigo-500" /> Voltar
        </TextLink>
      </div>

      <Title className="mb-1" size="md" align="center">
        Recuperar senha
      </Title>
      
      <Text size="sm" align="center" className="mb-8">
        Insira seu e-mail para alteração de senha
      </Text>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div className="grid gap-6">
          <div>
            <LabeledInput
              mutedBackground
              id="email"
              title="E-mail"
              type="email"
              tabIndex={1}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          tabIndex={2}
        >
          Enviar
        </Button>
      </form>
    </>
  );
}