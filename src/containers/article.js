import React from "react";
import { connect } from "react-redux";
import * as articleActions from "../redux/actions/articleActions";

//lazy loading or code splitting
import Loadable from "react-loadable";
import Loading from "../components/loading";

const InlineEditor = Loadable({
    loader: () => import("../components/inline-editor"),
    loading: Loading
});

class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showIDE: true,
            defaultHeight: 200
        };
    }
    CancelCode = () => {
        let codeEl = document.getElementById(this.props.store.ideState.codeNode);
        if (codeEl != null) {
            for (let k = 0; k < codeEl.children.length; k++) {
                codeEl.children[k].style.display = '';
            }

            let ide = document.getElementById("editor");
            ide.style.display = 'none';
        }
    }

    attachEditor(that) {
        let elements = document.getElementsByClassName("code-wrapper");
        //console.log(elements.length);
        for (let i = 0; i < elements.length; i++) {
            let codeblockId = "code" + i;
            let button = document.createElement("button");
            button.setAttribute("class", "btn-bar btn-loadsolution");
            button.innerHTML = "Edit Code";
            button.addEventListener("click", function (e) {
                let el = e.currentTarget;
                let index = 1; //code index=1, button index=0
                let code = el.parentNode.children[index].innerHTML;
                //replace pretty print html tags and HTML IDE Tags
                code = code.replace(/(<ol class="linenums">|<span class="str">|<span class="kwd">|<span class="com">|<span class="typ">|<span class="lit">|<span class="pun">|<span class="opn">|<span class="clo">|<span class="tag">|<span class="atn">|<span class="atv">|<span class="dec">|<span class="var">|<span class="fun">|<span class="pln">|<\/li>|<\/ol>|<\/span>|&nbsp;)/g, "");
                code = code.replace(/(<li class="L0">|<li class="L1">|<li class="L2">|<li class="L3">|<li class="L4">|<li class="L5">|<li class="L6">|<li class="L7">|<li class="L8">|<li class="L9">)/g, "\n");               
                code=code.replace(/&lt;/g,'<').replace(/&gt;/g,'>');

                let height = el.parentNode.children[index].offsetHeight + that.state.defaultHeight;
                //checking previously opened ide from previous state
                let codeEl = document.getElementById(that.props.store.ideState.codeNode);
                if (codeEl != undefined && codeEl != '') {
                    for (let k = 0; k < codeEl.children.length; k++) {
                        codeEl.children[k].style.display = '';
                    }
                }
                
                //updating condition to show IDE
                that.setState({ showIDE: true }); 

                //updating state in store based upon category
                that.props.saveIDEState({
                    ideState: {
                        language: that.props.playerStore.playerState.language,
                        isEdit: true,
                        code: code,
                        height: height,
                        codeNode: codeblockId
                    }
                });

                //hiding button, code and ouput
                for (let j = 0; j < el.parentNode.children.length; j++) {
                    el.parentNode.children[j].style.display = 'none';
                }
                //adding ide
                let ide = document.getElementById("editor");
                if (ide != null) {
                    ide.style.display = '';
                    el.parentNode.append(ide);
                }
            });
            //assigning id to code-wrapper div
            elements[i].setAttribute("id", codeblockId);
            elements[i].prepend(button);
        }
    }

    componentDidMount() {
        this.setState({ showIDE: false });
        //attaching editor
        this.attachEditor(this);
        //updating syntax highlighter
        window.PR.prettyPrint(); 
    }

    render() {
        const store = this.props.store;
        const playerStore = this.props.playerStore;
        return (
            <>
                <div className="article">
                    {
                        (store.ideState.isEdit == true && this.state.showIDE) && <div id="editor"><button className="btn-bar btn-solution" onClick={this.CancelCode}>Close IDE</button>
                            <InlineEditor />
                        </div>
                    }
                    <div dangerouslySetInnerHTML={{ __html: playerStore.playerState.content }}></div>
                </div>
            </>
        )
    }
}

//accessing state from store
const mapStateToProps = (state, ownProps) => {
    return {
        store: state.ideState,
        playerStore: state.playerState
    };
};

//mapping actions to dispatch and updating state to props
const mapDispatchToProps = (dispatch) => {
    return {
        saveIDEState: (ideState) => dispatch(articleActions.saveIDEState(ideState))
    };
};

export default connect(
    mapStateToProps, //Article
    mapDispatchToProps
)(Article);
