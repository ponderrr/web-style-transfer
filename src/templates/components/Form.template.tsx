import React, { useState, useId } from "react";
import { cn } from "@/lib/utils";

interface BaseFieldProps {
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

interface TextFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "password" | "tel" | "url" | "search";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

interface TextAreaProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps extends BaseFieldProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  multiple?: boolean;
}

interface CheckboxProps extends BaseFieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
}

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps extends BaseFieldProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  direction?: "vertical" | "horizontal";
}

interface FormProps {
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  method?: "post" | "get";
  action?: string;
  encType?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
}

// Form context for managing form state
interface FormContextValue {
  formData: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error: string) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
}

const FormContext = React.createContext<FormContextValue | null>(null);

function useFormContext() {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("Form components must be used within a Form");
  }
  return context;
}

// Form field wrapper component
function FieldWrapper({
  label,
  name,
  required,
  error,
  hint,
  disabled,
  children,
  className,
  fieldId,
}: BaseFieldProps & {
  children: React.ReactNode;
  fieldId: string;
}) {
  const hasError = !!error;
  const hasHint = !!hint;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      <label
        htmlFor={fieldId}
        className={cn(
          "block text-sm font-medium",
          disabled ? "text-gray-400" : "text-gray-700",
          required && "after:content-['*'] after:ml-1 after:text-red-500"
        )}
      >
        {label}
      </label>

      {/* Field */}
      <div className="relative">{children}</div>

      {/* Hint */}
      {hasHint && !hasError && (
        <p className="text-sm text-gray-500" id={`${fieldId}-hint`}>
          {hint}
        </p>
      )}

      {/* Error */}
      {hasError && (
        <p
          className="text-sm text-red-600"
          id={`${fieldId}-error`}
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Text Input Component
export function TextField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  required,
  disabled,
  error,
  hint,
  minLength,
  maxLength,
  pattern,
  autoComplete,
  autoFocus,
  className,
}: TextFieldProps) {
  const { formData, errors, touched, setFieldValue, setFieldTouched } =
    useFormContext();
  const fieldId = useId();

  const fieldValue = value !== undefined ? value : formData[name] || "";
  const fieldError = error || (touched[name] ? errors[name] : undefined);
  const fieldDisabled = disabled;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFieldValue(name, newValue);
    onChange?.(newValue);
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
    onBlur?.();
  };

  return (
    <FieldWrapper
      label={label}
      name={name}
      required={required}
      error={fieldError}
      hint={hint}
      disabled={fieldDisabled}
      fieldId={fieldId}
      className={className}
    >
      <input
        id={fieldId}
        name={name}
        type={type}
        value={fieldValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        disabled={fieldDisabled}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        aria-describedby={
          fieldError ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        aria-invalid={!!fieldError}
        className={cn(
          "block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm",
          fieldError
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
          fieldDisabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
          "min-h-[44px]" // Ensure touch target meets 44px minimum
        )}
      />
    </FieldWrapper>
  );
}

// TextArea Component
export function TextArea({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  required,
  disabled,
  error,
  hint,
  rows = 4,
  minLength,
  maxLength,
  resize = "vertical",
  className,
}: TextAreaProps) {
  const { formData, errors, touched, setFieldValue, setFieldTouched } =
    useFormContext();
  const fieldId = useId();

  const fieldValue = value !== undefined ? value : formData[name] || "";
  const fieldError = error || (touched[name] ? errors[name] : undefined);
  const fieldDisabled = disabled;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setFieldValue(name, newValue);
    onChange?.(newValue);
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
    onBlur?.();
  };

  const resizeClass = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  };

  return (
    <FieldWrapper
      label={label}
      name={name}
      required={required}
      error={fieldError}
      hint={hint}
      disabled={fieldDisabled}
      fieldId={fieldId}
      className={className}
    >
      <textarea
        id={fieldId}
        name={name}
        value={fieldValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        disabled={fieldDisabled}
        rows={rows}
        minLength={minLength}
        maxLength={maxLength}
        aria-describedby={
          fieldError ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        aria-invalid={!!fieldError}
        className={cn(
          "block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm",
          resizeClass[resize],
          fieldError
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
          fieldDisabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
          "min-h-[44px]" // Ensure touch target meets 44px minimum
        )}
      />
    </FieldWrapper>
  );
}

// Select Component
export function Select({
  label,
  name,
  options,
  value,
  onChange,
  onBlur,
  required,
  disabled,
  error,
  hint,
  placeholder,
  multiple = false,
  className,
}: SelectFieldProps) {
  const { formData, errors, touched, setFieldValue, setFieldTouched } =
    useFormContext();
  const fieldId = useId();

  const fieldValue =
    value !== undefined ? value : formData[name] || (multiple ? [] : "");
  const fieldError = error || (touched[name] ? errors[name] : undefined);
  const fieldDisabled = disabled;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = multiple
      ? Array.from(e.target.selectedOptions, (option) => option.value)
      : e.target.value;
    setFieldValue(name, newValue);
    onChange?.(newValue as string);
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
    onBlur?.();
  };

  return (
    <FieldWrapper
      label={label}
      name={name}
      required={required}
      error={fieldError}
      hint={hint}
      disabled={fieldDisabled}
      fieldId={fieldId}
      className={className}
    >
      <select
        id={fieldId}
        name={name}
        value={fieldValue}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        disabled={fieldDisabled}
        multiple={multiple}
        aria-describedby={
          fieldError ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        aria-invalid={!!fieldError}
        className={cn(
          "block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm",
          fieldError
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
          fieldDisabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
          "min-h-[44px]" // Ensure touch target meets 44px minimum
        )}
      >
        {placeholder && (
          <option value="" disabled={!multiple}>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

// Checkbox Component
export function Checkbox({
  label,
  name,
  checked,
  onChange,
  required,
  disabled,
  error,
  hint,
  indeterminate,
  className,
}: CheckboxProps) {
  const { formData, errors, touched, setFieldValue, setFieldTouched } =
    useFormContext();
  const fieldId = useId();

  const fieldChecked =
    checked !== undefined ? checked : formData[name] || false;
  const fieldError = error || (touched[name] ? errors[name] : undefined);
  const fieldDisabled = disabled;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setFieldValue(name, newChecked);
    onChange?.(newChecked);
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
  };

  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <div className="flex items-center h-6">
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          checked={fieldChecked}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          disabled={fieldDisabled}
          aria-describedby={
            fieldError
              ? `${fieldId}-error`
              : hint
                ? `${fieldId}-hint`
                : undefined
          }
          aria-invalid={!!fieldError}
          ref={(el) => {
            if (el && indeterminate !== undefined) {
              el.indeterminate = indeterminate;
            }
          }}
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0",
            fieldError &&
              "border-red-300 focus:border-red-500 focus:ring-red-500",
            fieldDisabled && "bg-gray-50 text-gray-500 cursor-not-allowed"
          )}
        />
      </div>
      <div className="min-h-[44px] flex flex-col">
        <label
          htmlFor={fieldId}
          className={cn(
            "text-sm font-medium",
            fieldDisabled ? "text-gray-400" : "text-gray-700",
            required && "after:content-['*'] after:ml-1 after:text-red-500"
          )}
        >
          {label}
        </label>
        {hint && !fieldError && (
          <p className="text-sm text-gray-500 mt-1" id={`${fieldId}-hint`}>
            {hint}
          </p>
        )}
        {fieldError && (
          <p
            className="text-sm text-red-600 mt-1"
            id={`${fieldId}-error`}
            role="alert"
            aria-live="polite"
          >
            {fieldError}
          </p>
        )}
      </div>
    </div>
  );
}

// Radio Group Component
export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  required,
  disabled,
  error,
  hint,
  direction = "vertical",
  className,
}: RadioGroupProps) {
  const { formData, errors, touched, setFieldValue, setFieldTouched } =
    useFormContext();
  const groupId = useId();

  const fieldValue = value !== undefined ? value : formData[name] || "";
  const fieldError = error || (touched[name] ? errors[name] : undefined);
  const fieldDisabled = disabled;

  const handleChange = (optionValue: string) => {
    setFieldValue(name, optionValue);
    onChange?.(optionValue);
    setFieldTouched(name, true);
  };

  return (
    <fieldset className={cn("space-y-4", className)}>
      <legend
        className={cn(
          "text-sm font-medium",
          fieldDisabled ? "text-gray-400" : "text-gray-700",
          required && "after:content-['*'] after:ml-1 after:text-red-500"
        )}
      >
        {label}
      </legend>

      <div
        className={cn(
          "space-y-3",
          direction === "horizontal" && "flex flex-wrap gap-6"
        )}
        role="radiogroup"
        aria-describedby={
          fieldError ? `${groupId}-error` : hint ? `${groupId}-hint` : undefined
        }
        aria-invalid={!!fieldError}
      >
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const isChecked = fieldValue === option.value;
          const isOptionDisabled = fieldDisabled || option.disabled;

          return (
            <div key={option.value} className="flex items-center">
              <input
                id={optionId}
                name={name}
                type="radio"
                value={option.value}
                checked={isChecked}
                onChange={() => handleChange(option.value)}
                required={required}
                disabled={isOptionDisabled}
                className={cn(
                  "h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0",
                  fieldError &&
                    "border-red-300 focus:border-red-500 focus:ring-red-500",
                  isOptionDisabled &&
                    "bg-gray-50 text-gray-500 cursor-not-allowed"
                )}
              />
              <label
                htmlFor={optionId}
                className={cn(
                  "ml-3 block text-sm",
                  isOptionDisabled ? "text-gray-400" : "text-gray-700",
                  "min-h-[44px] flex items-center cursor-pointer"
                )}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>

      {hint && !fieldError && (
        <p className="text-sm text-gray-500" id={`${groupId}-hint`}>
          {hint}
        </p>
      )}

      {fieldError && (
        <p
          className="text-sm text-red-600"
          id={`${groupId}-error`}
          role="alert"
          aria-live="polite"
        >
          {fieldError}
        </p>
      )}
    </fieldset>
  );
}

// Submit Button Component
export function SubmitButton({
  children,
  loading,
  disabled,
  className,
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const { isSubmitting } = useFormContext();

  return (
    <button
      type="submit"
      disabled={disabled || isSubmitting || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px]",
        className
      )}
    >
      {loading || isSubmitting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Main Form Component
export function Form({
  onSubmit,
  children,
  className,
  loading = false,
  disabled = false,
  method = "post",
  action,
  encType,
}: FormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldError = (name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const setFieldTouched = (name: string, touchedValue: boolean) => {
    setTouched((prev) => ({ ...prev, [name]: touchedValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contextValue: FormContextValue = {
    formData,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    isSubmitting,
    setIsSubmitting,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        onSubmit={handleSubmit}
        className={cn("space-y-6", className)}
        method={method}
        action={action}
        encType={encType}
        noValidate
        aria-label="Form"
      >
        <fieldset disabled={disabled || isSubmitting || loading}>
          {children}
        </fieldset>
      </form>
    </FormContext.Provider>
  );
}

// Form Section Component
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </section>
  );
}

// Form Actions Component
export function FormActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0",
        className
      )}
    >
      {children}
    </div>
  );
}

// Export form utilities
export function useFormField(name: string) {
  const {
    formData,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  } = useFormContext();

  return {
    value: formData[name],
    error: touched[name] ? errors[name] : undefined,
    touched: touched[name],
    setValue: (value: any) => setFieldValue(name, value),
    setError: (error: string) => setFieldError(name, error),
    setTouched: (touchedValue: boolean) => setFieldTouched(name, touchedValue),
  };
}
