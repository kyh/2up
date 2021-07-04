import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import styled from "styled-components";
import { theme } from "styles/theme";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

const parseCodeContent = (content: string) => {
  const defaultValue = { code: "", language: "javascript" };
  if (content) {
    try {
      return JSON.parse(content);
    } catch (error) {
      return { ...defaultValue, code: content };
    }
  }
  return defaultValue;
};

type Props = {
  content: string; // "{ code, language }"
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: (content: string) => void;
};

export const Code = ({ content, editable, onFocus, onBlur }: Props) => {
  const c = parseCodeContent(content);
  const [code, setCode] = useState(c.code || "");
  const [language, setLanguage] = useState(c.language || "javascript");

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  useEffect(() => {
    if (c.code !== code) {
      setCode(c.code);
    }
  }, [c.code]);

  const onCodeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const onCodeKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab" && !e.shiftKey) {
      document.execCommand("insertText", false, "    ");
      e.preventDefault();
      return false;
    }
  };

  const onCodeBlur = () => {
    if (onBlur) {
      onBlur(JSON.stringify({ code, language }));
    }
  };

  const onSelectLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const codeBlock = (
    <pre>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );

  if (editable) {
    return (
      <EditableCodeContainer>
        <select
          value={language}
          onChange={onSelectLanguage}
          onBlur={onCodeBlur}
        >
          <option value="markup">Markup</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="ruby">Ruby</option>
          <option value="elixir">Elixir</option>
          <option disabled>──────────</option>
          <option value="abap">ABAP</option>
          <option value="actionscript">ActionScript</option>
          <option value="ada">Ada</option>
          <option value="apacheconf">Apache</option>
          <option value="apl">APL</option>
          <option value="applescript">AppleScript</option>
          <option value="arduino">Arduino</option>
          <option value="arff">ARFF</option>
          <option value="asciidoc">AsciiDoc</option>
          <option value="asm6502">6502 Assembly</option>
          <option value="aspnet">ASP.NET (C#)</option>
          <option value="autohotkey">AutoHotkey</option>
          <option value="autoit">AutoIt</option>
          <option value="bash">Bash</option>
          <option value="basic">BASIC</option>
          <option value="batch">Batch</option>
          <option value="bison">Bison</option>
          <option value="brainfuck">Brainfuck</option>
          <option value="bro">Bro</option>
          <option value="c">C</option>
          <option value="csharp">C#</option>
          <option value="cpp">C++</option>
          <option value="coffeescript">CoffeeScript</option>
          <option value="clojure">Clojure</option>
          <option value="crystal">Crystal</option>
          <option value="csp">CSP</option>
          <option value="css-extras">CSS Extras</option>
          <option value="d">D</option>
          <option value="dart">Dart</option>
          <option value="diff">Diff</option>
          <option value="django">Django/Jinja2</option>
          <option value="docker">Docker</option>
          <option value="eiffel">Eiffel</option>
          <option value="elm">Elm</option>
          <option value="erb">ERB</option>
          <option value="erlang">Erlang</option>
          <option value="fsharp">F#</option>
          <option value="flow">Flow</option>
          <option value="fortran">Fortran</option>
          <option value="gedcom">GEDCOM</option>
          <option value="gherkin">Gherkin</option>
          <option value="git">Git</option>
          <option value="glsl">GLSL</option>
          <option value="gml">GameMaker</option>
          <option value="go">Go</option>
          <option value="graphql">GraphQL</option>
          <option value="groovy">Groovy</option>
          <option value="haml">Haml</option>
          <option value="handlebars">Handlebars</option>
          <option value="haskell">Haskell</option>
          <option value="haxe">Haxe</option>
          <option value="http">HTTP</option>
          <option value="ichigojam">IchigoJam</option>
          <option value="icon">Icon</option>
          <option value="inform7">Inform 7</option>
          <option value="ini">Ini</option>
          <option value="io">Io</option>
          <option value="j">J</option>
          <option value="java">Java</option>
          <option value="jolie">Jolie</option>
          <option value="json">JSON</option>
          <option value="julia">Julia</option>
          <option value="keyman">Keyman</option>
          <option value="kotlin">Kotlin</option>
          <option value="latex">LaTeX</option>
          <option value="less">Less</option>
          <option value="liquid">Liquid</option>
          <option value="lisp">Lisp</option>
          <option value="livescript">LiveScript</option>
          <option value="lolcode">LOLCODE</option>
          <option value="lua">Lua</option>
          <option value="makefile">Makefile</option>
          <option value="markdown">Markdown</option>
          <option value="markup-templating">Markup</option>
          <option value="matlab">MATLAB</option>
          <option value="mel">MEL</option>
          <option value="mizar">Mizar</option>
          <option value="monkey">Monkey</option>
          <option value="n4js">N4JS</option>
          <option value="nasm">NASM</option>
          <option value="nginx">nginx</option>
          <option value="nim">Nim</option>
          <option value="nix">Nix</option>
          <option value="nsis">NSIS</option>
          <option value="objectivec">Objective-C</option>
          <option value="ocaml">OCaml</option>
          <option value="opencl">OpenCL</option>
          <option value="oz">Oz</option>
          <option value="parigp">PARI/GP</option>
          <option value="parser">Parser</option>
          <option value="pascal">Pascal</option>
          <option value="perl">Perl</option>
          <option value="php">PHP</option>
          <option value="php-extras">PHP Extras</option>
          <option value="plsql">PL/SQL</option>
          <option value="powershell">PowerShell</option>
          <option value="processing">Processing</option>
          <option value="prolog">Prolog</option>
          <option value="properties">.properties</option>
          <option value="protobuf">Protocol Buffers</option>
          <option value="pug">Pug</option>
          <option value="puppet">Puppet</option>
          <option value="pure">Pure</option>
          <option value="q">Q (kdb+ database)</option>
          <option value="qore">Qore</option>
          <option value="r">R</option>
          <option value="jsx">React JSX</option>
          <option value="tsx">React TSX</option>
          <option value="renpy">Ren'py</option>
          <option value="reason">Reason</option>
          <option value="rip">Rip</option>
          <option value="roboconf">Roboconf</option>
          <option value="rust">Rust</option>
          <option value="sas">SAS</option>
          <option value="sass">Sass (Sass)</option>
          <option value="scss">Sass (Scss)</option>
          <option value="scala">Scala</option>
          <option value="scheme">Scheme</option>
          <option value="smalltalk">Smalltalk</option>
          <option value="smarty">Smarty</option>
          <option value="sql">SQL</option>
          <option value="soy">Soy</option>
          <option value="stylus">Stylus</option>
          <option value="swift">Swift</option>
          <option value="tap">TAP</option>
          <option value="tcl">Tcl</option>
          <option value="textile">Textile</option>
          <option value="tt2">Template Toolkit</option>
          <option value="typescript">TypeScript</option>
          <option value="twig">Twig</option>
          <option value="vbnet">VB.Net</option>
          <option value="velocity">Velocity</option>
          <option value="verilog">Verilog</option>
          <option value="vhdl">VHDL</option>
          <option value="vim">vim</option>
          <option value="visual-basic">Visual Basic</option>
          <option value="wasm">WebAssembly</option>
          <option value="wiki">Wiki markup</option>
          <option value="xeora">Xeora</option>
          <option value="xojo">Xojo (REALbasic)</option>
          <option value="xquery">XQuery</option>
          <option value="yaml">YAML</option>
        </select>
        <textarea
          onChange={onCodeChange}
          onFocus={onFocus}
          value={code}
          onBlur={onCodeBlur}
          onKeyDown={onCodeKeyDown}
        />
        {codeBlock}
      </EditableCodeContainer>
    );
  }

  return codeBlock;
};

const EditableCodeContainer = styled.div`
  position: relative;
  > textarea {
    width: 100%;
    height: 100%;
    padding: 1em;
    position: absolute;
    background-color: hsl(0deg 0% 0% / 0%);
    color: hsl(0deg 0% 0% / 0%);
    caret-color: ${theme.ui.text};
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    resize: none;
    min-height: 56px;
  }
  > pre {
    min-height: 56px;
  }
  > select {
    position: absolute;
    right: 8px;
    top: 8px;
    z-index: 1;
  }
`;
