import * as React from 'react';
import { IButtonsGroupProps } from './types';
import { ClassNames } from '../utils';
import '../../../src/ui/buttonsGroup/buttonsGroup.module.scss';

export const ButtonsGroup: React.SFC<
    IButtonsGroupProps
    & React.HTMLAttributes<HTMLElement>
> = (props) => {
    let {
        children,
        className,
        size,
        ...attributes
    } = props;

    className = ClassNames(
        'kui-buttons_group',
        (size) ? 'kui-buttons_group--size_' + size : null,
        className
    );

    return (
        <div
            className={className}
            {...attributes}
        >
            {children}
        </div>
    );
}

ButtonsGroup.defaultProps = {
    size: null
}

ButtonsGroup.displayName = 'ButtonsGroup';
