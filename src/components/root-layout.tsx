import type { ReactNode } from "react";

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return <main className="px-4">{children}</main>;
}
