'use client';

import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuthContext } from '@/context/auth.context';
import Title from '@/components/Title';
import Text from '@/components/Text';
import Alert from '@/components/Alert';
import { CheckCircleIcon, ClockIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function CompanyDashboardPage() {
  usePageTitle('Dashboard da Empresa');

  const { user } = useAuthContext();

  const renderVerificationAlert = () => {
    const status = user?.verification_status;

    switch (status) {
      case 'approved':
        return (
          <Alert variant="success" icon={CheckCircleIcon}>
            <strong>Empresa Verificada</strong><br />
            Sua empresa foi verificada com sucesso e tem acesso completo ao sistema.
          </Alert>
        );
      case 'pending':
        return (
          <Alert variant="warning" icon={ClockIcon}>
            <strong>Verificação em Análise</strong><br />
            Sua empresa está cadastrada e sua documentação está sendo analisada pela nossa equipe. Você receberá uma notificação assim que o processo for concluído.
          </Alert>
        );
      case 'rejected':
        return (
          <Alert variant="danger" icon={XCircleIcon}>
            <strong>Verificação Rejeitada</strong><br />
            Sua solicitação de verificação foi rejeitada. Entre em contato com nosso suporte para mais informações sobre os próximos passos.
          </Alert>
        );
      case 'not_submitted':
        return (
          <Alert variant="primary" icon={ExclamationTriangleIcon}>
            <strong>Documentação Pendente</strong><br />
            Para ter acesso completo ao sistema, você precisa enviar sua documentação para verificação.
          </Alert>
        );
      default:
        // Fallback para casos inesperados - não deveria acontecer
        return (
          <Alert variant="warning" icon={ClockIcon}>
            <strong>Status de Verificação</strong><br />
            Verificando status da sua empresa...
          </Alert>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Title size="lg" className="mb-2">
          Dashboard da Empresa
        </Title>
        <Text size="md" align="center" className="text-gray-600 mb-6">
          Bem-vindo ao painel da sua empresa, {user?.name}
        </Text>

        {/* Status de Verificação */}
        {renderVerificationAlert()}
      </div>
    </div>
  );
}
