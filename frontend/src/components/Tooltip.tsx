'use client'

import React, { useState, useEffect } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/utils/classNames'

interface TooltipProps {
  children: React.ReactNode
  content: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  disableFocus?: boolean
}

// Variável global para rastrear se um modal foi recentemente fechado
let recentModalClose = false;

// Função para desabilitar temporariamente os tooltips quando um modal é fechado
export function disableTooltipsTemporarily() {
  recentModalClose = true;
  setTimeout(() => {
    recentModalClose = false;
  }, 500); // Desabilita tooltips por 500ms após um modal ser fechado
}

export function Tooltip({ 
  children, 
  content, 
  side = 'top', 
  align = 'center', 
  disableFocus = false 
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  // Fecha o tooltip quando a página é rolada ou redimensionada
  useEffect(() => {
    const handleWindowEvents = () => {
      setOpen(false);
    };
    
    window.addEventListener('scroll', handleWindowEvents);
    window.addEventListener('resize', handleWindowEvents);
    
    return () => {
      window.removeEventListener('scroll', handleWindowEvents);
      window.removeEventListener('resize', handleWindowEvents);
    };
  }, []);

  // Controla o estado de abertura do tooltip
  const handleOpenChange = (isOpen: boolean) => {
    // Não abre o tooltip se um modal foi recentemente fechado
    if (isOpen && recentModalClose) {
      return;
    }
    
    setOpen(isOpen);
  };

  // Properly typed focus handler
  const handleFocus = (e: React.FocusEvent<HTMLSpanElement>) => {
    if (disableFocus && e.currentTarget) {
      // Utilize requestAnimationFrame para garantir que o DOM está estabilizado
      requestAnimationFrame(() => {
        try {
          // Verifica se o elemento ainda está no DOM antes de aplicar blur
          if (document.body.contains(e.currentTarget)) {
            (e.currentTarget as HTMLElement).blur();
          }
        } catch (error) {
          console.error("Error blurring element:", error);
        }
      });
    }
  };

  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <TooltipPrimitive.Trigger asChild>
          {disableFocus ? (
            <span className="inline-block" onFocus={handleFocus}>
              {children}
            </span>
          ) : (
            children
          )}
        </TooltipPrimitive.Trigger>
        
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={5}
            className={cn(
              'z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white'
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-gray-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
