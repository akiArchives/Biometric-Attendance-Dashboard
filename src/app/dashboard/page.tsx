import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarCheck2,
  UserRoundX,
  ClockAlert,
  Users,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="w-full h-full pb-10 mt-5 px-4 flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="ml-3 flex flex-row items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-700">
            Dashboard
          </h1>
          <Separator orientation="vertical" />
          <p className="text-sm text-gray-400">Example</p>
        </div>
      </div>

      {/* Card Rows */}
      <div className="flex flex-row gap-6 w-full">
        {/*Present*/}
        <Card className="rounded-md w-full">
          <CardHeader className=" text-gray-600">
            <CardTitle className="text-sm font-semibold">
              Present Today
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              90% are present today
            </CardDescription>
            <CardAction className="w-10 h-full">
              <Button
                variant="outline"
                className="bg-green-600 w-full h-full text-primary-foreground hover:bg-green-600/80 hover:text-primary-foreground"
              >
                <CalendarCheck2 strokeWidth={2} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="">
            <p className="font-bold text-3xl text-gray-700">2</p>
          </CardContent>
        </Card>

        {/* Absent */}
        <Card className="rounded-md w-full">
          <CardHeader className=" text-gray-600">
            <CardTitle className="text-sm font-semibold">
              Absent Today
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              10% are absent today
            </CardDescription>
            <CardAction className="w-10 h-full">
              <Button
                variant="outline"
                className="bg-red-600 w-full h-full text-primary-foreground hover:bg-red-600/80 hover:text-primary-foreground"
              >
                <UserRoundX strokeWidth={2.5} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="">
            <p className="font-bold text-3xl text-gray-700">2</p>
          </CardContent>
        </Card>

        {/*Late*/}
        <Card className="rounded-md w-full">
          <CardHeader className=" text-gray-600">
            <CardTitle className="text-sm font-semibold">Late Today</CardTitle>
            <CardDescription className="text-xs text-gray-500">
              5% are late today
            </CardDescription>
            <CardAction className="w-10 h-full">
              <Button
                variant="outline"
                className="bg-amber-500 w-full h-full text-primary-foreground hover:bg-amber-500/80 hover:text-primary-foreground"
              >
                <ClockAlert strokeWidth={2.5} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="">
            <p className="font-bold text-3xl text-gray-700">1</p>
          </CardContent>
        </Card>

        <Card className="rounded-md w-full">
          <CardHeader className=" text-gray-600">
            <CardTitle className="text-sm font-semibold">
              Total Employees
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Number of active employees
            </CardDescription>
            <CardAction className="w-10 h-full">
              <Button
                variant="outline"
                className="bg-primary w-full h-full text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
              >
                <Users strokeWidth={2.5} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="">
            <p className="font-bold text-3xl text-gray-700">16</p>
          </CardContent>
        </Card>
      </div>

      {/* BIG CARD*/}
      <Card className="rounded-md flex-1">
        <CardHeader className=" text-gray-600">
          <CardTitle className="text-sm font-semibold"></CardTitle>
          <CardDescription className="text-xs text-gray-500"></CardDescription>
        </CardHeader>
        <CardContent className=""></CardContent>
      </Card>
    </div>
  );
}
