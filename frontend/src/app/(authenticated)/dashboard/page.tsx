'use client';

import Title from '@/components/Title';

export default function DashboardPage() {
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