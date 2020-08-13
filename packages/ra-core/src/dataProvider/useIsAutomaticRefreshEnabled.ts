import { useSelector } from 'react-redux';
import { ReduxState } from 'ra-core';

const useIsAutomaticRefreshEnabled = () => {
    const automaticRefreshEnabled = useSelector<ReduxState>(
        state => state.admin.ui.automaticRefreshEnabled
    );

    return automaticRefreshEnabled;
};

export default useIsAutomaticRefreshEnabled;
