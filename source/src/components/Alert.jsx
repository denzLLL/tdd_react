export const Alert = ({type = '', text = '', children, center = false}) => {
	let classForAlert = `alert alert-${type}`;

	if (center) {
		classForAlert += ' text-center';
	}

	return (
		<div className={classForAlert}>
			{text}{children}
		</div>
	)
}
