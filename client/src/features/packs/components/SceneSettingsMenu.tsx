import styled from "styled-components";
import { theme } from "styles/theme";
import { Button, Icon } from "components";
import { Props as ScenePreviewProps } from "features/packs/components/ScenePreview";

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
    </SceneSettingsMenuContainer>
  );
};

const SceneSettingsMenuContainer = styled.div`
  text-align: center;

  .scene-setting {
    margin-bottom: ${theme.spacings(3)};
  }

  .scene-setting-button {
    display: block;
    margin: 0 auto ${theme.spacings(1)};
  }
`;
