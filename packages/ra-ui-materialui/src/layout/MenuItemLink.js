import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, createStyles } from '@material-ui/core/styles';

const NavLinkRef = React.forwardRef((props, ref) => (
    <NavLink innerRef={ref} {...props} />
));

const styles = theme =>
    createStyles({
        root: {
            color: theme.palette.text.secondary,
        },
        active: {
            color: theme.palette.text.primary,
        },
        icon: { minWidth: theme.spacing(5) },
    });

export class MenuItemLink extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        className: PropTypes.string,
        leftIcon: PropTypes.element,
        onClick: PropTypes.func,
        primaryText: PropTypes.node,
        staticContext: PropTypes.object,
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
            .isRequired,
    };

    handleMenuTap = e => {
        this.props.onClick && this.props.onClick(e);
    };

    renderMenuItem() {
        const {
            classes,
            className,
            primaryText,
            leftIcon,
            staticContext,
            ...props
        } = this.props;

        return (
            <MenuItem
                className={classnames(classes.root, className)}
                activeClassName={classes.active}
                component={NavLinkRef}
                {...props}
                onClick={this.handleMenuTap}
            >
                {leftIcon && (
                    <ListItemIcon className={classes.icon}>
                        {cloneElement(leftIcon, { titleAccess: primaryText })}
                    </ListItemIcon>
                )}
                {primaryText}
            </MenuItem>
        );
    }

    render() {
        const { sidebarIsOpen, primaryText } = this.props;

        if (sidebarIsOpen) {
            return this.renderMenuItem();
        }

        return (
            <Tooltip title={primaryText} placement="right">
                {this.renderMenuItem()}
            </Tooltip>
        );
    }
}

export default withStyles(styles)(MenuItemLink);
