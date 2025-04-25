'use client';

import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';
import Button from '@/components/Button';
import Title from '@/components/Title';
import { FaCommentAlt } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <HomeHeader />
      
      {/* Conteúdo principal */}
      <main className="flex-grow">
        {/* Seção de boas-vindas */}
        <section className="py-12 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <Title size="xl" align="center" className="mb-4">
              Bem-vindo à nossa plataforma
            </Title>
            <p className="text-lg text-gray-600 mb-8">
              Estamos construindo algo incrível para você.
            </p>
            
            <Button 
              href="/auth/login"
              variant="primary"
              className="inline-flex items-center px-6 py-3"
            >
              <FaCommentAlt className="mr-2" /> Fazer reclamação
            </Button>
          </div>
        </section>
        
        {/* Seção Sobre nós */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <Title size="lg" align="center" className="mb-6">
              Sobre nós
            </Title>
            
            <div className="text-gray-700 space-y-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
              </p>
              <p>
                Suspendisse in orci enim. Donec sed ligula in lacus ultricies sagittis. Suspendisse potenti. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam dapibus ipsum vitae sem convallis sollicitudin. Cras mattis consectetur consectetur.
              </p>
              <p>
                Maecenas faucibus mollis interdum. Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <HomeFooter />
    </div>
  );
}