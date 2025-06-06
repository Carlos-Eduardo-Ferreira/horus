"use client";

import { localUnitsService, LocalUnitWithIndex } from "@/services/localUnits";
import { validateLocalUnitForm } from "@/validators/localUnitValidator";
import { usePageTitle } from "@/hooks/usePageTitle";
import EntityFormPage from "@/components/EntityFormPage";
import { statesService } from "@/services/states";
import { useEffect, useState } from "react";
import { cepService } from "@/services/cepService";
import { findStateOptionByViaCepUF } from "@/constants/brazilianStates";

export default function LocalUnitFormPage() {
  usePageTitle("Cadastro - Unidade Local");
  
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

  return (
    <EntityFormPage<LocalUnitWithIndex>
      service={localUnitsService}
      validateForm={validateLocalUnitForm}
      groups = {[
        [
          { name: "name", label: "Nome", type: "text", col: 2, value: "" },
          { name: "identifier", label: "Identificador", type: "text", col: 1, value: "" },
          { name: "zip_code", label: "CEP", type: "text", col: 1, value: "" }
        ],
        [
          { name: "street", label: "Rua", type: "text", col: 2, value: "" },
          { name: "number", label: "Número", type: "text", col: 1, value: "" },
          { name: "complement", label: "Complemento", type: "text", col: 1, value: "" }
        ],
        [
          { name: "neighborhood", label: "Bairro", type: "text", col: 2, value: "" },
          { name: "city", label: "Cidade", type: "text", col: 1, value: "" },
          { name: "state_id", label: "Estado", type: "select", col: 1, value: "", options: stateOptions }
        ],
        [
          { name: "email", label: "Email", type: "email", col: 2, value: "" },
          { name: "phone", label: "Telefone", type: "text", col: 1, value: "" }
        ]
      ]}
      returnPath="/local-units"
      titleNew="Cadastro • Unidade Local"
      titleEdit="Edição • Unidade Local"
      formatters={{
        name: "uppercase",
        identifier: "identifier",
        zip_code: "cep",
        street: "uppercase",
        number: "uppercase",
        complement: "uppercase",
        neighborhood: "uppercase",
        city: "uppercase",
        email: "lowercase",
        phone: "phone"
      }}
      autoFillConfig={{
        triggerField: "zip_code",
        triggerLength: 8,
        service: async (cep: string) => {
          const addressData = await cepService.fetchAddress(cep);
          if (!addressData) return null;
          
          return {
            street: addressData.logradouro,
            neighborhood: addressData.bairro,
            city: addressData.localidade,
            state_uf: addressData.uf
          };
        },
        fieldMappings: {
          street: "street",
          neighborhood: "neighborhood", 
          city: "city",
          state_id: "state_uf"
        },
        loadingText: "Buscando endereço...",
        findOptionMapping: (uf: string, options: { value: string; label: string }[]) => {
          return findStateOptionByViaCepUF(uf, options);
        }
      }}
    />
  );
}
