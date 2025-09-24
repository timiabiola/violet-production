import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-900 group-[.toaster]:text-white group-[.toaster]:border-slate-800 group-[.toaster]:shadow-xl",
          description: "group-[.toast]:text-gray-300",
          actionButton:
            "group-[.toast]:bg-violet-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-gray-300",
          error: "group-[.toaster]:bg-red-950 group-[.toaster]:text-white group-[.toaster]:border-red-700 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-red-900/50",
          success: "group-[.toaster]:bg-green-900 group-[.toaster]:text-white group-[.toaster]:border-green-800",
        },
        style: {
          fontSize: '16px',
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
