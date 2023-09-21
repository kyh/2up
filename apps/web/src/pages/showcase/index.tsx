import React from "react";
import {
  ButtonV2,
  CardV2,
  Tile,
  TextFieldV2,
  AvatarV2,
  AlertV2,
} from "~/components";

const Showcase = () => {
  const [show, setShow]: any = React.useState(true);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className="my-3  px-8">
      <h1 className="pl-3 mb-2 font-sans">Tiles</h1>

      <CardV2 background="grey-dark"></CardV2>
      <CardV2></CardV2>

      <CardV2>
        <CardV2 className="mb-[0px] mx-[0px]"></CardV2>
      </CardV2>
      <CardV2></CardV2>

      <br></br>
      <h1 className="pl-3 mb-2 font-sans">Buttons and Inputs </h1>
      <CardV2 size="large" variant="gray" className=" py-2">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 border-4 rounded-lg"
          style={{ borderStyle: "dotted; border-width: 2px;" }}
        >
          PLAY
        </button>

        <ButtonV2 variant="primary" size="small">
          Button
        </ButtonV2>
        <br></br>
        <ButtonV2 variant="secondary" size="small">
          Button
        </ButtonV2>
        <br></br>
        <TextFieldV2 type={"text"} placeholder={"Search"}></TextFieldV2>
      </CardV2>
      <h1 className="pl-4 mb-2 font-sans">Alert</h1>
      <div className="px-2">
        <AlertV2
          className="drop-shadow-[12px 0 red,
          -12px 0 red,
          0 -12px red,
          0 12px red,
          24px 0 white,
          -24px 0 white,
          0 -24px white,
          0 24px white,
          0 0 0 12.5px white,
          36px 0 black,
          0 36px black,
          0 12px 0 12px black,
          12px 0 0 12px black,
          -12px 0 0 12px black]"
          variant={"warning"}
          show={show}
          handleClose={() => handleClose()}
        >
          Hello Alert
        </AlertV2>
        <br></br>
        <AlertV2
          variant={"error"}
          show={show}
          handleClose={() => handleClose()}
        >
          Hello Alert
        </AlertV2>
        <br></br>
        <AlertV2
          className=""
          variant={"information"}
          show={show}
          handleClose={() => handleClose()}
        >
          Hello Alert
        </AlertV2>
        <br></br>
        <AlertV2
          variant={"success"}
          show={show}
          handleClose={() => handleClose()}
        >
          Hello Alert
        </AlertV2>
      </div>
      <br></br>
      <h1 className="pl-4 mb-2 font-sans">Avatar</h1>
      <div className="flex items-center gap-10 pl-3">
        <div className="flex items-center gap-2">
          <AvatarV2 variant={"warning"} size="large">
            {" "}
            As{" "}
          </AvatarV2>
          <AvatarV2 variant={"warning"} size="small">
            {" "}
            As{" "}
          </AvatarV2>
        </div>

        <div className="flex items-center gap-2">
          <AvatarV2 variant={"information"} size="large">
            {" "}
            As{" "}
          </AvatarV2>
          <AvatarV2 variant={"information"} size="small">
            {" "}
            As{" "}
          </AvatarV2>
        </div>

        <div className="flex items-center gap-2">
          <AvatarV2 variant={"error"} size="large">
            {" "}
            As{" "}
          </AvatarV2>
          <AvatarV2 variant={"error"} size="small">
            {" "}
            As{" "}
          </AvatarV2>
        </div>

        <div className="flex items-center gap-2">
          <AvatarV2 variant={"success"} size="large">
            {" "}
            As{" "}
          </AvatarV2>
          <AvatarV2 variant={"success"} size="small">
            {" "}
            As{" "}
          </AvatarV2>
        </div>
        <div className="flex items-center gap-2">
          <AvatarV2 variant={"info"} size="large">
            {" "}
            As{" "}
          </AvatarV2>
          <AvatarV2 variant={"info"} size="small">
            {" "}
            As{" "}
          </AvatarV2>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
