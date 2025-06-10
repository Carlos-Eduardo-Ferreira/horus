"use client";

import { ListTableColumn } from "@/components/ListTable";
import { localUnitsService, LocalUnit } from "@/services/localUnits";
import { statesService } from "@/services/states";
import { FilterField } from "@/components/FilterModal";
import EntityListPage from "@/components/EntityListPage";
import Text from "@/components/Text";
import { formatForDisplay } from "@/utils/displayFormatters";
import { useEffect, useState } from "react";

export default function LocalUnitsPage() {
  const [stateOptions, setStateOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const loadStates = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      try {
        const states = await statesService.list(token);
        const options = states.map(state => ({
          value: String(state.id),
          label: state.name
        }));
        setStateOptions(options);
      } catch (error) {
        console.error("Erro ao carregar estados:", error);
      }
    };

    loadStates();
  }, []);

  const columns: ListTableColumn<LocalUnit>[] = [
    { 
      key: "name", 
      label: "Nome", 
      widthPercent: 40, 
      align: "left", 
      sortable: true,
      render: (value, localUnit) => (
        <div className="flex flex-col">
          <Text size="sm" className="font-medium color-text">
            {localUnit.name}
          </Text>
          <Text size="xs" className="color-subtext mt-1">
            {[
              localUnit.street,
              localUnit.number,
              localUnit.neighborhood,
              localUnit.city,
              localUnit.state?.name,
              formatForDisplay('cep', localUnit.zip_code)
            ].filter(Boolean).join(', ')}
          </Text>
        </div>
      )
    },
    { 
      key: "identifier", 
      label: "Identificador", 
      widthPercent: 10, 
      align: "center", 
      sortable: true 
    },
    { 
      key: "email", 
      label: "Contato", 
      widthPercent: 10, 
      align: "left", 
      sortable: false,
      render: (value, localUnit) => (
        <div className="flex flex-col color-text">
          <Text size="sm" noDefaultColor>
            {localUnit.email || '-'}
          </Text>
          <Text size="sm" className="color-subtext mt-1">
            {formatForDisplay('phone', localUnit.phone) || '-'}
          </Text>
        </div>
      )
    },
  ];

  const filterFields: FilterField[] = [
    { name: "name", label: "Nome", type: "text", formatter: "uppercase" },
    { name: "identifier", label: "Identificador", type: "text", formatter: "identifier" },
    { name: "city", label: "Cidade", type: "text", formatter: "uppercase" },
    { name: "state_id", label: "Estado", type: "select", options: stateOptions },
  ];

  return (
    <EntityListPage
      title="Unidades Locais"
      service={localUnitsService}
      columns={columns}
      filterFields={filterFields}
      basePath="/local-units"
    />
  );
}
