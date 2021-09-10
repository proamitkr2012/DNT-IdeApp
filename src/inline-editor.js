import React from "react";
import MonacoEditor from "react-monaco-editor";
import EditorService from "./services/editor.service";
import SplitPane from "react-split-pane";
import DownloadLink from "./lib/downloadLink";
import { connect } from "react-redux";
import * as articleActions from "./redux/actions/articleActions";

class InlineEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ideState: this.props.store.ideState,
            theme: "vs-dark",
            themes: ["vs-dark", "vs-light"],
            disabled: false,
            downloadFile: 'code.txt'
        };
    }

    onChange = newValue => {
        //this.setState({ ideState: { code: newValue } })
        const { language, isEdit, height, codeNode } = this.props.store.ideState;
        this.props.saveIDEState({
            ideState: {
                code: newValue, //updating editor value
                language: language,
                isEdit: isEdit,
                height: height,
                codeNode: codeNode
            }
        });
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
        if (this.props.store.ideState.language != 'html') {
            const element = document.getElementById('console');
            element.innerHTML = 'Executing code on cloud ...';
        }else if(this.props.store.ideState.language == 'html'){
            const iframe = document.getElementById('htmlFrame');
            let output = iframe.contentWindow.document.getElementById('output-html');
            output.innerHTML = 'Executing code ...';
        }
        let code = this.editor.getValue();
        this.setState({
            code: code,
            disabled: true
        });
        const model = {
            code: code,
            language: this.props.store.ideState.language
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
                let output = iframe.contentWindow.document.getElementById('output-html');
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
        const { theme, downloadFile } = this.state;
        const { language, height, code } = this.props.store.ideState;
       // console.log(this.props.store.ideState);
        const options = {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: "line",
            fontSize: 16,
            automaticLayout: false,
            minimap: {
                enabled: false
            }
        };

        return (
            <div style={{ height: height + 'px' }}>
                <SplitPane
                    split="horizontal"
                    defaultSize="70%"
                    minSize="20%" maxSize="80%">
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
                            </div>
                        </div>
                        <div className="editor-section">
                            <MonacoEditor
                                height="100vh"
                                width="100%"
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
                            language == 'html' ? <iframe src="/html-sandbox.html" id="htmlFrame" className="html-sandbox"></iframe>
                                : <div id="console" className="output-text"></div>
                        }
                    </div>
                </SplitPane>
            </div>
        );
    }
}

//accessing state from store
const mapStateToProps = (state, ownProps) => {
    //resetting output
    if (state.ideState.language == 'html') {
        const iframe = document.getElementById('sandbox');
        if (iframe) {
            let output = iframe.contentWindow.document.getElementById('output');
            output.innerHTML = '';
        }
    }
    else {
        const element = document.getElementById('console');
        if (element)
            element.innerHTML = '';
    }

    //returning updated state
    return {
        store: state.ideState //ideState is the passed name to component props
    }
}

//mapping actions to dispatch and updating state to props
const mapDispatchToProps = (dispatch) => {
    return {
        saveIDEState: (ideState) => dispatch(articleActions.saveIDEState(ideState))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InlineEditor);