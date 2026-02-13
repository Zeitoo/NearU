import { useState, useMemo, useRef, useEffect } from "react";
import React from "react";
import { MuiTelInput } from "mui-tel-input";

interface PhoneInputProps {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error: boolean;
  helperText?: string;
}

export const PhoneInput = React.memo(function PhoneInput({
  value,
  onChange,
  onBlur,
  error,
  helperText,
}: PhoneInputProps) {
  const [localValue, setLocalValue] = useState(value ?? "");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if ((value ?? "") !== localValue) {
      setLocalValue(value ?? "");
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleLocalChange = (v: string) => {
    setLocalValue(v);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      onChange(v);
      timerRef.current = null;
    }, 300);
  };

  const handleBlur = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onChange(localValue);
    onBlur();
  };

  const slotProps = useMemo(
    () => ({
      input: {
        autoComplete: "tel",
        "aria-label": "Telefone",
        inputProps: {
          maxLength: 28,
          minLength: 2,
        },
      },
    }),
    []
  );

  const sx = useMemo(
    () => ({
      "& .MuiOutlinedInput-root": {
        minHeight: "20px",
        paddingTop: "0px",
        paddingLeft: "8px",
        paddingBottom: "0px",
      },
      "& .MuiTelInput-Flag": {
        fontSize: "16px",
      },
      "& .MuiInputBase-input": {
        padding: "12px",
        fontSize: "13px",
      },
      "& .MuiFormHelperText-root": {
        margin: "8px 1px 0px 2px",
        fontSize: "11px",
        opacity: 0.7,
      },
    }),
    []
  );

  return (
    <MuiTelInput
      value={localValue}
      onChange={handleLocalChange}
      onBlur={handleBlur}
      defaultCountry="MZ"
      label="Telefone"
      slotProps={slotProps}
      error={error}
      helperText={helperText}
      sx={sx}
    />
  );
});
