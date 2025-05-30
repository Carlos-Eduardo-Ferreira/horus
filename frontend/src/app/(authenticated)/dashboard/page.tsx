'use client';

import Title from '@/components/Title';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function DashboardPage() {
  // Define o título da página
  usePageTitle('Dashboard');
  
  return (
    <section className="py-12">
      <div className="container mx-auto text-center max-w-3xl">
        <Title size="xl" align="center" className="mb-4">
          Dashboard
        </Title>
        <p className="text-lg text-gray-600 mb-8">
          conteúdo do dashboard
        </p>
      </div>
    </section>
  );
}