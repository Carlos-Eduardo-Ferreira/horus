'use client';

import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';
import Button from '@/components/Button';
import Title from '@/components/Title';
import { FaCommentAlt } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <HomeHeader />
      
      {/* Conteúdo principal */}
      <main className="flex-grow">
        {/* Seção de boas-vindas */}
        <section className="py-12 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <Title size="xl" align="center" className="mb-4">
              Home
            </Title>
            <p className="text-lg text-gray-600 mb-8">
              Conteúdo da home
            </p>
            
            <Button 
              href="/login"
              variant="primary"
              className="inline-flex items-center px-6 py-3"
            >
              <FaCommentAlt className="mr-2" /> Fazer reclamação
            </Button>
          </div>
        </section>
        
        {/* Seção Sobre nós */}
        <section className="py-12 px-4 bg-common">
          <div className="container mx-auto max-w-4xl">
            <Title size="lg" align="center" className="mb-6">
              Sobre nós
            </Title>
            
            <div className="text-gray-700">
              <p>
                Conteúdo da seção sobre nós
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <HomeFooter />
    </div>
  );
}