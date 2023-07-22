import {useTranslation, withTranslation} from 'react-i18next';
import {withHover} from '../hoc/WithHover';
import {useHover} from '../hooks/useHover';
import {useRef} from 'react';

const LangSelector = ({on}) => {
    // use hook instead HOC
    const {i18n} = useTranslation()

    const ref = useRef()
    const on1 = useHover(ref.current);

    let style = {};
    if (on1) {
        style = {
            color: 'green'
        }
    }

    return (
        <div style={style} ref={ref}>
            {on?.toString()}
            <br/>
            <span onClick={() => {
                i18n.changeLanguage('ru');
            }} title='Rus'>Ru</span>&nbsp;
            <span onClick={() => {
                i18n.changeLanguage('en');
            }} title='Eng'>Eng</span>
        </div>
    )
}

export default withHover(LangSelector);
