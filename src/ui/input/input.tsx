import * as React from 'react';
import { IInputProps } from './types';
import { ClassNames } from '../utils';
import * as autosizeLibray from './autosize';
import { Icon, Label } from '../../ui';
import '../../../src/ui/input/input.module.scss';

export const Input: React.SFC<
    IInputProps
    & React.InputHTMLAttributes<HTMLElement>
> = React.forwardRef((props, ref) => {
    let {
        autosize,
        className,
        color,
        disabled,
        icon,
        isClearable,
        label,
        value,
        variant,
        onBlur,
        onChange,
        onEnter,
        onFocus,
        onKeyDown,
        ...attributesOriginal
    } = props,
        attributes: React.InputHTMLAttributes<HTMLElement> = attributesOriginal,
        labelItem = null,
        inputBefore = null,
        inputAfter = null;

    const [isFilled, setIsFilled] = React.useState(!!value);
    const [isFocusedHook, setIsFocusedHook] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value);
    const [timeoutHook, setTimeoutHook] = React.useState(null);
    const textarea = React.useRef(null);

    className = ClassNames(
        'kui-input',
        (color) ? 'kui-input--color_' + color: null,
        (disabled) ? 'kui-input--disabled' : null,
        (isFilled) ? 'kui-input--filled' : null,
        (isFocusedHook) ? 'kui-input--focus' : null,
        (!autosize) ? 'kui-input--noresize' : null,
        (variant) ? 'kui-input--variant_' + variant : null,
        className
    );

    attributes.className = 'kui-input__item';
    if (disabled) {
        attributes.disabled = true;
    }

    attributes.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsFilled(!!e.target.value);
        setInputValue(e.target.value);
        if (onChange) onChange(e);
    };

    attributes.onKeyDown = (e) => {
        if (e && e.which === 13) {
            if (!autosize) e.preventDefault();
            if (onEnter) onEnter(e);
        }
        if (onKeyDown) onKeyDown(e);
    };

    /**
     * Проблема: при клике на иконку инпут получает одновременно onBlur и onFocus
     */

    attributes.onBlur = (e) => {
        e.persist();
        setTimeoutHook(setTimeout(() => {
            if (isFocusedHook) {
                setIsFocusedHook(false);
                if (onBlur) onBlur(e);
            }
        }, 200));
    }

    attributes.onFocus = (e) => {
        clearTimeout(timeoutHook);
        setTimeoutHook(setTimeout(() => {
            if (!isFocusedHook) {
                setIsFocusedHook(true);
                if (onFocus) onFocus(e);
            }
        }, 100));
    }

    if (label) {
        labelItem = (<div className="kui-label__item">{label}</div>);
    }

    const clearInput = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setIsFilled(false);
        setInputValue('');
        if (onChange) onChange(e);
    };

    if (variant === 'arrow' || variant === 'header') {
        inputAfter = <Icon
            xlink="arrow-down"
            size={24}
            className="kui-input__icon kui-input__icon--arrow"
        />;
    } else if
        (variant === 'datepicker') {
        autosize = false;
        icon = icon || 'calendar';
        attributes.readOnly = true;
        const iconCalendar = <Icon
            xlink={icon}
            size={24}
            className="kui-input__icon"
        />;
        if (isClearable) {
            const iconClear = <Icon
                xlink="clear"
                size={24}
                className="kui-input__icon kui-input__icon--clear"
                onClick={clearInput}
            />;
            inputAfter = (isFilled) ? iconClear : iconCalendar;
        } else {
            inputAfter = iconCalendar;
        }
    } else if
        (variant === 'search') {
        inputBefore = (<span className="kui-input-search">
            <Icon
                xlink="search"
                size={24}
                className="kui-input-search__icon"
            />
            <span className="kui-input-search__placeholder">
                Search
            </span>
        </span>);
        inputAfter = <Icon
            xlink="clear"
            size={24}
            className="kui-input__icon kui-input__icon--clear"
            onClick={clearInput} />;
    } else if
        (icon && variant === 'withicon') {
        inputAfter = <Icon
            xlink={icon}
            size={24}
            className="kui-input__icon"
        />;
    }

    const Tag = (autosize) ? 'textarea' : 'input';

    React.useEffect(() => {
        if (autosize) autosizeLibray.default(textarea.current);
    }, []);

    React.useEffect(() => {
        return () => {
            clearTimeout(timeoutHook);
        };
    }, [timeoutHook]);

    React.useEffect(() => {
        setInputValue(value);
    }, [value]);

    React.useImperativeHandle(ref, () => ({
        setIsFilled(value: string) {
            setIsFilled(!!value);
        }
    }));

    return (
        <Label className={className}>
            {labelItem}
            {inputBefore}
            <Tag
                rows={1}
                ref={textarea}
                value={inputValue}
                {...attributes}
            ></Tag>
            {inputAfter}
        </Label>
    );
});

Input.defaultProps = {
    autosize: true,
    color: null,
    disabled: false,
    icon: null,
    isClearable: false,
    label: null,
    value: '',
    variant: null,
    onEnter: (): void => undefined
}

Input.displayName = 'Input';
