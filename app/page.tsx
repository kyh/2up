import Avatars from "./components/NosAvatars";
import Badges from "./components/NosBadges";
import Balloons from "./components/NosBalloons";
import Buttons from "./components/NosButtons";
import Checkboxs from "./components/NosCheckboxs";
import Containers from "./components/NosContainers";
import Cursors from "./components/NosCursors";
import Dialogs from "./components/NosDialogs";
import Inputs from "./components/NosInputs";
import Lists from "./components/NosLists";
import Progress from "./components/NosProgress";
import Radios from "./components/NosRadios";
import Selects from "./components/NosSelects";
import Tables from "./components/NosTables";
import Textareas from "./components/NosTextareas";
import Texts from "./components/NosTexts";

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
