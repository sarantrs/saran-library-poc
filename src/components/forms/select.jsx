import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import Required from './required.jsx';
import './select.scss';

const getLongestStringInArray = arr => {
  let longest = arr[0];
  for (let str of arr) {
    if (str && (str.length > longest.length)) longest = str;
  }
  return longest;
}

const Select = props => {
  //let selectOptions = props.options;
  let selectOptions = props.options.map(item => {
    return Object.assign({}, item);
  });

if (props.placeholder && selectOptions.length > 0 && selectOptions[0].displayValue !== props.placeholder && selectOptions[0] && selectOptions[0].displayValue ) {
    selectOptions.splice(0, 0, { value: '', displayValue: props.placeholder });
  }

  const stringValues = useMemo(() =>
    selectOptions && selectOptions.map((option) => Object.assign({}, option, { value: option.value.toString() }))
  );

  const [error, setError] = React.useState('');

  const getDisplayValue = val => {
    const option = selectOptions && selectOptions.filter(opt => opt.value === val);
    // NOTE: This should only return one option - please keep options unique
    if (option && !option.length) return null;
    return option[0].displayValue || option[0].value;
  }

  const selectRef = useRef(null);

  let clickCount = 0;
  let toggle = null;
  let spacer = null;
  let dropdownWidth = 0;

  const [value, setValue] = useState(props.value || null);
  const [displayValue, setDisplayValue] = useState(
    getDisplayValue(props.value) || props.placeholder || 'Select...'
  );
  const [longestOption] = useState(
    getLongestStringInArray([...stringValues.map(opt => opt.displayValue || opt.value), displayValue])
  );
  const [timeStamp, setTimeStamp] = React.useState(props.ts);

  if (props.ts !== timeStamp) {
    setTimeStamp(props.ts);
    setValue(props.value);
    setDisplayValue(getDisplayValue(props.value) || props.placeholder || 'Select...');
  }

  const changeSelection = evt => {
    evt.preventDefault();

    const target = evt.currentTarget;
    const val = target.getAttribute('data-value');
    setDisplayValue(target.innerText);
    setValue(val);

    // evt.losTarget = { value: val };
    evt.losTarget = {
      value: val,
      selected: getSelectedValues(val, selectOptions)
    }

    /*
      Going with "losTarget" because:
      1. It represents a consistent reference to the value we care about; and
      2. It's easy to search the codebase for 'los' to see customizations
    */

    if (props.onChange) props.onChange(evt);
  }

  const handleBlur = evt => {
    if (!evt.relatedTarget || !evt.relatedTarget.classList.contains('dropdown-item')) {
      if (props.validators) {
        const isValid = testValue((Array.isArray(value) ? value.value : value) || '');
      }

      if (props.onBlur) {
        // evt.losTarget = { value: value };
        evt.losTarget = {
          value: value,
          selected: getSelectedValues(value, selectOptions)
        }
        props.onBlur(evt);
      }
    }
  }

  const testValue = value => {
    let err = '';

    for (let validator of props.validators) {
      err = validator.fn(value, validator.err);
      // TASK: remove this after there have been no UI/UX issues for awhile
      // if (err === 'Required') {
      //   if (props.required) {
      //     setValue('');
      //   } else err = '';
      // }
      if (err) break;
    }

    return err ? setError(err) : !setError(err);
  }

  const resizeDropdownMenu = () => {
    /*
      The dropdown menu needs to be visible/selectable for this to work, so
      queue the logic to run after the main stack.  This might be avoidable
      if the elements were hidden via CSS' visibility: hidden, but the
      underlying bootstrap component uses display: none/block.
    */
    setTimeout(() => {
      dropdownWidth = spacer.getBoundingClientRect().width;
      const menu = selectRef.current.querySelector('.dropdown-menu.show');
      if (menu) menu.style.width = `${dropdownWidth}px`;
    });
  }

  const resizeDropdownMenuOnFirstClick = () => {
    // If the toggle button is not focused (as is the case in FF), set a class
    // flagging that the blur handler must be called later.
    selectRef.current.setAttribute('call-blur', !selectRef.current.querySelector('.dropdown-toggle:focus'));

    if (!clickCount) {
      resizeDropdownMenu();
      clickCount++;
    }
  }

  const resetClickCountAndResizeMenu = () => {
    clickCount = 0;
    resizeDropdownMenu();
  }

  const getSelectedValues = (value, options) => options && options.filter(o => o.value === value);

  useEffect(() => {
    if (!spacer) {
      toggle = selectRef.current.querySelector('.dropdown-toggle.btn');
      spacer = selectRef.current.querySelector('.spacer');
    }

    toggle.addEventListener('click', resizeDropdownMenuOnFirstClick);
    window.addEventListener('resize', resetClickCountAndResizeMenu);

    // Set up an mutation observer to detect "blur" for browsers that need it
    const targetNode = selectRef.current.querySelector('.dropdown-toggle');
    const config = { attributes: true };
    const callback = (mutationsList, observer) => {
      if (selectRef.current.getAttribute('call-blur') === "false") return;

      for (let mutation of mutationsList) {
        if (mutation.attributeName === 'aria-expanded' && mutation.target.getAttribute('aria-expanded') === "false") {
          if (props.onBlur) {
            props.onBlur({
              currentTarget: mutation.target,
              losTarget: {
                value: toggle.value,
                selected: getSelectedValues(toggle.value, selectOptions)
              }
            });
          }
        }
      }
    };

    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    // ------  End of mutation observer setup  --------

    // cleanup
    return () => {
      toggle.removeEventListener('click', resizeDropdownMenuOnFirstClick);
      window.removeEventListener('resize', resetClickCountAndResizeMenu);
      observer.disconnect();
      observer = null;
    }
  }, []);

  return (
    <div ref={selectRef} className="los-select">
      <Form.Group className={error ? "error" : ""}>
        <div
          className={`${!props.label
            ? `no-label${props.required ? "-but-required" : ""}`
            : ""
            }`}
        >
          {props.label && (
            <Form.Label>
              {props.label}
              {props.required && <Required />}
            </Form.Label>
          )}
          {!props.label && props.required && <Required />}
          {!props.label && !props.required && (
            <span aria-hidden="true" className="aligner">|</span>
          )}
          <div className="widget-container" title={displayValue} disabled={props.toBeDisabled ? props.disabled : false}>
            <div aria-hidden="true" className="spacer">
              <span>{longestOption}</span>
              <span></span>
            </div>
            <Dropdown>
              <Dropdown.Toggle
                className="btn-block"
                id="los-dropdown-toggle"
                onBlur={handleBlur}
                value={value}
                disabled={props.disabled != undefined && props.disabled === true ? true : false}
              >
                <span>{displayValue}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {(selectOptions || []).map((opt, idx) => (
                  <Dropdown.Item
                    as="button"
                    key={idx}
                    onClick={changeSelection}
                    data-value={opt.value}
                  >
                    {opt.displayValue || opt.value}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <span className="form-error">{error || ""}</span>
      </Form.Group>
    </div>
  );
}

export default Select;