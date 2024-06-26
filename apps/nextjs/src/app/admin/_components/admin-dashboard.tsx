import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@init/ui/card";

import { api } from "@/trpc/server";

export async function AdminDashboard() {
  const data = await api.admin.getDashboardData();

  return (
    <div
      className={
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" +
        " xl:grid-cols-4"
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>

          <CardDescription>
            The number of personal accounts that have been created.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className={"flex justify-between"}>
            <Figure>{data.accounts}</Figure>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Accounts</CardTitle>

          <CardDescription>
            The number of team accounts that have been created.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className={"flex justify-between"}>
            <Figure>{data.teamAccounts}</Figure>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paying Customers</CardTitle>
          <CardDescription>
            The number of paying customers with active subscriptions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className={"flex justify-between"}>
            <Figure>{data.subscriptions}</Figure>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trials</CardTitle>

          <CardDescription>
            The number of trial subscriptions currently active.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className={"flex justify-between"}>
            <Figure>{data.trials}</Figure>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Figure(props: React.PropsWithChildren) {
  return <div className={"text-3xl font-bold"}>{props.children}</div>;
}
