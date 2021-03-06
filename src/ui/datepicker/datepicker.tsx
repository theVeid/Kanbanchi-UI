import * as React from 'react';
import { IDatepickerProps } from './types';
import ReactDatepicker, { registerLocale } from 'react-datepicker';
import * as enGB from 'date-fns/locale/en-GB';
import { ClassNames } from '../utils';
import { Input } from '../../ui';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../src/ui/datepicker/datepicker.module.scss';

const ReactDatepickerElement = ReactDatepicker as any;

registerLocale('en-GB', enGB); // Weeks start on Monday

export const Datepicker: React.SFC<
    IDatepickerProps
    & React.HTMLAttributes<HTMLElement>
> = (props) => {
    let {
        className,
        color,
        label,
        isClearable,
        selected,
        variant,
        onChange,
        ...attributes
    } = props;

    className = ClassNames(
        'kui-datepicker',
        className
    );

    const pickerRef = React.useRef(null);

    const inputAttributes = {
        color,
        isClearable,
        label,
        variant
    };

    const onChangeHandler = (date: Date) => {
        pickerRef.current.input.setIsFilled(date);
        if (onChange) onChange(date);
    }

    return (
        <div className={className}>
            <ReactDatepickerElement
                customInput={<Input {...inputAttributes}/>}
                locale="en-GB"
                ref={pickerRef}
                selected={selected}
                onChange={onChangeHandler}
                {...attributes}
            />
        </div>
    );
}

Datepicker.defaultProps = {
    color: null,
    dateFormat: 'd MMM yyyy',
    isClearable: true,
    label: null,
    selected: null,
    variant: 'datepicker',
    onChange: (): void => undefined
};

Datepicker.displayName = 'Datepicker';
