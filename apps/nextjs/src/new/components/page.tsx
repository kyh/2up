import Avatars from "./NosAvatars";
import Badges from "./NosBadges";
import Balloons from "./NosBalloons";
import Buttons from "./NosButtons";
import Checkboxs from "./NosCheckboxs";
import Containers from "./NosContainers";
import Cursors from "./NosCursors";
import Dialogs from "./NosDialogs";
import Inputs from "./NosInputs";
import Lists from "./NosLists";
import Progress from "./NosProgress";
import Radios from "./NosRadios";
import Selects from "./NosSelects";
import Tables from "./NosTables";
import Textareas from "./NosTextareas";
import Texts from "./NosTexts";

export default function Home() {
  return (
    <div className="mx-auto mb-[10vh] flex w-full max-w-[1000px] flex-col flex-wrap gap-6 overflow-hidden bg-white p-4">
      <div className="m-5 box-border border-black p-10 text-center text-black">
        <h1 className="text-3xl">2up Components</h1>
      </div>
      <Texts />
      <Buttons />
      <Radios />
      <Checkboxs />
      <Inputs />
      <Textareas />
      <Selects />
      <Containers />
      <Dialogs />
      <Lists />
      <Tables />
      <Progress />
      <Avatars />
      <Balloons />
      <Cursors />
      <Badges />
    </div>
  );
}
