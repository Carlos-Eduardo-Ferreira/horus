import React from "react";
import LabeledInput from "./LabeledInput";
import LabeledSelect from "./LabeledSelect";
import Button from "./Button";
import Title from "./Title";
import { FaSave } from "react-icons/fa";
import { TbArrowBackUp } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/classNames";

type FieldType = "text" | "number" | "password" | "email" | "select";

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
  options?: { value: string; label: string }[];
}

export interface SpecialFieldConfig {
  loading?: boolean;
  error?: string | null;
  loadingText?: string;
  errorColor?: string;
  loadingColor?: string;
}

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
  specialFields?: { [fieldName: string]: SpecialFieldConfig };
  customTitle?: string;
}

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

function groupFieldsByGroupsWithLimit(groups: DynamicFormField[][]) {
  const rows: DynamicFormField[][] = [];

  for (const group of groups) {
    let currentRow: DynamicFormField[] = [];
    let currentSum = 0;

    for (const field of group) {
      if (currentSum + field.col > 6) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [field];
        currentSum = field.col;
      } else {
        currentRow.push(field);
        currentSum += field.col;
      }
    }

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
  }
  return rows;
}

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
  specialFields = {},
  customTitle,
}: DynamicFormProps) {
  const router = useRouter();

  const rows = groups
    ? groupFieldsByGroupsWithLimit(groups)
    : groupFieldsByRows(fields);

  const maxCols = Math.max(...rows.map(row => row.reduce((sum, f) => sum + f.col, 0)), 1);
  const cardWidth = getCardWidthByMaxCols(maxCols);
  const totalPercent = (maxCols / 6) * 100;
  const freezePercent = totalPercent;

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
          '--pct': `${totalPercent / 100}`,
          '--freeze': `${freezePercent}%`
        } as React.CSSProperties
      }
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <form
          className="w-full"
          onSubmit={e => { e.preventDefault(); onSubmit(); }}
          autoComplete="off"
        >
          <div className="flex items-center justify-between mb-6 ps-2">
            <Title size="md" align="left" className="color-primary">
              {customTitle || (isNew
                ? "Inserindo novo registro"
                : `Editando registro de nº ${recordId ?? ""}`)}
            </Title>
          </div>

          <div className="flex flex-col gap-y-6">
            {rows.map((row, rowIdx) => {
              return (
                <div className="form-fields-row" key={rowIdx}>
                  {row.map((field) => {
                    const widthPct = (field.col / maxCols) * 100;
                    const specialConfig = specialFields[field.name];

                    return (
                      <div
                        key={field.name}
                        className="form-field-container"
                        style={{
                          width: `${widthPct}%`,
                          maxWidth: `${widthPct}%`
                        }}
                      >
                        {field.type === "select" ? (
                          <LabeledSelect
                            title={field.label}
                            options={field.options || []}
                            value={String(field.value || "")}
                            onChange={(value) => onChange(field.name, value)}
                            placeholder={field.placeholder}
                            disabled={field.disabled || submitting}
                            error={hasSubmitted && fieldErrors[field.name] ? fieldErrors[field.name] : undefined}
                          />
                        ) : (
                          <>
                            <LabeledInput
                              title={field.label}
                              type={field.type}
                              value={field.value}
                              onChange={e => onChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              required={field.required}
                              disabled={field.disabled || submitting || (specialConfig?.loading)}
                              error={field.error}
                              name={field.name}
                              className={cn(
                                'w-full px-3 py-2 border rounded',
                                hasSubmitted && fieldErrors[field.name]
                                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                  : "border-gray-300 focus:border-gray-600 focus:ring-1 focus:ring-gray-600",
                                submitting && "bg-gray-100",
                                specialConfig?.loading && "bg-blue-50",
                                specialConfig?.error && "border-orange-500"
                              )}
                            />
                            {specialConfig?.loading && (
                              <div className={`flex items-center text-xs mt-1 ml-1 ${specialConfig.loadingColor || 'text-blue-600'}`}>
                                <div className={`animate-spin rounded-full h-3 w-3 border-b mr-1 ${specialConfig.loadingColor || 'border-blue-600'}`}></div>
                                {specialConfig.loadingText || 'Carregando...'}
                              </div>
                            )}
                            {specialConfig?.error && (
                              <div className={`text-xs mt-1 ml-1 ${specialConfig.errorColor || 'text-orange-600'}`}>
                                {specialConfig.error}
                              </div>
                            )}
                            {hasSubmitted && fieldErrors[field.name] && (
                              <div className="text-red-500 text-xs mt-1">
                                {fieldErrors[field.name]}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

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
