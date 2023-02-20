import { classed } from "@tw-classed/react";
import { useForm, Controller } from "react-hook-form";
import { Button, TextField, AreaField, TagInput } from "~/components";

const defaultPackValues = {
  name: "",
  description: "",
  isRandom: true,
  gameLength: 10,
  tags: [] as string[],
};

export type PackFormInputs = typeof defaultPackValues;

type Props = {
  submitText?: string;
  loading?: boolean;
  defaultValues?: PackFormInputs;
  onSubmit: (pack: PackFormInputs) => void;
};

export const PackForm = ({
  submitText = "Create Pack",
  loading = false,
  defaultValues = defaultPackValues,
  onSubmit,
}: Props) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PackFormInputs>({
    defaultValues,
  });
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        labelText="Pack Name"
        id="name"
        {...register("name", { required: true })}
        placeholder="Who's that Pokemon?"
        error={!!errors.name}
        errorText="Pack name is required"
      />
      <AreaField
        labelText="Description"
        id="description"
        {...register("description", { required: true })}
        placeholder="The popular question-and-answer segment that is featured in numerous episodes of the Pokémon anime"
        error={!!errors.description}
        errorText="A short description is required"
      />
      <fieldset>
        <label htmlFor="tags">Tags</label>
        <Controller
          name="tags"
          control={control}
          defaultValue={defaultValues.tags || []}
          render={({ field: { onChange, value } }) => (
            <TagInput
              id="tags"
              placeholder="pokemon, fun"
              onTagChange={onChange}
              defaultTags={value}
            />
          )}
        />
      </fieldset>
      <Button className="submit" type="submit" disabled={loading}>
        {submitText}
      </Button>
    </Form>
  );
};

const Form = classed.form("flex flex-col [&_input]:w-full [&_textarea]:w-full [&_button]:mx-auto [&_button]:my-0 space-y-3");
