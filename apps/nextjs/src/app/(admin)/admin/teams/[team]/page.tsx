import { Alert, AlertDescription, AlertTitle } from "@init/ui/alert";
import { Badge } from "@init/ui/badge";
import { Button } from "@init/ui/button";
import { Heading } from "@init/ui/heading";
import { If } from "@init/ui/if";
import { ProfileAvatar } from "@init/ui/profile-avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@init/ui/table";
import { BadgeX, Ban, ShieldPlus, VenetianMask } from "lucide-react";

import type { RouterOutputs } from "@init/api";
import { api } from "@/trpc/server";
import { AdminBanUserDialog } from "../_components/admin-ban-user-dialog";
import { AdminDeleteAccountDialog } from "../_components/admin-delete-account-dialog";
import { AdminDeleteUserDialog } from "../_components/admin-delete-user-dialog";
import { AdminImpersonateUserDialog } from "../_components/admin-impersonate-user-dialog";
import { AdminMembersTable } from "../_components/admin-members-table";
import { AdminMembershipsTable } from "../_components/admin-memberships-table";
import { AdminReactivateUserDialog } from "../_components/admin-reactivate-user-dialog";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export const generateMetadata = async (props: Params) => {
  const params = await props.params;
  const account = await api.admin.getAccount({ accountId: params.id });

  return {
    title: `Admin | ${account.name}`,
  };
};

const Page = async (props: Params) => {
  const params = await props.params;
  const account = await api.admin.getAccount({ accountId: params.id });

  return (
    <main className="flex flex-1 flex-col px-5">
      <AdminAccountPage account={account} />
    </main>
  );
};

export default Page;

type Account = RouterOutputs["admin"]["getAccount"];

const AdminAccountPage = (props: { account: Account }) => {
  const isPersonalAccount = props.account.isPersonalAccount;

  if (isPersonalAccount) {
    return <PersonalAccountPage account={props.account} />;
  }

  return <TeamAccountPage account={props.account} />;
};

const PersonalAccountPage = async (props: { account: Account }) => {
  const memberships = await api.admin.getMemberships({
    userId: props.account.id,
  });
  const data = await api.admin.getUserById({
    accountId: props.account.id,
  });

  const isBanned =
    "banned_until" in data.user && data.user.banned_until !== "none";

  return (
    <div className="flex flex-col gap-4">
      <header className="flex h-20 md:h-24">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <ProfileAvatar
                pictureUrl={props.account.pictureUrl}
                displayName={props.account.name}
              />
              <span>{props.account.name}</span>
            </div>
            <Badge variant="outline">Personal Account</Badge>
            <If condition={isBanned}>
              <Badge variant="destructive">Banned</Badge>
            </If>
          </div>
          <div className="flex gap-1">
            <If condition={isBanned}>
              <AdminReactivateUserDialog userId={props.account.id}>
                <Button size="sm" variant="ghost">
                  <ShieldPlus className="mr-1 h-4" />
                  Reactivate
                </Button>
              </AdminReactivateUserDialog>
            </If>
            <If condition={!isBanned}>
              <AdminBanUserDialog userId={props.account.id}>
                <Button size="sm" variant="ghost">
                  <Ban className="mr-1 h-4" />
                  Ban
                </Button>
              </AdminBanUserDialog>
              <AdminImpersonateUserDialog userId={props.account.id}>
                <Button size="sm" variant="ghost">
                  <VenetianMask className="mr-1 h-4" />
                  Impersonate
                </Button>
              </AdminImpersonateUserDialog>
            </If>
            <AdminDeleteUserDialog userId={props.account.id}>
              <Button size="sm" variant="destructive">
                <BadgeX className="mr-1 h-4" />
                Delete
              </Button>
            </AdminDeleteUserDialog>
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-8">
        <SubscriptionsTable accountId={props.account.id} />
        <div className="divider-divider-x flex flex-col gap-2.5">
          <Heading className="font-bold" level={5}>
            Teams
          </Heading>
          <div>
            <AdminMembershipsTable memberships={memberships} />
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamAccountPage = async (props: { account: Account }) => {
  const members = await api.admin.getMembers({
    accountSlug: props.account.slug ?? "",
  });

  return (
    <div className="flex flex-col gap-4">
      <header className="flex h-20 md:h-24">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <ProfileAvatar
                pictureUrl={props.account.pictureUrl}
                displayName={props.account.name}
              />

              <span>{props.account.name}</span>
            </div>

            <Badge variant="outline">Team Account</Badge>
          </div>

          <AdminDeleteAccountDialog accountId={props.account.id}>
            <Button size="sm" variant="destructive">
              <BadgeX className="mr-1 h-4" />
              Delete
            </Button>
          </AdminDeleteAccountDialog>
        </div>
      </header>

      <div>
        <div className="flex flex-col gap-8">
          <SubscriptionsTable accountId={props.account.id} />

          <div className="flex flex-col gap-2.5">
            <Heading className="font-bold" level={5}>
              Team Members
            </Heading>

            <AdminMembersTable members={members} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionsTable = async (props: { accountId: string }) => {
  const subscription = await api.admin.getSubscription({
    accountId: props.accountId,
  });

  return (
    <div className="flex flex-col gap-2.5">
      <Heading className="font-bold" level={5}>
        Subscription
      </Heading>
      <If
        condition={subscription}
        fallback={
          <Alert>
            <AlertTitle>No subscription found for this account.</AlertTitle>
            <AlertDescription>
              This account does not have a subscription.
            </AlertDescription>
          </Alert>
        }
      >
        {(subscription) => {
          return (
            <div className="flex flex-col gap-4">
              <Table>
                <TableHeader>
                  <TableHead>Subscription ID</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Period Starts At</TableHead>
                  <TableHead>Ends At</TableHead>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <span>{subscription.id}</span>
                    </TableCell>
                    <TableCell>
                      <span>{subscription.billingProvider}</span>
                    </TableCell>
                    <TableCell>
                      <span>{subscription.billingCustomerId}</span>
                    </TableCell>
                    <TableCell>
                      <span>{subscription.status}</span>
                    </TableCell>
                    <TableCell>
                      <span>{subscription.createdAt}</span>
                    </TableCell>
                    <TableCell>
                      <span>{subscription.periodStartsAt}</span>
                    </TableCell>
                    <TableCell>
                      <span>{subscription.periodEndsAt}</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Table>
                <TableHeader>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Variant ID</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Type</TableHead>
                </TableHeader>
                <TableBody>
                  {subscription.subscriptionItems.map((item) => {
                    return (
                      <TableRow key={item.variantId}>
                        <TableCell>
                          <span>{item.productId}</span>
                        </TableCell>
                        <TableCell>
                          <span>{item.variantId}</span>
                        </TableCell>
                        <TableCell>
                          <span>{item.quantity}</span>
                        </TableCell>
                        <TableCell>
                          <span>{item.priceAmount}</span>
                        </TableCell>
                        <TableCell>
                          <span>{item.interval}</span>
                        </TableCell>
                        <TableCell>
                          <span>{item.type}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          );
        }}
      </If>
    </div>
  );
};
