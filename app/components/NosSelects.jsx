import React from "react";

import NosSelect from "./ui/NosSelect.jsx";

export default function Select() {
  return (
    <div className="relative box-border flex max-w-full flex-col flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Selects
      </span>

      <NosSelect
        theme="normal"
        required
        name="name"
        label="Default select"
        placeholder="Select..."
      >
        <option value="0">To be</option>
        <option value="1">Not to be</option>
      </NosSelect>
      <NosSelect
        theme="success"
        required
        name="name"
        placeholder="Select..."
        label="nes-select.is-success"
      >
        <option value="0">To be</option>
        <option value="1">Not to be</option>
      </NosSelect>
      <NosSelect
        theme="warning"
        required
        name="name"
        placeholder="Select..."
        label="nes-select.is-warning"
      >
        <option value="0">To be</option>
        <option value="1">Not to be</option>
      </NosSelect>
      <NosSelect
        theme="error"
        required
        name="name"
        placeholder="Select..."
        label="nes-select.is-error"
      >
        <option value="0">To be</option>
        <option value="1">Not to be</option>
      </NosSelect>
      <NosSelect
        theme="dark"
        required
        name="name"
        placeholder="Select..."
        label="nes-select.is-dark"
      >
        <option value="0">To be</option>
        <option value="1">Not to be</option>
      </NosSelect>
    </div>
  );
}
