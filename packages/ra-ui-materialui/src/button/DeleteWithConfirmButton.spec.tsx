import { render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import expect from 'expect';
import { TestContext, Resource } from 'ra-core';
import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import DeleteWithConfirmButton from "./DeleteWithConfirmButton";

const theme = createMuiTheme();

const invalidButtonDomProps = {
    basePath: '',
    handleSubmit: jest.fn(),
    handleSubmitWithRedirect: jest.fn(),
    invalid: false,
    onSave: jest.fn(),
    pristine: false,
    record: { id: 123, foo: 'bar' },
    redirect: 'list',
    resource: 'posts',
    saving: false,
    submitOnEnter: true,
    undoable: false,
};

describe('<DeleteWithConfirmButton />', () => {
    afterEach(cleanup);

    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByLabelText } = render(
          <TestContext initialState={{ admin: { resources: { posts: { data: { 1: {id: 1, foo: 'bar' } } } } } }}>
              <ThemeProvider theme={theme}>
                  <DeleteWithConfirmButton {...invalidButtonDomProps} />
              </ThemeProvider>
          </TestContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('ra.action.delete').getAttribute('type')).toEqual(
          'button'
        );

        spy.mockRestore();
    });
});
