import type { ReactNode, MouseEvent } from "react"

export interface ButtonProps {
    children: ReactNode
    variant?: 'primary' | 'outline' | 'smooth' | 'warning' | 'warningSmooth' | 'light' | 'closeX'
    type?: "button" | "submit" | "reset"
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    className?: string
    disabled?: boolean
    tabIndex?: number
    autoFocus?: boolean
    isActive?: boolean
    size?: 'sm' | 'md' | 'lg'  // Nueva prop para tamaños
    fullWidth?: boolean         // Nueva prop para ancho completo
    loading?: boolean          // Nueva prop para estado de carga
}
