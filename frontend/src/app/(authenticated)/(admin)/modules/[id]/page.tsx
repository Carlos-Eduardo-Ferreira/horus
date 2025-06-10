"use client";

import { modulesService, ModuleWithIndex } from "@/services/modules";
import { validateModuleForm } from "@/validators/moduleValidator";
import { usePageTitle } from "@/hooks/usePageTitle";
import EntityFormPage from "@/components/EntityFormPage";

export default function ModuleFormPage() {
  usePageTitle("Cadastro - Módulo");

  return (
    <EntityFormPage<ModuleWithIndex>
      service={modulesService}
      validateForm={validateModuleForm}
      fields={[
        { name: "name", label: "Nome", type: "text", col: 2, value: "" },
        { name: "identifier", label: "Identificador", type: "text", col: 1, value: "" }
      ]}
      returnPath="/modules"
      titleNew="Cadastro • Módulo"
      titleEdit="Edição • Módulo"
      formatters={{
        name: "uppercase",
        identifier: "identifier"
      }}
    />
  );
}
