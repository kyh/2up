"use client";

import { RadioGroup, RadioGroupItem } from "@init/ui/radio-group";
import { useTheme } from "@init/ui/theme";

export const AppearanceForm = () => {
  const { theme, setTheme } = useTheme();

  const onChange = (value: string) => {
    setTheme(value);
  };

  return (
    <form className="space-y-8">
      <div className="space-y-1">
        <RadioGroup
          onValueChange={onChange}
          defaultValue={theme}
          className="grid max-w-md grid-cols-2 gap-8 pt-2"
        >
          <div>
            <label className="[&:has([data-state=checked])>div]:border-primary">
              <RadioGroupItem value="system" className="sr-only" />
              <div className="flex items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                <div className="flex-1 space-y-2 rounded-sm bg-[#ecedef] py-2 pl-2">
                  <div className="space-y-2 rounded-md bg-white py-2 pl-2 shadow-sm">
                    <div className="h-2 w-full rounded-lg rounded-br-none rounded-tr-none bg-[#ecedef]" />
                    <div className="h-2 w-full rounded-lg rounded-br-none rounded-tr-none bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white py-2 pl-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[50px] flex-1 rounded-lg rounded-br-none rounded-tr-none bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white py-2 pl-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[50px] flex-1 rounded-lg rounded-br-none rounded-tr-none bg-[#ecedef]" />
                  </div>
                </div>
                <div className="flex-1 space-y-2 rounded-sm bg-slate-950 py-2 pr-2">
                  <div className="space-y-2 rounded-md bg-slate-800 py-2 pr-2 shadow-sm">
                    <div className="h-2 w-[40px] rounded-lg rounded-bl-none rounded-tl-none bg-slate-400" />
                    <div className="h-2 w-[50px] rounded-lg rounded-bl-none rounded-tl-none bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 py-2 pr-2 shadow-sm">
                    <div className="h-2 w-[50px] rounded-lg rounded-bl-none rounded-tl-none bg-slate-400" />
                    <div className="invisible h-4 w-4 rounded-full bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 py-2 pr-2 shadow-sm">
                    <div className="h-2 w-[50px] rounded-lg rounded-bl-none rounded-tl-none bg-slate-400" />
                    <div className="invisible h-4 w-4 rounded-full bg-slate-400" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                System
              </span>
            </label>
          </div>
          <div>
            <label className="[&:has([data-state=checked])>div]:border-primary">
              <RadioGroupItem value="light" className="sr-only" />
              <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                Light
              </span>
            </label>
          </div>
          <div>
            <label className="[&:has([data-state=checked])>div]:border-primary">
              <RadioGroupItem value="dark" className="sr-only" />
              <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                  <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                Dark
              </span>
            </label>
          </div>
        </RadioGroup>
      </div>
    </form>
  );
};
