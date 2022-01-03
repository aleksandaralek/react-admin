import { createContext } from 'react';
import { CreateControllerResult } from './useCreateController';

/**
 * Context to store the result of the useCreateController() hook.
 *
 * Use the useCreateContext() hook to read the context. That's what the Create components do in react-admin.
 *
 * @example
 *
 * import { useCreateController, CreateContextProvider } from 'ra-core';
 *
 * const Create = props => {
 *     const controllerProps = useCreateController(props);
 *     return (
 *         <CreateContextProvider value={controllerProps}>
 *             ...
 *         </CreateContextProvider>
 *     );
 * };
 */
export const CreateContext = createContext<CreateControllerResult>({
    record: null,
    defaultTitle: null,
    onFailureRef: null,
    onSuccessRef: null,
    transformRef: null,
    isFetching: null,
    isLoading: null,
    redirect: null,
    setOnFailure: null,
    setOnSuccess: null,
    setTransform: null,
    resource: null,
    save: null,
    saving: null,
});

CreateContext.displayName = 'CreateContext';
