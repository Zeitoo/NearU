import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { putUserByGoogle } from "../models/auth.model";
import { string } from "zod";

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: process.env.GOOGLE_CALLBACK_URL!,
		},
		async (_accessToken, _refreshToken, profile, done) => {
			try {
				const email = profile.emails?.[0]?.value;

				if (!email)
					return done(new Error("Email não fornecido pelo Google"));

				const user = await putUserByGoogle({
					googleId: profile.id,
					email,
					displayName: profile.displayName,
					photo: String(Math.floor(Math.random() * 40)),
				});

				return done(null, user);
			} catch (err) {
				return done(err as Error);
			}
		}
	)
);

export default passport;
