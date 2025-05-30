"use client";

import { ListTableColumn } from "@/components/ListTable";
import { modulesService, Module } from "@/services/modules";
import { FilterField } from "@/components/FilterModal";
import EntityListPage from "@/components/EntityListPage";

export default function ModulesPage() {
  const columns: ListTableColumn<Module>[] = [
    { key: "name", label: "Nome", widthPercent: 23, align: "left", sortable: true },
    { key: "identifier", label: "Identificador", widthPercent: 20, align: "center", sortable: true },
  ];

  const filterFields: FilterField[] = [
    { name: "name", label: "Nome", type: "text", formatter: "uppercase" },
    { name: "identifier", label: "Identificador", type: "text", formatter: "identifier" },
  ];

  return (
    <EntityListPage
      title="Módulos"
      service={modulesService}
      columns={columns}
      filterFields={filterFields}
      basePath="/modules"
    />
  );
}
