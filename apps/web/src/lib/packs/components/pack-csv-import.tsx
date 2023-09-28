import { useState, ChangeEvent } from "react";
import { classed } from "~/utils/classed";
import { gql, useMutation } from "~/utils/mock";
import { Modal, Button, AreaField, useAlert } from "~/components";
import { scenesToCsv, fileToCsv } from "~/lib/packs/pack-utils";
import { getErrorMessage } from "~/utils/error";

type CsvImportButtonProps = {
  packId: string;
  scenes: any[];
  refetch: () => void;
};

export const CsvImportButton = ({
  packId,
  scenes,
  refetch,
}: CsvImportButtonProps) => {
  const alert = useAlert();
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [csv, setCsv] = useState(scenesToCsv(scenes));
  const [csvImport] = useMutation(CSV_IMPORT);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCsv(e.target.value);
  };

  const handleCsvInput = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const [file] = Array.from(e.target.files);
      const csv = await fileToCsv(file);
      setCsv(csv);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await csvImport({
        variables: {
          input: { packId, csv },
        },
      });
      await refetch();
    } catch (error) {
      alert.show(getErrorMessage(error));
    } finally {
      setIsSaving(false);
      setIsOpen(false);
    }
  };

  return (
    <CsvImportButtonContainer>
      {/* modal-button */}
      <button
        className="text-[0.9rem] underline"
        onClick={() => setIsOpen(true)}
      >
        CSV Import
      </button>
      <Modal
        title="Your pack as a CSV"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        closeButton
      >
        <CsvImportHeader>
          <input type="file" accept=".csv" onChange={handleCsvInput} />
          <a
            href="https://docs.google.com/spreadsheets/d/1OQHLadGoh3hzkZ_J4SfZ1kJ_f7C4YfV7YSGrqZ9wYC4/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Example CSV
          </a>
        </CsvImportHeader>
        <CsvImportArea onChange={handleChange} value={csv} />
        <CsvImportFooter>
          <Button
            className="ml-auto"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            Update Pack
          </Button>
        </CsvImportFooter>
      </Modal>
    </CsvImportButtonContainer>
  );
};

const CSV_IMPORT = gql`
  mutation CsvImportMutation($input: CsvImportInput!) {
    csvImport(input: $input) {
      pack {
        id
        name
      }
    }
  }
`;

const CsvImportButtonContainer = classed.div("text-center mt-1");

const CsvImportHeader = classed.header("flex justify-between");

const CsvImportArea = classed(AreaField, "h-[300px] mt-1 mb-3");

const CsvImportFooter = classed.footer("flex");
