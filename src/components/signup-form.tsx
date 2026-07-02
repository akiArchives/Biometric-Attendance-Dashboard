"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signup } from "@/app/(login)/actions"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const result = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setPending(false)
    } else {
      setMessage(result.message || "Account created successfully!")
      setPending(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-md">
        <CardHeader className="py-3 text-center">
          <CardTitle className="text-xl font-bold">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-2">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field className="gap-3">
                <FieldLabel className="text-sm" htmlFor="name">Full Name</FieldLabel>
                <Input className="shadow-xs h-9 px-3 rounded-md" id="name" name="name" type="text" placeholder="John Doe" required />
              </Field>
              <Field className="gap-3">
                <FieldLabel className="text-sm" htmlFor="email">Email</FieldLabel>
                <Input
                  className="shadow-xs h-9 px-3 rounded-md"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field className="gap-3">
                <Field className="grid grid-cols-2 gap-4">
                  <Field className="gap-3">
                    <FieldLabel className="text-sm" htmlFor="password">Password</FieldLabel>
                    <Input className="shadow-xs h-9 px-3 rounded-md" id="password" name="password" type="password" required />
                  </Field>
                  <Field className="gap-3">
                    <FieldLabel className="text-sm" htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input className="shadow-xs h-9 px-3 rounded-md" id="confirm-password" name="confirm-password" type="password" required />
                  </Field>
                </Field>
                <FieldDescription className="text-sm">
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              {error && (
                <p className="text-sm text-red-500 text-center font-medium mt-1">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm text-emerald-600 text-center font-medium mt-1">
                  {message}
                </p>
              )}
              <Field className="gap-3">
                <Button type="submit" disabled={pending} className="shadow-sm rounded-full h-10 mt-2 border-none">
                  {pending ? "Creating Account..." : "Create Account"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="py-4">
          <FieldDescription className="w-full text-center">
            Already have an account? <a href="/sign-in">Sign in</a>
          </FieldDescription>
        </CardFooter>
      </Card>
    </div>
  )
}
