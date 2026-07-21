import { Divider, Select, Segmented, InputNumber, Checkbox, Slider, Row, Col, Tooltip, Input } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";



export const ParamName = ({ name, tooltip="" }) => {
  return (
    <Divider orientation="left" style={{ fontSize: '12px', marginBottom: '4px', marginTop: '8px' }}>{name} {tooltip && <Tooltip title={tooltip}><InfoCircleOutlined /></Tooltip>}</Divider>
  )
}


export const ParamSelect = ({ value="Select", options=[], disabled=false, disabledText="No options available", onChange=()=>{}, style={ width: '100%' }, status="" }) => {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    return (
      <Select
        style={style}
        open={isSelectOpen}
        onClick={() => setIsSelectOpen(!isSelectOpen)}
        onBlur={() => setIsSelectOpen(false)}
        onFocus={() => setIsSelectOpen(true)}
        value={disabled ? disabledText : value}
        disabled={disabled}
        onChange={onChange}
        options={options}
        status={status}
      />
    )
}


export const ParamSelectWithSearch = ({ value="Select", options=[], disabled=false, onChange=()=>{}, style={ width: '100%' }, status="" }) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  return (
    <Select
      showSearch
      optionFilterProp="label"
      filterOption={(input, option) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      style={{ width: '100%' }}
      open={isSelectOpen}
      onClick={() => setIsSelectOpen(!isSelectOpen)}
      onBlur={() => setIsSelectOpen(false)}
      onFocus={() => setIsSelectOpen(true)}
      value={value}
      disabled={disabled}
      onChange={onChange}
      options={options}
      status={status}
    />
  )
}


export const ParamSegmented = ({ value="Select", options=[], disabled=false, onChange=()=>{}, style={ width: '100%' }, status="" }) => {
  const customOptions = options.map((option) => 
    ({ value: option.value, label: <div style={{ 
      fontSize: '10px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}>{option.label}</div> })
  );
  
  return ( <Segmented
    block
    style={style}
    value={value}
    disabled={disabled}
    onChange={onChange}
    options={customOptions}
    status={status}
    /> )
}


export const ParamMultiSelect = ({ value="Select", options=[], disabled=false, disabledText="No options available", onChange=()=>{}, style={ width: '100%' }, status="" }) => {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    return (
      <Select
        mode="multiple"
        style={style}
        open={isSelectOpen}
        value={disabled ? [disabledText] : value}
        onClick={() => setIsSelectOpen(!isSelectOpen)}
        onBlur={() => setIsSelectOpen(false)}
        onFocus={() => setIsSelectOpen(true)}
        disabled={disabled}
        onChange={onChange}
        options={options}
        status={status}
      />
    )
}


export const ParamInputNumber = ({ value=0, disabled=false, onChange=()=>{}, style={ width: '100%' } , status="", min, max, step }) => {
    return (
      <InputNumber
        className="nodrag"
        type="number"
        style={style}
        value={value}
        disabled={disabled}
        onChange={onChange}
        status={status}
        min={min}
        max={max}
        step={step}
      />
    )
}


export const ParamCheckbox = ({ label="Check", checked=false, onChange=()=>{}, style={ width: '100%' }, status="" }) => {
    return (
    <Checkbox
        style={style}
        checked={checked}
        onChange={onChange}
        status={status}
    >
        {label}
    </Checkbox>
    )
}


export const ParamSlider = ({ value=0, disabled=false, onChange=()=>{}, style={ width: '100%' } , status="", min, max, step }) => {
  const [internalValue, setInternalValue] = useState(value);
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
  };

  const handleChange = (newValue) => {
    setInternalValue(newValue);
  };

  const handleChangeComplete = (newValue) => {
    onChange(newValue);
  };

  return (
    <Slider
      className="nodrag"
      min={min}
      max={max}
      step={step}
      value={internalValue}
      onChange={handleChange}
      onChangeComplete={handleChangeComplete}
      onMouseDown={handleMouseDown}
      disabled={disabled}
      style={style}
    />
  );
};


export const ParamSliderWithInput = ({ value=0, disabled=false, onChange=()=>{}, style={ width: '100%' } , status="", min, max, step }) => {
  const [internalValue, setInternalValue] = useState(value);
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
  };

  const handleChange = (newValue) => {
    setInternalValue(newValue);
  };

  const handleChangeComplete = (newValue) => {
    onChange(newValue);
  };

  return (
    <Row gutter={16} justify="space-between" align="middle">
      <Col span={16}>
        <Slider
          className="nodrag"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={handleChange}
          onChangeComplete={handleChangeComplete}
          onMouseDown={handleMouseDown}
          disabled={disabled}
          style={{ width: '100%' }}
        />
      </Col>
      <Col span={7}>
        <InputNumber
          size="small"
          className="nodrag"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={handleChange}
          disabled={disabled}
          style={{ width: '100%' }}
        />
      </Col>
    </Row>
  );
};


export const ParamTopic = ({ name }) => {
  return (
    <Divider orientation="left" style={{ 
      fontSize: '14px', 
      marginBottom: '4px',
      marginTop: '24px',
      borderColor: 'rgba(0, 0, 0, 0.4)',
      }}>{name}</Divider>
  )
}

export const ParamInput = ({ value="", disabled=false, onChange=()=>{}, style={ width: '100%' }, status="" }) => {
  return (
    <Input
      value={value}
      disabled={disabled}
      onChange={onChange}
      style={style}
      status={status}
    />
  )
}