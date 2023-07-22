import {Spinner} from './Spinner';

export const ButtonWithProgress = (props) => {
	const {disabled, apiProgress, onClick} = props;

	return (
		<button title="Sign Up"
				disabled={disabled || apiProgress}
				onClick={onClick}
				className="btn btn-primary"
				type="button">
			{props.children}
			{apiProgress && <Spinner/>}
		</button>
	)
}
