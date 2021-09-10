import React from "react";
import MonacoEditor from "react-monaco-editor";
import EditorService from "./services/editor.service";
import SplitPane from "react-split-pane";
import DownloadLink from "./lib/downloadLink";

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: this.props.defaultCode,
            hideLogo: this.props.hideLogo,
            language: this.props.language,
            theme: "vs-dark",
            languages: ['html', 'javascript', 'typescript', 'csharp', 'python'],
            themes: ["vs-dark", "vs-light"],
            output: '',
            disabled: false,
            downloadFile: 'code.txt'
        };
    }

    onChange = newValue => {
        this.setState({ code: newValue })
    };

    editorDidMount = editor => {
        this.editor = editor;
    };

    setTheme = (event) => {
        this.setState({ theme: event.target.value });
    };

    showOutput = (result) => {
        let parsed = result;
        if (Array.isArray(parsed)) { //for c# code result
            //console.log(result);
            const element = document.getElementById('console');
            element.innerHTML = '';
            const node = document.createElement('div');
            let elData = "";
            for (let i = 0; i < parsed.length; i++) {
                elData += parsed[i] + '<br />';
            }
            node.innerHTML = elData;
            element.appendChild(node);
        }
        else {
            //console.log(result);
            parsed = new String(result); //for typescript number type
            if (parsed == '') {
                parsed = 'try again..';
            }
            const element = document.getElementById('console');
            element.innerHTML = '';
            const node = document.createElement('div');
            node.innerHTML = parsed.replace(/\n/g, '<br />');
            element.appendChild(node);
        }
        this.setState({
            disabled: false
        });
    }
    runCode = (event) => {
        if (this.state.language != 'html') {
            const element = document.getElementById('console');
            element.innerHTML = 'Executing code on cloud ...';
        }
        else if (this.state.language == 'html') {
            const iframe = document.getElementById('htmlFrame');
            var output = iframe.contentWindow.document.getElementById('output-html');
            output.innerHTML = 'Executing code ...';
        }

        let code = this.editor.getValue();
        this.setState({
            code: code,
            disabled: true
        });
        const model = {
            code: code,
            language: this.state.language
        }
        switch (model.language) {
            case 'csharp':
            case 'javascript':
            case 'typescript':
            case 'python':
                EditorService.RunCode(model).then((res) => {
                    this.showOutput(res.data);
                }).catch((err) => {
                    this.showOutput(err);
                });
                break;
            case 'html':
                const iframe = document.getElementById('htmlFrame');
                var output = iframe.contentWindow.document.getElementById('output-html');
                output.innerHTML = code;
                this.setState({
                    disabled: false
                });
                break;
            default:
                break;
        }
    }

    render() {
        const { code, theme, language, output, downloadFile, hideLogo } = this.state;

        const options = {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: "line",
            fontSize: 16,
            automaticLayout: true,
            minimap: {
                enabled: false
            }
        };
        return (
            <div id="hands-on">
                <SplitPane
                    split="horizontal"
                    defaultSize="70%"
                    minSize="30%" maxSize="70%">
                    <div className="editor-wrapper">
                        <div className="ide-bar">
                            <div className="ide-run">
                                <button onClick={this.runCode} className="btn-bar btn-run" disabled={this.state.disabled}>
                                    <img src="/images/play.png" /> <span className="run-span">Run Code</span>
                                </button>
                            </div>

                            <div className="right btn-download-wrapper">
                                <DownloadLink
                                    label="Download Code"
                                    className="btn-bar btn-download"
                                    filename={downloadFile}
                                    exportFile={() => this.editor.getValue()}>
                                </DownloadLink>
                                {
                                    hideLogo != true && <span id="spanlogo" style={{ float: 'right', marginLeft: '10px', marginRight: '10px' }}>
                                        <img src="/images/logo.png" height="24px" /></span>
                                }
                            </div>
                        </div>
                        <div className="editor-section">
                            <MonacoEditor
                                width="100%"
                                height="70vh"
                                language={language}
                                value={code}
                                options={options}
                                onChange={this.onChange}
                                editorDidMount={this.editorDidMount}
                                theme={theme}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="output-bar">Output</div>
                        {
                            this.state.language === 'html' ? <iframe src="/html-sandbox.html" id="htmlFrame" className="html-sandbox"></iframe>
                                : <div id="console" className="output-text"></div>
                        }
                    </div>
                </SplitPane>
            </div>
        );
    }
}
