import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import { Button, TextField, AreaField, TagInput, Field } from "components";

import { PackFragment } from "../__generated__/PackFragment";

export type PackFormInputs = Omit<PackFragment, "id" | "__typename"> & {
  tags: string[];
};

type Props = {
  submitText?: string;
  loading?: boolean;
  defaultValues?: Record<string, any>;
  onSubmit: (pack: PackFormInputs) => void;
};

export const PackForm = ({
  submitText = "Create Pack",
  loading = false,
  defaultValues = {},
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
      <Field>
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
      </Field>
      <Button className="submit" type="submit" disabled={loading}>
        {submitText}
      </Button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;

  input,
  textarea {
    width: 100%;
  }

  button {
    margin: 0 auto;
  }
`;
