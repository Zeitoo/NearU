import { z } from "zod";

export const signupSchema = z.object({
	name: z
		.string()
		.nonempty("Nome é obrigatório")
		.min(3, "Mínimo de 3 caracteres")
		.max(50, "Máximo de 50 caracteres")
		.regex(/^[A-Za-zÀ-ÿ\s'-]+$/, "Nome inválido"),
	phone: z
		.string()
		.nonempty("Obrigatório")
		.refine((v) => /^\+[1-9]\d{1,14}$/.test(v.replaceAll(" ", "")), {
			message: "Número inválido",
		}),

	email: z.string().nonempty("Email é obrigatório").email("Email inválido"),
	password: z
		.string()
		.nonempty("Palavra-passe é obrigatória")
		.min(8, "Muito curta")
		.max(12, "Muito longa")
		.regex(/[!@#$%&*?]/, {
			message: "Deve conter pelo menos um símbolo",
		}),
	avatar: z.number(),
});

export const formsChema = z.object({
	email: z.string().nonempty("Email é obrigatório").email("Email inválido"),
	password: z
		.string()
		.nonempty("Palavra-passe é obrigatória")
		.min(8, "Muito curta")
		.max(12, "Muito longa")
		.regex(/[!@#$%&*?]/, {
			message: "Deve conter pelo menos um símbolo",
		}),
	session: z.coerce.boolean().optional(),
});

export const passChangeschema = z.object({
	actual: z
		.string()
		.nonempty("Palavra-passe é obrigatória")
		.min(8, "Muito curta")
		.max(12, "Muito longa")
		.regex(/[!@#$%&*?]/, {
			message: "Deve conter pelo menos um símbolo",
		}),
	newPass: z
		.string()
		.nonempty("Palavra-passe é obrigatória")
		.min(8, "Muito curta")
		.max(12, "Muito longa")
		.regex(/[!@#$%&*?]/, {
			message: "Deve conter pelo menos um símbolo",
		}),
});

export type passChangeForm = z.infer<typeof passChangeschema>;
export type SignInForm = z.infer<typeof formsChema>;

export type SignUpForm = z.infer<typeof signupSchema>;
