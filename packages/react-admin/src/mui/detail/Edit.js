import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card, { CardContent } from 'material-ui/Card';
import compose from 'recompose/compose';
import inflection from 'inflection';
import classnames from 'classnames';
import { reset } from 'redux-form';

import Header from '../layout/Header';
import Title from '../layout/Title';
import {
    crudGetOne as crudGetOneAction,
    crudUpdate as crudUpdateAction,
} from '../../actions/dataActions';
import DefaultActions from './EditActions';
import translate from '../../i18n/translate';

const sanitizeRestProps = ({
    actions,
    children,
    className,
    crudGetOne,
    crudUpdate,
    data,
    hasCreate,
    hasDelete,
    hasEdit,
    hasList,
    hasShow,
    id,
    isLoading,
    resetForm,
    resource,
    title,
    translate,
    version,
    match,
    location,
    history,
    options,
    locale,
    permissions,
    ...rest
}) => rest;

/**
 * Page component for the Edit view
 * 
 * The `<Edit>` component renders the page title and actions,
 * fetches the record from the data provider.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes pass the `record` as prop.
 *
 * The `<Edit>` component accepts the following props:
 *
 * - title
 * - actions
 * 
 * Both expect an element for value.
 * 
 * @example     
 *     // in src/posts.js
 *     import React from 'react';
 *     import { Edit, SimpleForm, TextInput } from 'react-admin';
 *     
 *     export const PostEdit = (props) => (
 *         <Edit {...props}>
 *             <SimpleForm>
 *                 <TextInput source="title" />
 *             </SimpleForm>
 *         </Edit>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'react-admin';
 *     
 *     import { PostEdit } from './posts';
 *     
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" edit={PostEdit} />
 *         </Admin>
 *     );
 *     export default App;
 */
export class Edit extends Component {
    componentDidMount() {
        this.updateData();
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.id !== nextProps.id ||
            nextProps.version !== this.props.version
        ) {
            this.props.resetForm('record-form');
            this.updateData(nextProps.resource, nextProps.id);
        }
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname
            .split('/')
            .slice(0, -1)
            .join('/');
    }

    defaultRedirectRoute() {
        return 'list';
    }

    updateData(resource = this.props.resource, id = this.props.id) {
        this.props.crudGetOne(resource, id, this.getBasePath());
    }

    save = (record, redirect) => {
        this.props.crudUpdate(
            this.props.resource,
            this.props.id,
            record,
            this.props.data,
            this.getBasePath(),
            redirect
        );
    };

    render() {
        const {
            actions = <DefaultActions />,
            children,
            className,
            data,
            hasDelete,
            hasList,
            hasShow,
            id,
            isLoading,
            resource,
            title,
            translate,
            version,
            ...rest
        } = this.props;

        if (!children) return null;

        const basePath = this.getBasePath();

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('ra.page.edit', {
            name: `${resourceName}`,
            id,
            data,
        });
        const titleElement = data ? (
            <Title title={title} record={data} defaultTitle={defaultTitle} />
        ) : (
            ''
        );

        return (
            <div
                className={classnames('edit-page', className)}
                {...sanitizeRestProps(rest)}
            >
                <Card style={{ opacity: isLoading ? 0.8 : 1 }}>
                    <Header
                        title={titleElement}
                        actions={actions}
                        actionProps={{
                            basePath,
                            data,
                            hasDelete,
                            hasShow,
                            hasList,
                            resource,
                        }}
                    />
                    {data ? (
                        React.cloneElement(children, {
                            save: this.save,
                            resource,
                            basePath,
                            record: data,
                            translate,
                            version,
                            redirect:
                                typeof children.props.redirect === 'undefined'
                                    ? this.defaultRedirectRoute()
                                    : children.props.redirect,
                        })
                    ) : (
                        <CardContent>&nbsp;</CardContent>
                    )}
                </Card>
            </div>
        );
    }
}

Edit.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.node,
    className: PropTypes.string,
    crudGetOne: PropTypes.func.isRequired,
    crudUpdate: PropTypes.func.isRequired,
    data: PropTypes.object,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasDelete: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    id: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    translate: PropTypes.func,
    version: PropTypes.number.isRequired,
};

function mapStateToProps(state, props) {
    return {
        id: decodeURIComponent(props.match.params.id),
        data: state.admin.resources[props.resource]
            ? state.admin.resources[props.resource].data[
                  decodeURIComponent(props.match.params.id)
              ]
            : null,
        isLoading: state.admin.loading > 0,
        version: state.admin.ui.viewVersion,
    };
}

const enhance = compose(
    connect(mapStateToProps, {
        crudGetOne: crudGetOneAction,
        crudUpdate: crudUpdateAction,
        resetForm: reset,
    }),
    translate
);

export default enhance(Edit);
