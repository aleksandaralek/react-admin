import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import CoreAdminContext from './CoreAdminContext';
import { CoreAdminRouter } from './CoreAdminRouter';
import { Resource } from './Resource';
import { CustomRoutes } from './CustomRoutes';
import { CoreLayoutProps } from '../types';
import { testDataProvider } from '../dataProvider';

const Layout = ({ children }: CoreLayoutProps) => <div>Layout {children}</div>;
const CatchAll = () => <div />;
const Loading = () => <>Loading</>;

describe('<CoreAdminRouter>', () => {
    const defaultProps = {
        customRoutes: [],
    };

    describe('With resources as regular children', () => {
        it('should render all resources in routes', () => {
            const history = createMemoryHistory();
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider()}
                    history={history}
                >
                    <CoreAdminRouter
                        {...defaultProps}
                        layout={Layout}
                        catchAll={CatchAll}
                        loading={Loading}
                    >
                        <Resource
                            name="posts"
                            list={() => <span>PostList</span>}
                        />
                        <Resource
                            name="comments"
                            list={() => <span>CommentList</span>}
                        />
                    </CoreAdminRouter>
                </CoreAdminContext>
            );
            expect(screen.getByText('Layout')).not.toBeNull();
            history.push('/posts');
            expect(screen.getByText('PostList')).not.toBeNull();
            history.push('/comments');
            expect(screen.getByText('CommentList')).not.toBeNull();
        });
    });

    describe('With no authProvider defined', () => {
        it('should render all resources with a render prop', async () => {
            const history = createMemoryHistory();
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider()}
                    history={history}
                >
                    <CoreAdminRouter
                        {...defaultProps}
                        layout={Layout}
                        catchAll={CatchAll}
                        loading={Loading}
                    >
                        {() => (
                            <>
                                <Resource
                                    name="posts"
                                    list={() => <span>PostList</span>}
                                />
                                <Resource
                                    name="comments"
                                    list={() => <span>CommentList</span>}
                                />
                            </>
                        )}
                    </CoreAdminRouter>
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(screen.getByText('Layout')).not.toBeNull();
            });
            history.push('/posts');
            await waitFor(() => {
                expect(screen.getByText('PostList')).not.toBeNull();
            });
            history.push('/comments');
            await waitFor(() => {
                expect(screen.getByText('CommentList')).not.toBeNull();
            });
        });
    });

    describe('With resources returned from a function as children', () => {
        it('should render all resources with a registration intent', async () => {
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            const history = createMemoryHistory();
            render(
                <CoreAdminContext
                    authProvider={authProvider}
                    dataProvider={testDataProvider()}
                    history={history}
                >
                    <CoreAdminRouter
                        layout={Layout}
                        catchAll={CatchAll}
                        loading={Loading}
                    >
                        {() => (
                            <>
                                <Resource
                                    name="posts"
                                    list={() => <span>PostList</span>}
                                />
                                <Resource
                                    name="comments"
                                    list={() => <span>CommentList</span>}
                                />
                                {null}
                            </>
                        )}
                    </CoreAdminRouter>
                </CoreAdminContext>
            );
            // Timeout needed because of the authProvider call
            await waitFor(() => {
                expect(screen.queryByText('Layout')).not.toBeNull();
            });
            history.push('/posts');
            expect(screen.queryByText('PostList')).not.toBeNull();
            history.push('/comments');
            expect(screen.queryByText('CommentList')).not.toBeNull();
        });

        it('should return loading while the resources are not resolved', async () => {
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };
            const Custom = () => <>Custom</>;

            const history = createMemoryHistory();
            render(
                <CoreAdminContext
                    authProvider={authProvider}
                    dataProvider={testDataProvider()}
                    history={history}
                >
                    <CoreAdminRouter
                        {...defaultProps}
                        layout={Layout}
                        loading={Loading}
                        catchAll={CatchAll}
                    >
                        <CustomRoutes noLayout>
                            <Route path="/foo" element={<Custom />} />
                        </CustomRoutes>
                        {() => new Promise(() => null)}
                    </CoreAdminRouter>
                </CoreAdminContext>
            );
            // Timeout needed because we wait for a second before displaying the loading screen
            await new Promise(resolve => setTimeout(resolve, 1010));
            history.push('/posts');
            expect(screen.queryByText('Loading')).not.toBeNull();
            history.push('/foo');
            expect(screen.queryByText('Loading')).toBeNull();
            expect(screen.queryByText('Custom')).not.toBeNull();
        });
    });

    it('should render the custom routes with and without layout', () => {
        const history = createMemoryHistory();
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <CoreAdminRouter
                    layout={Layout}
                    catchAll={CatchAll}
                    loading={Loading}
                >
                    <CustomRoutes noLayout>
                        <Route path="/foo" element={<div>Foo</div>} />
                    </CustomRoutes>
                    <CustomRoutes>
                        <Route path="/bar" element={<div>Bar</div>} />
                    </CustomRoutes>
                    <Resource name="posts" />
                </CoreAdminRouter>
            </CoreAdminContext>
        );
        history.push('/foo');
        expect(screen.queryByText('Layout')).toBeNull();
        expect(screen.getByText('Foo')).not.toBeNull();
        history.push('/bar');
        expect(screen.getByText('Layout')).not.toBeNull();
        expect(screen.getByText('Bar')).not.toBeNull();
    });
});
