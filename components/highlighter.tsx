import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";

type Props = {
  codeString: string;
  language: string;
};

const Highlighter = ({ codeString, language }: Props) => {
  return (
    <SyntaxHighlighter language={language} style={docco}>
      {codeString}
    </SyntaxHighlighter>
  );
};

export default Highlighter;
