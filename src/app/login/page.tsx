"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconBrandGithub, IconGitBranch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient, signIn, signUp } from "@/lib/auth-client";

type Mode = "signin" | "signup";

export default function LoginPage() {
	const router = useRouter();
	const [mode, setMode] = useState<Mode>("signin");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	function toggleMode() {
		setMode((m) => (m === "signin" ? "signup" : "signin"));
		setError(null);
	}

	async function handleGitHub() {
		await signIn.social({ provider: "github", callbackURL: "/dashboard" });
	}

	async function handleEmailSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			if (mode === "signin") {
				// signIn.email is available at runtime when the backend has emailAndPassword enabled
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const { error: err } = await (authClient as any).signIn.email({ email, password });
				if (err) throw new Error(err.message);
			} else {
				const { error: err } = await signUp.email({ email, password, name });
				if (err) throw new Error(err.message);
			}
			router.push("/dashboard");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
			<div className="mb-8 flex items-center gap-2">
				<IconGitBranch size={24} className="text-primary" />
				<span className="font-mono text-xl font-semibold">MergeLens</span>
			</div>

			<Card className="w-full max-w-sm">
				<CardHeader className="text-center">
					<CardTitle className="text-lg">
						{mode === "signin" ? "Sign in" : "Create account"}
					</CardTitle>
					<CardDescription>
						{mode === "signin"
							? "Connect your GitHub account to view your PR reviews."
							: "Create an account to get started with MergeLens."}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<Button variant="outline" className="w-full gap-2" onClick={handleGitHub}>
						<IconBrandGithub size={16} />
						Continue with GitHub
					</Button>

					<div className="relative flex items-center gap-3">
						<div className="flex-1 border-t" />
						<span className="text-xs text-muted-foreground">or</span>
						<div className="flex-1 border-t" />
					</div>

					<form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
						{mode === "signup" && (
							<Input
								placeholder="Full name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						)}
						<Input
							type="email"
							placeholder="Email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<Input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						{error && <p className="text-xs text-destructive">{error}</p>}
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Loading…" : mode === "signin" ? "Sign in" : "Create account"}
						</Button>
					</form>

					<p className="text-center text-xs text-muted-foreground">
						{mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
						<button type="button" className="underline underline-offset-4" onClick={toggleMode}>
							{mode === "signin" ? "Sign up" : "Sign in"}
						</button>
					</p>
				</CardContent>
			</Card>

			<p className="mt-6 text-xs text-muted-foreground">
				<Link href="/" className="underline-offset-4 hover:underline">
					Back to home
				</Link>
			</p>
		</div>
	);
}
