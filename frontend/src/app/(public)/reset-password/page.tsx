'use client';

import { useState } from 'react';
import LabeledInput from '@/components/LabeledInput';
import Title from '@/components/Title';
import Button from '@/components/Button';
import Text from '@/components/Text';

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de senhas iguais
    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setError('');
    // TODO: implementar lógica de alteração de senha
    console.log('Senha alterada com sucesso');
  };

  return (
    <>
      <Title className="mb-1" size="md" align="center">
        Redefinição de senha
      </Title>
      
      <Text size="sm" align="center" className="mb-8">
        Escolha sua nova senha
      </Text>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6" noValidate>
        <div className="grid gap-6">
          <div>
            <LabeledInput
              mutedBackground
              id="password"
              title="Nova senha"
              type="password"
              tabIndex={1}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div>
            <LabeledInput
              mutedBackground
              id="confirmPassword"
              title="Confirmar senha"
              type="password"
              tabIndex={2}
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
            {error && (
              <div className="mt-2 text-red-500 text-xs">
                {error}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          tabIndex={3}
        >
          Alterar senha
        </Button>
      </form>
    </>
  );
}