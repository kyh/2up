import { classed } from "~/utils/classed";
import { gql, useMutation, useQuery } from "~/utils/mock";
import { Modal, Uploader } from "~/components";

type AssetModalProps = {
  packId: string;
  onRequestClose: () => void;
  onSelectAsset: (path: string) => void;
};

export const PackAssetModal = ({
  packId,
  onRequestClose,
  onSelectAsset,
}: AssetModalProps) => {
  const { data, refetch } = useQuery(PACK_ASSET_QUERY, {
    variables: {
      packId: packId,
    },
  });
  const [packAssetCreate] = useMutation(PACK_ASSET_CREATE);

  const onUploaded = async (rawName: string, path: string) => {
    await packAssetCreate({
      variables: {
        input: { rawName, path, packId },
      },
    });
    await refetch();
  };

  const assetsMap = data?.pack?.assets;

  return (
    <Modal open title="Asset Library" onClose={onRequestClose} closeButton>
      <Uploader onUploaded={onUploaded} pathPrefix={`packs/${packId}`} />
      <AssetsContainer>
        {Object.values(assetsMap).map((asset: any) => {
          const fullPath = `${process.env.NEXT_PUBLIC_ASSET_URL}/${
            asset.path ?? ""
          }`;
          return (
            <button key={asset.id} onClick={() => onSelectAsset(fullPath)}>
              <img className="max-w-full" src={fullPath} alt={asset.rawName} />
            </button>
          );
        })}
      </AssetsContainer>
    </Modal>
  );
};

const PACK_ASSET_QUERY = gql`
  query PackAssetModalPackQuery($packId: ID!) {
    pack(id: $packId) {
      assets(first: 50) {
        edges {
          node {
            id
            rawName
            path
          }
        }
      }
    }
  }
`;

const PACK_ASSET_CREATE = gql`
  mutation PackAssetCreateMutation($input: PackAssetCreateInput!) {
    packAssetCreate(input: $input) {
      packAsset {
        id
      }
    }
  }
`;

const AssetsContainer = classed.div("grid grid-cols-3 gap-3 mt-3");
