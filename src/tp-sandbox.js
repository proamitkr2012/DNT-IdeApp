import React from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";

class TPCodeSandbox extends React.Component {
    constructor(props) {
        super(props);
    }
    hideLoading = () => {
        document.getElementById('spinner').style.display = 'none';
    }
    render() {
        const playerStore = this.props.playerStore;
        return (
            <div className="tp-sandbox">
                <div id="spinner" className="spinner">
                    <div style={{ height: '200px' }}></div>
                    <Loader type="Oval" color="#fff" height={36} width={36} />
                </div>
                <iframe src={playerStore.playerState.solution} id="sandbox" className="html-sandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin" onLoad={this.hideLoading}>
                </iframe>
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
    mapStateToProps, //HandsOn
    null
)(TPCodeSandbox);