"use client";
import MeeriLogo from '@/components/MeeriLogo';
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { navLinks } from "@/lib/constants";

const TopBar = () => {
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setDropdownMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-custom-beige sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 shadow-xl lg:hidden">
            <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                <MeeriLogo />
            </Link>

            <div className="flex gap-8 max-md:hidden">
                {navLinks.map((link) => (
                    <Link
                        href={link.url}
                        key={link.label}
                        className={`flex gap-4 text-body-medium ${pathname === link.url ? "text-blue-1" : "text-grey-1"}`}
                    >
                        <p>{link.label}</p>
                    </Link>
                ))}
            </div>

            <div className="relative flex gap-4 items-center" ref={menuRef}>
                <Menu
                    aria-label="Toggle Menu"
                    className="cursor-pointer md:hidden ease-in-out"
                    onClick={() => setDropdownMenu(!dropdownMenu)}
                />
                {dropdownMenu && (
                    <div className="absolute top-10 right-6 flex flex-col gap-8 p-5 bg-white shadow-xl rounded-lg">
                        {navLinks.map((link) => (
                            <Link
                                href={link.url}
                                key={link.label}
                                className="flex gap-4 text-body-medium"
                            >
                                {link.icon} <p>{link.label}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopBar;
