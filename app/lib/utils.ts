import type { CSSProperties } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Stagger index for .reveal-item / .reveal-cell children inside a <Reveal>.
export function stagger(i: number) {
  return { "--i": i } as CSSProperties
}
