'use client'

import Button from '@/components/Button'

export default function HomeHeader() {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-end">
        <div className="flex space-x-3">
          <Button 
            href="/register"
            variant="secondary"
            outline
            className="px-6"
          >
            Criar conta
          </Button>
          
          <Button 
            href="/login"
            variant="primary"
            outline
            className="px-6"
          >
            Acessar
          </Button>
        </div>
      </div>
    </header>
  )
}