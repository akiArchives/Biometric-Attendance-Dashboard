"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { login } from "@/app/(login)/actions"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setPending(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-md">
        <CardHeader className="py-3 text-center">
          <CardTitle className="text-xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Login with your email and password
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-2">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="">
              <Field className="gap-3">
                <FieldLabel className="text-sm" htmlFor="email">Email</FieldLabel>
                <Input className="shadow-xs h-9 px-3 rounded-md"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field className="gap-3">
                <div className="flex items-center">
                  <FieldLabel className="text-sm" htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input className="shadow-xs h-9 px-3 rounded-md" id="password" name="password" type="password" required />
              </Field>
              {error && (
                <p className="text-sm text-red-500 text-center font-medium mt-1">
                  {error}
                </p>
              )}
              <Field className="gap-3">
                <Button type="submit" disabled={pending} className="shadow-sm rounded-full h-10 mt-2 border-none">
                  {pending ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="py-4">
          <FieldDescription className="w-full text-center">
            Don&apos;t have an account? <a href="/sign-up">Sign up</a>
          </FieldDescription>
        </CardFooter>
      </Card >
    </div >
  )
}
