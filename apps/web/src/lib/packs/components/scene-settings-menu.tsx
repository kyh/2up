import { classed } from "@/lib/utils/classed";
import { Button, Icon } from "@/components";
import { Props as ScenePreviewProps } from "@/lib/packs/components/scene-preview";

export const SceneSettingsMenu = ({ scene }: ScenePreviewProps) => {
  return (
    <SceneSettingsMenuContainer>
      <div className="scene-setting">
        <Button
          className="scene-setting-button"
          variant="fab"
          data-tip="Scene duration"
        >
          <Icon icon="time" />
        </Button>
        <div className="scene-setting-text">45s</div>
      </div>
      <div className="scene-setting">
        <Button
          className="scene-setting-button"
          variant="fab"
          data-tip="Scene answer description"
        >
          <Icon icon="list" />
        </Button>
        <div className="scene-setting-text">details</div>
      </div>
    </SceneSettingsMenuContainer>
  );
};

const SceneSettingsMenuContainer = classed.div(
  "text-center [&_.scene-setting]:mb-4 [&_.scene-setting-button]:block [&_.scene-setting-button]:mx-auto [&_.scene-setting-button]:mb-1",
);
