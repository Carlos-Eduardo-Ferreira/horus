import React from "react";
import LabeledInput from "./LabeledInput";
import Button from "./Button";
import Title from "./Title";
import { FaSave } from "react-icons/fa";
import { TbArrowBackUp } from "react-icons/tb";
import { useRouter } from "next/navigation";

// Tipos suportados pelos campos
type FieldType = "text" | "number" | "password" | "email";

// Definição de cada campo do formulário
export interface DynamicFormField {
  name: string;
  label: string;
  type: FieldType;
  col: number;
  value?: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

// Props do formulário dinâmico
export interface DynamicFormProps {
  fields: DynamicFormField[];
  onChange: (name: string, value: string | number) => void;
  onSubmit: () => void;
  submitting?: boolean;
  isNew: boolean;
  recordId?: string | number;
  groups?: DynamicFormField[][];
  returnPath?: string;
  fieldErrors?: { [key: string]: string };
  hasSubmitted?: boolean;
}

// Função de fallback para agrupar campos respeitando limite de 6 colunas por linha
function groupFieldsByRows(fields: DynamicFormField[]) {
  const rows: DynamicFormField[][] = [];
  let currentRow: DynamicFormField[] = [];
  let currentSum = 0;

  for (const field of fields) {
    if (currentSum + field.col > 6) {
      rows.push(currentRow);
      currentRow = [field];
      currentSum = field.col;
    } else {
      currentRow.push(field);
      currentSum += field.col;
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);
  return rows;
}

// Agrupamento baseado em `groups`, garantindo que nenhuma linha exceda 6 colunas
function groupFieldsByGroupsWithLimit(groups: DynamicFormField[][]) {
  const rows: DynamicFormField[][] = [];
  for (const group of groups) {
    let currentRow: DynamicFormField[] = [];
    let currentSum = 0;
    for (const field of group) {
      if (currentSum + field.col > 6) {
        rows.push(currentRow);
        currentRow = [field];
        currentSum = field.col;
      } else {
        currentRow.push(field);
        currentSum += field.col;
      }
    }
    if (currentRow.length > 0) rows.push(currentRow);
  }
  return rows;
}

// Define a largura do card com base na maior quantidade de colunas em uma linha
function getCardWidthByMaxCols(maxCols: number) {
  if (maxCols === 1) return "w-1/6";
  if (maxCols === 2) return "w-1/3";
  if (maxCols === 3) return "w-1/2";
  if (maxCols === 4) return "w-2/3";
  if (maxCols === 5) return "w-5/6";
  return "w-full";
}

export default function DynamicForm({
  fields,
  onChange,
  onSubmit,
  submitting,
  isNew,
  recordId,
  groups,
  returnPath,
  fieldErrors = {},
  hasSubmitted = false,
}: DynamicFormProps) {
  const router = useRouter();
  
  // Organiza os campos em linhas de no máximo 6 colunas cada
  const rows = groups
    ? groupFieldsByGroupsWithLimit(groups)
    : groupFieldsByRows(fields);

  const maxCols = Math.max(...rows.map(row => row.reduce((sum, f) => sum + f.col, 0)), 1);
  const cardWidth = getCardWidthByMaxCols(maxCols);

  // freeze-width logic igual ao ListTable
  const REF_DESKTOP = 1920;
  const totalPercent = (maxCols / 6) * 100;
  const freezePx = (totalPercent / 100) * REF_DESKTOP;

  // Função para lidar com o cancelamento usando App Router
  const handleCancel = () => {
    if (returnPath) {
      router.push(returnPath);
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div
      className={`mx-auto freeze-width w-full sm:${cardWidth}`}
      style={
        {
          '--pct': `${totalPercent/100}`,
          '--freeze': `${freezePx}px`
        } as React.CSSProperties
      }
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <form
          className="w-full"
          onSubmit={e => { e.preventDefault(); onSubmit(); }}
          autoComplete="off"
        >
          {/* Título */}
          <div className="flex items-center justify-between mb-6 ps-2">
            <Title size="md" align="left" className="color-primary">
              {isNew
                ? "Inserindo novo registro"
                : `Editando registro de nº ${recordId ?? ""}`}
            </Title>
          </div>

          {/* Campos em linhas */}
          <div className="flex flex-col gap-y-4">
            {/* Renderização dos campos em linhas */}
            {rows.map((row, rowIdx) => {
              return (
                <div className="form-fields-row" key={rowIdx}>
                  {row.map((field) => {
                    const widthPct = (field.col / maxCols) * 100;
                    
                    return (
                      <div
                        key={field.name}
                        className="form-field-container"
                        style={{
                          width: `${widthPct}%`,
                          maxWidth: `${widthPct}%`
                        }}
                      >
                        <LabeledInput
                          title={field.label}
                          type={field.type}
                          value={field.value}
                          onChange={e => onChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          disabled={field.disabled}
                          error={field.error}
                          name={field.name}
                          className={`w-full px-3 py-2 border rounded
                            ${hasSubmitted && fieldErrors[field.name] ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"}
                            ${submitting ? "bg-gray-100" : ""}
                          `}
                        />
                        {hasSubmitted && fieldErrors[field.name] && (
                          <div className="text-red-500 text-xs mt-1">
                            {fieldErrors[field.name]}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Botões de ação do formulário */}
          <div className="form-buttons">
            <Button
              variant="light"
              type="button"
              buttonType="compact"
              onClick={handleCancel}
            >
              <TbArrowBackUp className="mr-1.5" /> Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              buttonType="compact" 
              disabled={submitting}
            >
              <FaSave className="mr-1.5" /> Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}