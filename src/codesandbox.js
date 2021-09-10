import React from "react";
import Editor from "./editor";
import { connect } from "react-redux";

class CodeSandbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: ''
        }
    }
    componentDidMount() {
        this.setState({ code: this.props.playerStore.playerState.solution });
    }
    render() {
        const playerStore = this.props.playerStore;
        return (
            <div style={{ paddingTop: '40px' }}>
                <Editor language={playerStore.playerState.language} defaultCode={this.props.playerStore.playerState.solution} hideLogo={true}/>
            </div>
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

export default connect(
    mapStateToProps,
    null
)(CodeSandbox);