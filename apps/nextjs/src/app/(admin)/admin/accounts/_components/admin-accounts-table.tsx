"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DataTable } from "@init/ui/data-table/data-table";
import { Form, FormControl, FormField, FormItem, useForm } from "@init/ui/form";
import { Input } from "@init/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@init/ui/select";
import { z } from "zod";

import type { GetAccountsInput } from "@init/api/admin/admin-schema";
import { useDataTable } from "@/hooks/use-data-table";
import { api } from "@/trpc/react";
import { getColumns } from "./admin-accounts-table-columns";

const FiltersSchema = z.object({
  type: z.enum(["all", "team", "personal"]),
  query: z.string().optional(),
});

export const AdminAccountsTable = (
  props: React.PropsWithChildren<{
    searchParams: GetAccountsInput;
  }>,
) => {
  const [data] = api.admin.getAccounts.useSuspenseQuery(props.searchParams);

  const columns = useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data: data.data,
    columns,
    pageCount: data.pageCount,
    // optional props
    defaultSort: "created_at.desc",
  });

  return (
    <div className="flex flex-col space-y-4">
      <AccountsTableFilters
        filters={{ type: props.searchParams.account_type ?? "all" }}
      />

      <DataTable table={table} />
    </div>
  );
};

const AccountsTableFilters = (props: {
  filters: z.infer<typeof FiltersSchema>;
}) => {
  const form = useForm({
    schema: FiltersSchema,
    defaultValues: {
      type: props.filters.type,
      query: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const router = useRouter();
  const pathName = usePathname();

  const onSubmit = ({ type, query }: z.infer<typeof FiltersSchema>) => {
    const params = new URLSearchParams({
      account_type: type,
      query: query ?? "",
    });

    const url = `${pathName}?${params.toString()}`;

    router.push(url);
  };

  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex space-x-4">
        <Form {...form}>
          <form
            className="flex space-x-4"
            onSubmit={form.handleSubmit((data) => onSubmit(data))}
          >
            <Select
              value={form.watch("type")}
              onValueChange={(value) => {
                form.setValue(
                  "type",
                  value as z.infer<typeof FiltersSchema>["type"],
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  },
                );

                return onSubmit(form.getValues());
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Account Type</SelectLabel>

                  <SelectItem value="all">All accounts</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <FormField
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="w-full min-w-36 md:min-w-72">
                    <Input
                      className="w-full"
                      placeholder="Search account..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};
