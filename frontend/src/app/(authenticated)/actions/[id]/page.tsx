"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DynamicForm, { DynamicFormField } from "@/components/DynamicForm";

// Simulação de fetch de dados
const mockFetchAction = async (id: string) => {
  // Aqui você pode substituir por sua chamada real de API
  if (id === "1") {
    return { name: "ACESSAR", identifier: "access" };
  }
  if (id === "2") {
    return { name: "CADASTRAR", identifier: "register" };
  }
  // ...adicione outros mocks conforme necessário
  return { name: "", identifier: "" };
};

export default function ActionFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";

  // Definição dos grupos de campos organizados em linhas.
  // Cada linha é um array de campos, e cada campo define sua largura (col) na grade de 6 colunas.
  const [groups, setGroups] = useState<DynamicFormField[][]>([
    [
      { name: "name", label: "Nome", type: "text", col: 2, value: "" },
      { name: "identifier", label: "Identificador", type: "text", col: 1, value: "" }
    ]
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      mockFetchAction(String(id)).then(data => {
        setGroups([
          [
            { name: "name", label: "Nome", type: "text", col: 2, value: data.name },
            { name: "identifier", label: "Identificador", type: "text", col: 1, value: data.identifier }
          ]
        ]);
        setLoading(false);
      });
    }
  }, [id, isNew]);

  // Atualiza o valor de um campo específico, mantendo os grupos organizados.
  const handleChange = (name: string, value: string | number) => {
    setGroups(groups =>
      groups.map(row =>
        row.map(f => f.name === name ? { ...f, value } : f)
      )
    );
  };

  // Simulação de envio do formulário (delay) e redirecionamento após salvar.
  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    router.push("/actions");
  };

  // Achata os grupos em um único array linear para compatibilidade com outros componentes.
  const allFields = groups.flat();

  if (loading) return <div className="text-center mt-10">Carregando...</div>;

  return (
    <DynamicForm
      fields={allFields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitting={submitting}
      isNew={isNew}
      recordId={id}
      groups={groups}
    />
  );
}
