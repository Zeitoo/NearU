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

interface changePassType {
	actual: string;
	newPass: string;
}

interface serverResponse {
	message: string;
	data: any;
}

import { api } from "../auth/auth";

function useSign() {
	const host = import.meta.env.VITE_API_URL;

	const signIn = async (data: signInType) => {
		try {
			const response = await fetch(`${host}/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
				credentials: "include",
			});

			const message = (await response.json()) as serverResponse;

			return message;
		} catch (error: any) {
			return { message: error.message };
		}
	};

	const signUp = async (data: signUpType) => {
		try {
			const response = await fetch(`${host}/api/auth/register`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const message = (await response.json()) as serverResponse;
			return message;
		} catch (error: any) {
			return { message: error.message };
		}
	};

	const changePass = async (data: changePassType) => {
		try {
			const response = await api.patch("api/auth/changepass", data);

			const message = response.data as serverResponse;
			return message;
		} catch (error: any) {
			return { message: error.message };
		}
	};

	const deleteAccount = async (data: { password: string }) => {
		try {
			const response = await api.delete("api/auth/deleteaccount", {
				data
			});

			const message = response.data;
			return message;
		} catch (error: any) {
			return { message: error.message };
		}
	};

	return {
		signIn,
		signUp,
		changePass,
		deleteAccount,
	};
}
export default useSign;
