import { useState } from "react";
import Option, { OptionWithNested } from "./Option";

interface OptionsListProps {
  // Options for the popup. Nested options are supported that expand it
  options: OptionWithNested[];
  extraOptionStyles?: string[];
}

const OptionsList = ({
  options: optionProps,
  extraOptionStyles,
}: OptionsListProps) => {
  const initialOptions: OptionWithNested[] = optionProps.map((option) => ({
    ...option,
    showNestedOptions: false,
  }));
  const [options, setOptions] = useState<OptionWithNested[]>(initialOptions);

  // Toggle nested options visibility for clicked option
  const handleOptionClick = (id: string | number) => {
    const index = options.findIndex((option) => option.mainOption.id === id);
    const option = options[index];
    if (option.nestedOptions) {
      const newOptions = [...options];
      newOptions[index].showNestedOptions =
        !newOptions[index].showNestedOptions;
      setOptions(newOptions);
    }
    option.mainOption.onSelect && option.mainOption.onSelect();
  };

  const optionsJSX: React.ReactElement[] = [];
  options.forEach((option) => {
    // For each option, include itself along with its nested options
    let nestedOptionsJSX: Array<React.ReactElement> = [];
    if (option.nestedOptions && option.showNestedOptions) {
      nestedOptionsJSX = option.nestedOptions?.map((nested) => (
        <Option
          mainOption={{ ...nested }}
          key={nested.id}
          extraStyles={extraOptionStyles}
        />
      ));
    }

    optionsJSX.push(
      <Option
        mainOption={{
          ...option.mainOption,
          onSelect: () => handleOptionClick(option.mainOption.id),
        }}
        nestedOptions={option.nestedOptions}
        showNestedOptions={option.showNestedOptions}
        key={option.mainOption.id}
        extraStyles={extraOptionStyles}
      />,
      ...nestedOptionsJSX
    );
  });

  return <>{optionsJSX}</>;
};

export default OptionsList;
