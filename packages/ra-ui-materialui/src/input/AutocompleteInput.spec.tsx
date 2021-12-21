import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { AutocompleteInput } from './AutocompleteInput';
import { Form } from 'react-final-form';
import { TestTranslationProvider } from 'ra-core';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';

describe('<AutocompleteInput />', () => {
    const defaultProps = {
        source: 'role',
        resource: 'users',
    };

    it('should set AutocompleteInput value to an empty string when the selected item is null', () => {
        render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );
        expect(screen.queryByDisplayValue('')).not.toBeNull();
    });

    it('should use the input value as the initial state and input searchText', () => {
        render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
    });

    it('should use optionValue as value identifier', async () => {
        render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionValue="foobar"
                        choices={[
                            { foobar: 2, name: 'foo' },
                            { foobar: 3, name: 'bar' },
                        ]}
                    />
                )}
            />
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionValue including "." as value identifier', async () => {
        render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionValue="foobar.id"
                        choices={[
                            { foobar: { id: 2 }, name: 'foo' },
                            { foobar: { id: 3 }, name: 'bar' },
                        ]}
                    />
                )}
            />
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionText with a string value as text identifier', async () => {
        render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[
                            { id: 2, foobar: 'foo' },
                            { id: 3, foobar: 'bar' },
                        ]}
                    />
                )}
            />
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();

        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionText with a string value including "." as text identifier', async () => {
        render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionText="foobar.name"
                        choices={[
                            { id: 2, foobar: { name: 'foo' } },
                            { id: 3, foobar: { name: 'bar' } },
                        ]}
                    />
                )}
            />
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionText with a function value as text identifier', async () => {
        render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[
                            { id: 2, foobar: 'foo' },
                            { id: 3, foobar: 'bar' },
                        ]}
                    />
                )}
            />
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();

        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
        });
    });

    it('should translate the value by default', async () => {
        render(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 2 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[
                                { id: 2, name: 'foo' },
                                { id: 3, name: 'bar' },
                            ]}
                        />
                    )}
                />
            </TestTranslationProvider>
        );
        expect(screen.queryByDisplayValue('**foo**')).not.toBeNull();
        fireEvent.focus(
            screen.getByLabelText('**resources.users.fields.role**')
        );
        await waitFor(() => {
            expect(screen.queryByText('**bar**')).not.toBeNull();
        });
    });

    it('should not translate the value if translateChoice is false', async () => {
        render(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 2 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            translateChoice={false}
                            choices={[
                                { id: 2, name: 'foo' },
                                { id: 3, name: 'bar' },
                            ]}
                        />
                    )}
                />
            </TestTranslationProvider>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
        expect(screen.queryByDisplayValue('**foo**')).toBeNull();
        fireEvent.focus(
            screen.getByLabelText('**resources.users.fields.role**')
        );
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
            expect(screen.queryByText('**bar**')).toBeNull();
        });
    });

    it('should show the suggestions on focus', async () => {
        render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );

        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('foo')).not.toBeNull();
        });
    });

    it('should respect shouldRenderSuggestions over default if passed in', async () => {
        render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        shouldRenderSuggestions={() => false}
                        options={{ noOptionsText: 'No options' }}
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                )}
            />
        );

        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        await waitFor(() => {
            expect(screen.queryByText('foo')).toBeNull();
        });
    });

    it('should not fail when value is null and new choices are applied', () => {
        const { rerender } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: null }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        expect(input.value).toEqual('');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();

        rerender(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: null }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 1, name: 'bar' }]}
                    />
                )}
            />
        );

        expect(input.value).toEqual('');
    });

    it('should repopulate the suggestions after the suggestions are dismissed', () => {
        render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: null }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'bar' } });
        expect(screen.queryByText('foo')).toBeNull();

        // Temporary workaround until we can upgrade testing-library in v4
        input.blur();
        input.focus();
        fireEvent.change(input, { target: { value: 'foo' } });
        expect(screen.queryByText('foo')).not.toBeNull();
    });

    it('should not rerender searchText while having focus and new choices arrive', () => {
        const { rerender } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: null }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'foo' } });
        expect(input.value).toEqual('foo');

        rerender(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: null }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 1, name: 'bar' }]}
                    />
                )}
            />
        );

        expect(input.value).toEqual('foo');
    });

    it('should revert the searchText when allowEmpty is false', async () => {
        render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'bar' } });
        fireEvent.blur(input);
        await waitFor(() => {
            expect(input.value).toEqual('foo');
        });
    });

    it('should show the suggestions when the input value is null and the input is focussed and choices arrived late', () => {
        const { rerender } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => <AutocompleteInput {...defaultProps} />}
            />
        );

        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);

        rerender(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                )}
            />
        );
        expect(
            screen.queryByText('foo', {
                selector: '[role="option"]',
            })
        ).not.toBeNull();
        expect(
            screen.queryByText('bar', {
                selector: '[role="option"]',
            })
        ).not.toBeNull();
    });

    it('should reset filter when input value changed', async () => {
        const setFilter = jest.fn();
        const { rerender } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        setFilter={setFilter}
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                )}
            />
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.change(input, { target: { value: 'bar' } });
        expect(setFilter).toHaveBeenCalledTimes(1);
        expect(setFilter).toHaveBeenCalledWith('bar');

        rerender(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 1 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        setFilter={setFilter}
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                )}
            />
        );
        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledTimes(2);
        });
        expect(setFilter).toHaveBeenCalledWith('');
    });

    it('should allow customized rendering of suggesting item', () => {
        const SuggestionItem = ({ record, ...rest }: { record?: any }) => (
            <div {...rest} aria-label={record && record.name} />
        );

        render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionText={<SuggestionItem />}
                        matchSuggestion={() => true}
                        inputText={record => record?.name}
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                )}
            />
        );

        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        expect(screen.queryByLabelText('bar')).not.toBeNull();
        expect(screen.queryByLabelText('foo')).not.toBeNull();
    });

    it('should display helperText if specified', () => {
        render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        helperText="Can I help you?"
                        choices={[{ id: 1, name: 'hello' }]}
                    />
                )}
            />
        );
        expect(screen.queryByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        const failingValidator = () => 'ra.validation.error';

        it('should not be displayed if field is pristine', () => {
            render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    )}
                />
            );
            expect(screen.queryByText('ra.validation.error')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 1 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    )}
                />
            );
            fireEvent.click(
                screen.getByLabelText('ra.action.clear_input_value')
            );
            fireEvent.blur(
                screen.getByLabelText('resources.users.fields.role')
            );

            expect(screen.queryByText('ra.validation.error')).not.toBeNull();
        });
    });

    it('updates suggestions when input is blurred and refocused', () => {
        render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[
                            { id: 1, name: 'ab' },
                            { id: 2, name: 'abc' },
                            { id: 3, name: '123' },
                        ]}
                    />
                )}
            />
        );
        const input = screen.getByLabelText('resources.users.fields.role');

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'a' } });
        expect(screen.queryAllByRole('option').length).toEqual(2);
        fireEvent.blur(input);

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'a' } });
        expect(screen.queryAllByRole('option').length).toEqual(2);
    });

    it('does not automatically select a matched choice if there is only one', async () => {
        render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[
                            { id: 1, name: 'ab' },
                            { id: 2, name: 'abc' },
                            { id: 3, name: '123' },
                        ]}
                    />
                )}
            />
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'abc' } });
        await waitFor(() =>
            expect(screen.queryAllByRole('option').length).toEqual(1)
        );
    });

    it('should accept 0 as an input value', () => {
        render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 0 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 0, name: 'foo' }]}
                    />
                )}
            />
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
    });

    it('should support creation of a new choice through the onCreate event', async () => {
        const choices = [
            { id: 'ang', name: 'Angular' },
            { id: 'rea', name: 'React' },
        ];
        const handleCreate = filter => {
            const newChoice = {
                id: 'js_fatigue',
                name: filter,
            };
            choices.push(newChoice);
            return newChoice;
        };

        const { rerender } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                )}
            />
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(screen.getByText('ra.action.create_item'));
        await new Promise(resolve => setImmediate(resolve));
        rerender(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        resettable
                        choices={choices}
                        onCreate={handleCreate}
                    />
                )}
            />
        );
        expect(
            screen.queryByDisplayValue('New Kid On The Block')
        ).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.clear_input_value'));
        fireEvent.blur(input);
        fireEvent.focus(input);
        expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
    });

    it('should support creation of a new choice through the onCreate event with a promise', async () => {
        const choices = [
            { id: 'ang', name: 'Angular' },
            { id: 'rea', name: 'React' },
        ];
        const handleCreate = filter => {
            return new Promise(resolve => {
                const newChoice = {
                    id: 'js_fatigue',
                    name: filter,
                };
                choices.push(newChoice);
                setTimeout(() => resolve(newChoice), 100);
            });
        };

        const { rerender } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                        resettable
                    />
                )}
            />
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(screen.getByText('ra.action.create_item'));
        await new Promise(resolve => setTimeout(resolve, 100));
        rerender(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        resettable
                        choices={choices}
                        onCreate={handleCreate}
                    />
                )}
            />
        );
        expect(
            screen.queryByDisplayValue('New Kid On The Block')
        ).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.clear_input_value'));
        fireEvent.blur(input);
        fireEvent.focus(input);
        expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
    });

    it('should support creation of a new choice through the create element', async () => {
        const choices = [
            { id: 'ang', name: 'Angular' },
            { id: 'rea', name: 'React' },
        ];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        const Create = () => {
            const context = useCreateSuggestionContext();
            const handleClick = () => {
                choices.push(newChoice);
                context.onCreate(newChoice);
            };

            return <button onClick={handleClick}>Get the kid</button>;
        };

        const { rerender } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        create={<Create />}
                        resettable
                    />
                )}
            />
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(screen.getByText('ra.action.create_item'));
        fireEvent.click(screen.getByText('Get the kid'));
        rerender(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        resettable
                        choices={choices}
                        create={<Create />}
                    />
                )}
            />
        );
        expect(
            screen.queryByDisplayValue('New Kid On The Block')
        ).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.clear_input_value'));
        fireEvent.blur(input);
        fireEvent.focus(input);
        expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
    });
});
