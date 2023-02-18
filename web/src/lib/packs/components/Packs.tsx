import { classed } from "@tw-classed/react";
import { Link, Button, ButtonLinkNative, Icon } from "~/components";
import { useHostGame } from "~/lib/game/useGameActions";
import { Pack as PackModel } from "@prisma/client";

<div className="[&_.pack-item_.pack-item-play_button]:bottom-5"></div>

export const PackSection = classed.section(
  "[&_.pack-items]:grid [&_.pack-items]:grid-cols-[repeat(auto-fit,_minmax(250px,_3fr))] [&_.pack-items]:gap-5",
  "desktop:[&_.pack-items.staggered-pack-items]:grid-cols-4",
  "desktop:[&_.pack-items.staggered-pack-items_.pack-item]:first:col-span-2",
  "desktop:[&_.pack-items.staggered-pack-items_.pack-item]:first:row-span-2",
  "[&_.pack-section]:mb-5 [&_.pack-section.spaced]:mb-12",
  "[&_.pack-section-header]:flex [&_.pack-section-header]:justify-between [&_.pack-section-header]:items-center",
  "[&_.pack-section-header]:capitalize [&_.pack-section-header]:mb-6",
  "[&_.pack-section-header.main-header]:justify-center [&_.pack-section-header.main-header]:mb-8",
  "[&_.pack-section-header.mb]:mb-8 [&_.pack-section-header_h1]:m-0 [&_.pack-section-header_h2]:m-0",
  "[&_.pack-section-header.category-link]:inline-block [&_.pack-section-header.category-link]:after:inline-block",
  "[&_.pack-section-header.category-link]:after:content-['-'] [&_.pack-section-header.category-link]:after:ml-1",
  "[&_.pack-section-header.category-link]:after:transition-transform [&_.pack-section-header.category-link]:after:duration-200",
  "[&_.pack-section-header.category-link]:after:ease-[ease] [&_.pack-section-header.category-link]:hover:after:translate-x-1",
  "[&_.pack-item]:flex [&_.pack-item]:flex-col [&_.pack-item]:relative [&_.pack-item]:rounded-wavy [&_.pack-item]:min-h-[16rem]",
  "[&_.pack-item]:animate-[bounce-contract_1s] [&_.pack-item]:bg-white dark:[&_.pack-item]:bg-black [&_.pack-item]:border-2",
  "[&_.pack-item]:border-grey [&_.pack-item]:hover:animate-[bounce-expand_1s_forwards]",
  "[&_.pack-item]:hover:border-grey-dark dark:[&_.pack-item]:hover:border-grey-light",
  "[&_.pack-item_.pack-item-play]:hover:block [&_.pack-item]:active:animate-[bounce-contract_1s]",
  "[&_.pack-item_.pack-item-link]:block [&_.pack-item_.pack-item-link]:h-full [&_.pack-item_.pack-item-link]:p-5",
  "[&_.pack-item_.pack-item-title]:mb-3 [&_.pack-item_.pack-item-description]:text-grey dark:[&_.pack-item_.pack-item-description]:text-grey-light",
  "[&_.pack-item_.pack-item-play]:hidden [&_.pack-item_.pack-item-play]:absolute [&_.pack-item_.pack-item-play]:right-5",
  "[&_.pack-item_.pack-item-play]:bottom-5 [&_.pack-item_.pack-item-play]:animate-[fade-in_0.3s_ease_forwards]",
  "[&_.pack-item_.pack-item-play_button]:padding-2 [&_.pack-item_.pack-item-play_button]:rounded-full",
  "[&_.pack-item_.pack-item-play_button]:bg-white dark:[&_.pack-item_.pack-item-play_button]:bg-black",
  "[&_.pack-item_.pack-item-edit]:absolute [&_.pack-item_.pack-item-edit]:left-5 [&_.pack-item_.pack-item-edit]:bottom-10",
);

export const PackImage = classed.div(
  "w-full h-40 bg-[#bcc7ff] bg-cover mx-auto mb-2", {
  variants: {
    src: {
      "true": "bg-[var(--packgBgSource)]",
      "false": "bg-none"
    }
  },
  defaultVariants: {
    src: "false"
  }
}
);

export type PacksProps = {
  pack: PackModel;
  className?: string;
  containerClassName?: string;
  showPlayButton?: boolean;
  showEditButton?: boolean;
};

export const Pack = ({
  pack,
  className = "",
  showPlayButton = true,
  showEditButton = false,
}: PacksProps) => {
  const { hostGame, isLoading } = useHostGame();

  const play = () => {
    hostGame(pack.id);
  };

  return (
    <div className={`pack-item ${className}`}>
      <Link className="pack-item-link" href={`/packs/${pack.id}`}>
        <h2 className="pack-item-title">{pack.name}</h2>
        <p className="pack-item-description">{pack.description}</p>
      </Link>
      {showPlayButton && (
        <div className="pack-item-play">
          <Button className="rounded-full" variant="fab" onClick={play} disabled={isLoading}>
            <Icon icon="play" />
          </Button>
        </div>
      )}
      {showEditButton && (
        <div className="pack-item-edit">
          <ButtonLinkNative href={`/packs/${pack.id}/edit`}>
            Edit Pack
          </ButtonLinkNative>
        </div>
      )}
    </div>
  );
};
