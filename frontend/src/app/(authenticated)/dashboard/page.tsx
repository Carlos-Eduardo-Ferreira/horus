'use client';

import Title from '@/components/Title';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      {/* Conteúdo principal */}
      <main className="flex-grow">
        {/* Seção de boas-vindas */}
        <section className="py-12 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <Title size="xl" align="center" className="mb-4">
              Dashboard
            </Title>
            <p className="text-lg text-gray-600 mb-8">
              conteúdo do dashboard
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}