import { useCallback } from 'react';
import template from 'lodash/template';

import { useTranslate } from '../i18n';

export const useRenderTemplate = () => {
    const translate = useTranslate();
    return useCallback(
        (templateString: string, data: any, defaultTitle?: string) => {
            try {
                return template(templateString)(data);
            } catch (e) {
                return (
                    defaultTitle ??
                    translate('ra.configurable.templateError', {
                        _: '# template error #',
                    })
                );
            }
        },
        [translate]
    );
};
