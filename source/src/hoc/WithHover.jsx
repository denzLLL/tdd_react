import {useState} from 'react';

export const withHover = (WrappedComponent, configuration) => {
    return function NewComponent(props) {
        const [data, setData] = useState({
            on: false
        })

        const onMouseOver = () => {
            setData({
                ...data,
                on: true
            })
        }

        const onMouseOut = () => {
            setData({
                ...data,
                on: false
            })
        }

        let style = {};
        if (data.on) {
            style = {
                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
            }
        }

        return (
            <div className='mt-3 '>
                <div style={style} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
                    <WrappedComponent
                        {...props} on={data.on}
                    />
                </div>
            </div>

        );
    }
}
