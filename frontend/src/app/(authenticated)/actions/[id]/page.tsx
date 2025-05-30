"use client";

import { actionsService } from "@/services/actions";
import { validateActionForm } from "@/validators/actionValidator";
import { usePageTitle } from "@/hooks/usePageTitle";
import EntityFormPage from "@/components/EntityFormPage";

export default function ActionFormPage() {
  usePageTitle("Ação de Usuário");

  return (
    <EntityFormPage
      service={actionsService}
      validateForm={validateActionForm}
      fields={[
        { name: "name", label: "Nome", type: "text", col: 2, value: "" },
        { name: "identifier", label: "Identificador", type: "text", col: 1, value: "" }
      ]}
      returnPath="/actions"
      titleNew="Nova Ação de Usuário"
      titleEdit="Editar Ação de Usuário"
      formatters={{
        name: "uppercase",
        identifier: "identifier"
      }}
    />
  );
}
