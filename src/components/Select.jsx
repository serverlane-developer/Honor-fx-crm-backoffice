import React from "react";

import { Select as AntSelect } from "antd";
import propTypes from "prop-types";

const Select = ({
  disabled,
  loading,
  allowFilter,
  filterOption,
  showSearch,
  options,
  placeholder,
  labelKey,
  valueKey,
  allowClear,
  ...props
}) => (
  <AntSelect
    placeholder={placeholder}
    disabled={disabled}
    loading={loading}
    filterOption={
      allowFilter
        ? filterOption || ((input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase()))
        : null
    }
    showSearch={showSearch}
    allowClear={allowClear}
    options={(options || []).map((option) => ({ label: option[labelKey], value: option[valueKey] }))}
    {...props}
  />
);
Select.defaultProps = {
  disabled: false,
  loading: false,
  allowFilter: true,
  filterOption: null,
  showSearch: true,
  options: [],
  placeholder: "Select",
  labelKey: "label",
  valueKey: "value",
  allowClear: false,
};
Select.propTypes = {
  disabled: propTypes.bool,
  loading: propTypes.bool,
  allowFilter: propTypes.bool,
  filterOption: propTypes.oneOfType([propTypes.func, null]),
  showSearch: propTypes.bool,
  options: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.string,
      value: propTypes.string,
    })
  ),
  placeholder: propTypes.string,
  labelKey: propTypes.string,
  valueKey: propTypes.string,
  allowClear: propTypes.bool,
};

export default Select;
