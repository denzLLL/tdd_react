const Input = (props) => {

    const {id, label, onChange, help, type = 'text', initialValue} = props

    let inputClass = 'form-control';
    if (help) {
        inputClass += ' is-invalid'
    }

    return (
        <div className="mb-3">
            <label className="form-label" htmlFor={id}>
                {label}
            </label>
            <input className={inputClass}
                   defaultValue={initialValue}
                   id={id}
                   type={type} onChange={onChange}/>
            {help && <span className="invalid-feedback">{help}</span>}
        </div>
    )
}

export default Input;
