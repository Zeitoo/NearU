interface signInType {
	email: string;
	password: string;
	session?: boolean;
}

interface signUpType {
	name: string;
	phone: string;
	email: string;
	password: string;
	avatar: number;
}

function useSign() {
	const host = import.meta.env.VITE_API_URL;

	const signIn = async (data: signInType) => {
		const response = await fetch(`${host}/api/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const message = await response.json();

		return message;
	};

	const signUp = async (data: signUpType) => {
		const response = await fetch(`${host}/api/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const message = await response.json();
		return message;
	};

	return {
		signIn,
		signUp,
	};
}
export default useSign;
