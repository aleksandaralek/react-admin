import * as React from 'react';
import { useResourceContext, usePreference, useStore } from 'ra-core';

import { Configurable } from '../../preferences';
import { Datagrid, DatagridProps } from './Datagrid';
import { DatagridEditor } from './DatagridEditor';

export const DatagridConfigurable = ({
    preferenceKey,
    ...props
}: DatagridConfigurableProps) => {
    if (props.optimized) {
        throw new Error(
            'DatagridConfigurable does not support the optimized prop'
        );
    }
    const resource = useResourceContext(props);
    const finalPreferenceKey = preferenceKey || `${resource}.datagrid`;
    const [availableColumns, setAvailableColumns] = useStore<
        { source: string; label?: string }[]
    >(`preferences.${finalPreferenceKey}.availableColumns`, []);

    React.useEffect(() => {
        if (availableColumns.length === 0) {
            // first render, or the preference have been cleared
            const columns = React.Children.map(props.children, child =>
                React.isValidElement(child) && child.props.source
                    ? { source: child.props.source, label: child.props.label }
                    : null
            ).filter(column => column != null);
            setAvailableColumns(columns);
        }
    }, [availableColumns]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Configurable
            editor={
                <DatagridEditor omit={props.omit}>
                    {props.children}
                </DatagridEditor>
            }
            preferenceKey={finalPreferenceKey}
            sx={{
                display: 'block',
                '& .MuiBadge-root': { display: 'flex' },
                '& .RaDatagrid-root': { flex: 1 },
                '& .MuiBadge-badge': { zIndex: 2 },
            }}
        >
            <DatagridWithPreferences {...props} />
        </Configurable>
    );
};

export type DatagridConfigurableProps = DatagridProps & {
    preferenceKey?: string;
    omit?: string[];
};

const DatagridWithPreferences = ({
    children,
    omit,
    ...props
}: DatagridProps & { omit?: string[] }) => {
    const [availableColumns] = usePreference('availableColumns', []);
    const [columns] = usePreference(
        'columns',
        availableColumns
            .map(column => column.source)
            .filter(name => !omit?.includes(name))
    );
    const columnsBySource = React.Children.toArray(children).reduce(
        (acc, child) => {
            if (React.isValidElement(child)) {
                acc[child.props.source] = child;
            }
            return acc;
        },
        {}
    );

    return (
        <Datagrid {...props}>
            {columns === undefined
                ? children
                : columns.map(name => columnsBySource[name])}
        </Datagrid>
    );
};

DatagridConfigurable.propTypes = Datagrid.propTypes;
