import type { ButtonProps } from "@/types"
import { forwardRef } from 'react'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    onClick,
    className = "",
    variant = 'primary',
    type = 'button',
    disabled = false,
    isActive = false,
    size = 'md',
    fullWidth = false,
    loading = false,
    tabIndex,
    autoFocus,
}, ref) => {
    const baseStyles =
        "inline-flex items-center justify-center gap-2 border rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"

    const variants = {
        primary: "bg-blue-600 text-white border-transparent hover:bg-blue-800 focus:ring-blue-500 disabled:bg-gray-400",
        outline: "bg-transparent text-blue-600 border-blue-600 hover:bg-blue-100 focus:ring-blue-500",
        smooth: "bg-blue-50 text-blue-600 border-transparent hover:bg-blue-200 focus:ring-blue-500",
        warning: "bg-red-500 text-white border-transparent hover:bg-red-700 focus:ring-red-500",
        warningSmooth: "bg-red-100 text-red-700 border-transparent hover:bg-red-200 focus:ring-red-500",
        light: "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 focus:ring-blue-500",
        closeX: "text-gray-500 border-transparent rounded-lg hover:bg-gray-100"
    }

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2.5 text-base",
        lg: "px-6 py-3 text-lg"
    }

    const widthClass = fullWidth ? "w-full" : ""
    const activeClass = isActive ? "ring-2 ring-offset-2" : ""

    return (
        <button
            ref={ref}
            type={type}
            onClick={onClick}
            className={`
                ${baseStyles} 
                ${variants[variant]} 
                ${sizes[size]}
                ${widthClass}
                ${activeClass}
                ${className}
            `.trim()}
            disabled={disabled || loading}
            tabIndex={tabIndex}
            autoFocus={autoFocus}
        >
            {loading ? (
                <>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    <span>Cargando...</span>
                </>
            ) : (
                children
            )}
        </button>
    )
})

Button.displayName = 'Button'

export default Button