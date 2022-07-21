import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markdown";
import React, { useState } from "react";
import Editor from "react-simple-code-editor";
// import "prismjs/themes/prism-funky.css";


interface Props {
    content: string;
    language: string;
    onChange?: (md: string) => void
}
const CodeEditor = (props: Props) => {
    function handleChange(code: string) {
        if (props.onChange)
            props.onChange(code)
    }

    return (
        <Editor
            value={props.content}
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