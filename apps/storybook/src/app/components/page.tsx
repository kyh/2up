import Avatars from "./avatars";
import Badges from "./badges";
import Balloons from "./balloons";
import Buttons from "./buttons";
import Checkboxs from "./checkboxs";
import Containers from "./containers";
import Cursors from "./cursors";
import Dialogs from "./dialogs";
import Inputs from "./inputs";
import Lists from "./lists";
import Progress from "./progress";
import Radios from "./radios";
import Selects from "./selects";
import Tables from "./tables";
import Textareas from "./textareas";
import Texts from "./texts";

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
