import React, { cloneElement, memo } from 'react';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import classnames from 'classnames';

import PureDatagridRow, { DatagridRow } from './DatagridRow';

export const DatagridBody = ({
    basePath,
    children,
    classes,
    className,
    data,
    expand,
    hasBulkActions,
    hover,
    ids,
    onToggleItem,
    resource,
    row,
    rowClick,
    rowStyle,
    selectedIds,
    styles,
    version,
    ...rest
}) => (
    <TableBody className={classnames('datagrid-body', className)} {...rest}>
        {ids.map((id, rowIndex) =>
            cloneElement(
                row,
                {
                    basePath,
                    classes,
                    className: classnames(classes.row, {
                        [classes.rowEven]: rowIndex % 2 === 0,
                        [classes.rowOdd]: rowIndex % 2 !== 0,
                        [classes.clickableRow]: rowClick,
                    }),
                    expand,
                    hasBulkActions,
                    hover,
                    id,
                    key: id,
                    onToggleItem,
                    record: data[id],
                    resource,
                    rowClick,
                    selected: selectedIds.includes(id),
                    style: rowStyle ? rowStyle(data[id], rowIndex) : null,
                },
                children
            )
        )}
    </TableBody>
);

DatagridBody.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    data: PropTypes.object.isRequired,
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool.isRequired,
    hover: PropTypes.bool,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    row: PropTypes.element,
    rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    styles: PropTypes.object,
    version: PropTypes.number,
};

DatagridBody.defaultProps = {
    data: {},
    hasBulkActions: false,
    ids: [],
    row: <DatagridRow />,
};

const MemoDatagridBody = memo(DatagridBody);
// trick material-ui Table into thinking this is one of the child type it supports
MemoDatagridBody.muiName = 'TableBody';
MemoDatagridBody.defaultProps = {
    row: <PureDatagridRow />,
};

export default MemoDatagridBody;
