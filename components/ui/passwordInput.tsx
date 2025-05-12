"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function PasswordInput(props: React.ComponentProps<"input">) {
    const [show, setShow] = useState(false)

    return (
        <div className="relative">
            <Input
                {...props}
                type={show ? "text" : "password"}
                className={cn("pr-10", props.className)}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2"
                onClick={() => setShow((prev) => !prev)}
                tabIndex={-1}
            >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
        </div>
    )
}
