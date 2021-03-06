import * as React from 'react';
import { IButtonsSegmentedProps } from './types';
import { ClassNames } from '../utils';
import '../../../src/ui/buttonsSegmented/buttonsSegmented.module.scss';

export const ButtonsSegmented: React.SFC<
    IButtonsSegmentedProps
    & React.HTMLAttributes<HTMLElement>
> = (props) => {
    let {
        active,
        children,
        className,
        color,
        onChange,
        ...attributes
    } = props;

    className = ClassNames(
        'kui-buttons_segmented',
        (color) ? 'kui-buttons_segmented--color_' + color : null,
        className
    );

    let childrenArray: Array<{}> = // children could be string, we need array
        (Array.isArray(children)) ? children : [children];

    const buttonHocs = React.Children.map(childrenArray, (child: any, i) => {
        return React.cloneElement(child, {
            className: ClassNames(
                'kui-buttons_segmented__item',
                (child.props.className) ? child.props.className : null,
                (i === active) ? 'kui-buttons_segmented__item--active' : null
            ),
            onClick: (e) => {
                if (onChange) onChange(i);
                if (child.props.onClick) child.props.onClick(e);
            }
        });
    });

    return (
        <div
            className={className}
            {...attributes}
        >
            {buttonHocs}
        </div>
    );
};

ButtonsSegmented.defaultProps = {
    active: 0,
    color: null,
    onChange: (): void => undefined
};

ButtonsSegmented.displayName = 'ButtonsSegmented';
