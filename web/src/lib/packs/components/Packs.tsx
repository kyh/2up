import { classed, deriveClassed, ComponentProps } from "@tw-classed/react";
import { Link, Button, ButtonLinkNative, Icon } from "~/components";
import { useHostGame } from "~/lib/game/useGameActions";
import { Pack as PackModel } from "@prisma/client";


export const PackItemsContainer = classed.div(
  "grid grid-cols-[repeat(auto-fit,_minmax(250px,_3fr))] gap-5", {
  variants: {
    variant: {
      staggered: "desktop:grid-cols-4",
      default: ""
    }
  },
  defaultVariants: {
    variant: "default"
  }
}
);

export const PackSection = classed.div({
  variants: {
    variant: {
      spaced: "mb-12",
      default: "mb-5"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export const PackSectionHeader = classed.header(
  "flex items-center capitalize", {
  variants: {
    variant: {
      mainHeader: "justify-center mb-8",
      default: "justify-between mb-6"
    }
  },
  defaultVariants: {
    variant: "default"
  }
}
);

export const PackCategoryLink = classed(
  Link,
  "inline-block after:inline-block after:content-['»'] after:ml-1 after:transition-transform after:duration-200",
  "after:ease-[ease] hover:after:translate-x-1"
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

const PackItem = classed.div(
  "group flex flex-col relative rounded-wavy min-h-[16rem] animate-[bounce-contract_1s] bg-white dark:bg-black border-2",
  "border-grey hover:animate-[bounce-expand_1s_forwards] hover:border-grey-dark dark:hover:border-grey-light",
  "active:animate-[bounce-contract_1s]", {
  variants: {
    variant: {
      staggered: "desktop:first:col-span-2 desktop:first:row-span-2",
      default: ""
    }
  },
  defaultVariants: {
    variant: "default"
  }
}
);

const PackItemPlay = classed.div(
  "hidden group-hover:block absolute right-5 bottom-5 animate-[fade-in_0.3s_ease_forwards]"
);

const PlayButton = classed(Button, "p-2 rounded-full bg-white dark:bg-black");

export type PacksProps = ComponentProps<typeof PackItem> & {
  pack: PackModel;
  containerClassName?: string;
  showPlayButton?: boolean;
  showEditButton?: boolean;
};

export const Pack = deriveClassed<typeof PackItem, PacksProps>(({
  pack,
  showPlayButton = true,
  showEditButton = false,
  ...rest
}, ref) => {
  const { hostGame, isLoading } = useHostGame();

  const play = () => {
    hostGame(pack.id);
  };

  return (
    <PackItem {...rest} ref={ref}>
      <Link className="block h-full p-5" href={`/packs/${pack.id}`}>
        <h2 className="mb-3 text-2xl font-bold">{pack.name}</h2>
        <p className="text-grey dark:text-grey-light">{pack.description}</p>
      </Link>
      {showPlayButton && (
        <PackItemPlay>
          <PlayButton className="rounded-full" variant="fab" onClick={play} disabled={isLoading}>
            <Icon icon="play" />
          </PlayButton>
        </PackItemPlay>
      )}
      {showEditButton && (
        <div className="absolute left-5 bottom-10">
          <ButtonLinkNative href={`/packs/${pack.id}/edit`}>
            Edit Pack
          </ButtonLinkNative>
        </div>
      )}
    </PackItem>
  );
});
