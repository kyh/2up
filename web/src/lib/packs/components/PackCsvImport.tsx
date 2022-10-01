import { useState, ChangeEvent } from "react";
import styled from "styled-components";
import { gql, useMutation } from "~/utils/mock";
import { theme } from "~/styles/theme";
import { Modal, Button, AreaField, useAlert } from "~/components";
import { scenesToCsv, fileToCsv } from "~/lib/packs/packUtils";

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
    } catch (error: any) {
      alert.show(error.message);
    } finally {
      setIsSaving(false);
      setIsOpen(false);
    }
  };

  return (
    <CsvImportButtonContainer>
      <button className="modal-button" onClick={() => setIsOpen(true)}>
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
          >
            Example CSV
          </a>
        </CsvImportHeader>
        <CsvImportArea onChange={handleChange} value={csv} />
        <CsvImportFooter>
          <Button onClick={handleSubmit} disabled={isSaving}>
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

const CsvImportButtonContainer = styled.div`
  text-align: center;
  margin-top: ${theme.spacings(1)};

  > .modal-button {
    font-size: 0.9rem;
    text-decoration: underline;
  }
`;

const CsvImportHeader = styled.header`
  display: flex;
  justify-content: space-between;

  a {
    text-decoration: underline;
  }
`;

const CsvImportArea = styled(AreaField)`
  width: 100%;
  min-height: 300px;
`;

const CsvImportFooter = styled.footer`
  display: flex;

  > button {
    margin-left: auto;
  }
`;
