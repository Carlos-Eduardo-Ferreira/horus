'use client'

import { FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa'

export default function HomeFooter() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white shadow-md py-6 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-800">Logo da Empresa</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
            <div className="flex items-center">
              <FaPhone className="mr-2 text-indigo-500" />
              <span>(00) 0000-0000</span>
            </div>
            
            <div className="flex items-center">
              <FaWhatsapp className="mr-2 text-indigo-500" />
              <span>(00) 00000-0000</span>
            </div>
            
            <div className="flex items-center">
              <FaEnvelope className="mr-2 text-indigo-500" />
              <span>contato@empresa.com.br</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© {currentYear} Nome da Empresa. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}