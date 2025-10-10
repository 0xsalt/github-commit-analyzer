"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	// Avoid hydration mismatch by waiting for client-side mount
	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" disabled>
				<Sun className="h-5 w-5" />
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			aria-label="Toggle theme"
		>
			{theme === "dark" ? (
				<Sun className="h-5 w-5 transition-all" />
			) : (
				<Moon className="h-5 w-5 transition-all" />
			)}
		</Button>
	);
}
