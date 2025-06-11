"use client";

import { useAuthContext } from '@/context/auth.context';

export function useUserRole() {
  const { user, isLoading } = useAuthContext();
  
  return { 
    userRole: user?.role, 
    isLoading 
  };
}
