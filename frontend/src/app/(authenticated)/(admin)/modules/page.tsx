"use client";

import { ListTableColumn } from "@/components/ListTable";
import { modulesService, Module } from "@/services/modules";
import { FilterField } from "@/components/FilterModal";
import EntityListPage from "@/components/EntityListPage";
import { useState } from "react";
import { ModuleActionsModal } from "./components/ModuleActionsModal";

export default function ModulesPage() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const columns: ListTableColumn<Module>[] = [
    { key: "name", label: "Nome", widthPercent: 23, align: "left", sortable: true },
    { key: "identifier", label: "Identificador", widthPercent: 20, align: "center", sortable: true },
  ];

  const filterFields: FilterField[] = [
    { name: "name", label: "Nome", type: "text", formatter: "uppercase" },
    { name: "identifier", label: "Identificador", type: "text", formatter: "identifier" },
  ];

  const handleConfigure = (module: Module) => {
    setSelectedModule(module);
    setShowPermissionsModal(true);
  };

  const handleCloseModal = () => {
    setShowPermissionsModal(false);
    setSelectedModule(null);
  };

  return (
    <>
      <EntityListPage
        title="Módulos"
        service={modulesService}
        columns={columns}
        filterFields={filterFields}
        basePath="/modules"
        onConfigure={handleConfigure}
        configureTooltip="Definir ações"
      />

      <ModuleActionsModal
        show={showPermissionsModal}
        onClose={handleCloseModal}
        module={selectedModule}
      />
    </>
  );
}
