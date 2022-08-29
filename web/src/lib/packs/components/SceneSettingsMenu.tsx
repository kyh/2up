import styled from "styled-components";
import { theme } from "styles/theme";
import { Button, Icon } from "components";
import { Props as ScenePreviewProps } from "lib/packs/components/ScenePreview";

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

const SceneSettingsMenuContainer = styled.div`
  text-align: center;

  .scene-setting {
    margin-bottom: ${theme.spacings(4)};
  }

  .scene-setting-button {
    display: block;
    margin: 0 auto ${theme.spacings(1)};
  }
`;
