import React from "react";
import { Input as InputAntd, Form } from "antd";

export interface InputProps {
  name: string;
  placeholder?: string;
  label?: string;
  rules?: any[];
  disabled?: boolean;
  type?: string;
  size?: "large" | "middle" | "small";
  value?: string;
  defaultValue?: string;
  maxLength?: number;
  allowClear?: boolean;
  className?: string;
  validateTrigger?: string | string[] | false;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  noStyle?: boolean;
  initialValue?: string;
  hasFeedback?: boolean;
  dependencies?: any[];
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  name,
  placeholder,
  label,
  rules = [],
  className,
  defaultValue,
  validateTrigger,
  noStyle,
  hasFeedback,
  dependencies,
  value,
  onChange,
  onBlur,
  onKeyDown, 
  disabled,
  type = "text",
  size = "middle",
  maxLength,
  allowClear,
  prefix,
  suffix,
  initialValue, 
}) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      className={className}
      validateTrigger={validateTrigger}
      noStyle={noStyle}
      hasFeedback={hasFeedback}
      dependencies={dependencies}
      initialValue={initialValue || defaultValue} 
    >
      {type === "password" ? (
        <InputAntd.Password
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown} 
          disabled={disabled}
          size={size}
          maxLength={maxLength}
          allowClear={allowClear}
          prefix={prefix}
        />
      ) : (
        <InputAntd
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown} 
          disabled={disabled}
          type={type}
          size={size}
          maxLength={maxLength}
          allowClear={allowClear}
          prefix={prefix}
          suffix={suffix}
        />
      )}
    </Form.Item>
  );
};