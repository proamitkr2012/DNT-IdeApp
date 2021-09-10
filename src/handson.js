import React from "react";
import Editor from "./editor";
import SplitPane from "react-split-pane";
import { connect } from "react-redux";
import * as articleActions from "./redux/actions/articleActions";

class HandsOn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            solution: '',
            displaySolution: ''
        };
    }
    showSolution = () => {
        this.setState({
            displaySolution: this.props.playerStore.playerState.solution
        });
    }
    showHint = () => {
        this.setState({
            hint: this.props.playerStore.playerState.hint
        });
    }
    loadSolution = () => {
        this.setState({
            solution: this.state.displaySolution
        });
    }
    render() {
        const playerStore = this.props.playerStore;
        return (
            <SplitPane split="vertical" defaultSize="400px" minSize={200} maxSize={-600}>
                <div className="excercise-border">
                    <div className="bar excercise-bar">Hands-on Lab : {playerStore.playerState.topicName}</div>
                    <div className="excercise-text">
                        <div dangerouslySetInnerHTML={{ __html: playerStore.playerState.content }}></div>
                        <br />
                        <button className="btn-bar btn-solution" onClick={this.showHint}>Stuck? Get a Hint</button>
                        {
                            this.state.hint && <div style={{ marginTop: '20px' }}><div dangerouslySetInnerHTML={{ __html: this.state.hint }} className="hint"></div>
                                <div style={{ marginTop: '20px' }}><button className="btn-bar btn-solution" onClick={this.showSolution}>Still didn't get? View Solution</button>
                                </div>
                            </div>
                        }
                        {
                            this.state.displaySolution &&
                            <div>
                                <pre className="prettyprint linenums" dangerouslySetInnerHTML={{ __html: this.state.displaySolution }}></pre>
                                <div style={{ marginTop: '20px' }}>
                                    <button className="btn-bar btn-loadsolution" onClick={this.loadSolution}>Load Solution in IDE</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
              {
                  this.state.solution!='' &&  <Editor defaultCode={this.state.solution} language={playerStore.playerState.language} />
              }
              {
                  this.state.solution=='' &&  <Editor defaultCode={playerStore.playerState.code} language={playerStore.playerState.language} />
              }
            </SplitPane>
        )
    }
}

//accessing state from store
const mapStateToProps = (state, ownProps) => {
    //console.log(state.playerState);
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
    mapStateToProps, //HandsOn
    mapDispatchToProps
)(HandsOn);