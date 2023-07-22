export const Spinner = ({size}) => {
	let spanClass = `spinner-grow`
	if (size !== 'big') {
		spanClass += ` spinner-grow-sm`
	}

	return (
		<span className={spanClass} role="status"></span>
	)
}
