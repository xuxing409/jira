import { Select } from "antd";
import React from "react";
import { Raw } from "types";
// 利用以下工具类透传antd上的所有属性 typeof取所有类型
type SelectProps = React.ComponentProps<typeof Select>
// 这里报错是因为antd的select组件上已经有options属性，使用ommit排除重复属性
interface IdSelectProps extends Omit<SelectProps, 'value'| 'onChange' | 'options'>  {
  value: Raw | null | undefined;
  onChange: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
} 
/**
 * value 可以传入多种类型的值
 * onChange 只会回调 number | undefined 类型
 * 当isNaN(Number(value)) 为true时，代表选择默认类型
 * 当选择默认类型的时候，onChange会回调undefined
 */
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options, ...resetProps } = props;

  return (
    <Select
      value={toNumber(value)}
      onChange={(value) => onChange(toNumber(value) || undefined)}
      {...resetProps}
    >
      {
        defaultOptionName ? <Select.Option value={0}>{defaultOptionName}</Select.Option> : null
      }
      {
        options?.map(option => <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>)
      }
    </Select>
  );
};

const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));
