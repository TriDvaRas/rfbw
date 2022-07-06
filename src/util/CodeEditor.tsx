import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markdown";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Editor from "react-simple-code-editor";
// import "prismjs/themes/prism-funky.css";
import '../assets/css/code.css';
import { updateMarkdown } from "../features/admin/aRulesSlice";


interface Props {
    content: string;
    language: string;
}
const CodeEditor = (props: Props) => {
    const [content, setContent] = useState(props.content);
    const dispatch = useDispatch()
    function handleChange(code: string) {
        setContent(code)

        dispatch(updateMarkdown(code))
    }
    
    return (
        <Editor
            value={content}
            onValueChange={handleChange}
            highlight={(code) => highlight(code, languages.markdown, 'markdown')}
            padding={10}
            textareaClassName='form-control '
            preClassName=' bg-dark-900 text-light'
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
            }}
        />
        // <Form.Control
        //     as={TextareaAutosize}
        //     style={{ resize: 'none' }}
        //     className="prism-live language-js"
        //     value={content}
        //     onChange={(evt:any) => setContent(evt.target.value)}
        //     onKeyDown={handleKeyDown}
        // />
    );
};

export default CodeEditor;