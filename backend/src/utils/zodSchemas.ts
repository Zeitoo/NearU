import { z } from "zod";

export const signinSchema = z
	.object({
		email: z
			.string()
			.nonempty("Email é obrigatório")
			.email("Email inválido"),
		password: z
			.string()
			.nonempty("Palavra-passe é obrigatória")
			.min(8, "Muito curta")
			.max(12, "Muito longa")
			.regex(/[!@#$%&*?]/, {
				message: "Deve conter pelo menos um símbolo",
			}),
		session: z.coerce.boolean().optional().default(false),
	})
	.strict();

export type SignInForm = z.infer<typeof signinSchema>;

export const signupSchema = z
	.object({
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

		email: z
			.string()
			.nonempty("Email é obrigatório")
			.email("Email inválido"),
		password: z
			.string()
			.nonempty("Palavra-passe é obrigatória")
			.min(8, "Muito curta")
			.max(12, "Muito longa")
			.regex(/[!@#$%&*?]/, {
				message: "Deve conter pelo menos um símbolo",
			}),
		avatar: z.number(),
	})
	.strict();

export type SignUpForm = z.infer<typeof signupSchema>;
