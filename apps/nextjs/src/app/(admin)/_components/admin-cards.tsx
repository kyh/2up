"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@init/ui/card";

import { api } from "@/trpc/react";

export const DashboardCard = ({
  title,
  description,
  figure,
}: {
  title: string;
  description: string;
  figure: number;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div className="text-3xl font-bold">{figure}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AccountsCard = () => {
  const [{ accounts }] = api.admin.getDashboardData.useSuspenseQuery();

  if (!accounts) {
    return null;
  }

  return (
    <DashboardCard
      title="Users"
      description="The number of personal accounts that have been created."
      figure={accounts}
    />
  );
};

export const TeamAccountsCard = () => {
  const [{ teamAccounts }] = api.admin.getDashboardData.useSuspenseQuery();

  if (!teamAccounts) {
    return null;
  }

  return (
    <DashboardCard
      title="Team Accounts"
      description="The number of team accounts that have been created."
      figure={teamAccounts}
    />
  );
};

export const PayingCustomersCard = () => {
  const [{ subscriptions }] = api.admin.getDashboardData.useSuspenseQuery();

  if (!subscriptions) {
    return null;
  }

  return (
    <DashboardCard
      title="Paying Customers"
      description="The number of paying customers with active subscriptions."
      figure={subscriptions}
    />
  );
};

export const TrialsCard = () => {
  const [{ trials }] = api.admin.getDashboardData.useSuspenseQuery();

  if (!trials) {
    return null;
  }

  return (
    <DashboardCard
      title="Trails"
      description="The number of trial subscriptions currently active."
      figure={trials}
    />
  );
};
