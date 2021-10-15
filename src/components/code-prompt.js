import React, { Component } from 'react'
import Modal from './modal';
import UnlockButton from '../lib/unlockButton';

export default class CodePrompt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowing: false
        }
    }
    openModalHandler = () => {
        this.setState({
            isShowing: true
        });
    }
    closeModalHandler = () => {
        this.setState({
            isShowing: false
        });
    }
    render() {
        return (
            <>
                <div className="article-bar">
                    Join DotNetTricks Membership
                </div>
                <div className="modalmember">
                    <img src="/images/become_member.png" style={{ height: '120px' }} />
                    <h2 style={{ fontSize: 30, color: 'white', textAlign: 'center', lineHeight: '30px' }}>Want to download Code and PPTs?</h2>
                    <div style={{ maxWidth: 600, lineHeight: '24px', paddingBottom: '.5rem', padding: '10px', color: '#ccc', marginRight: 'auto', marginLeft: 'auto', fontSize: 16, textAlign: 'justify' }}>
                        You must be a DotNetTricks Subscribed member to download code and PPTs. Join us? <strong style={{ color: '#fff' }}>Get access to all <span dangerouslySetInnerHTML={{__html:window.$courses}}></span> courses, <span dangerouslySetInnerHTML={{__html:window.$paths}}></span> learning paths and a community of Microsoft MVPs, Google GDEs &amp; Industry experts.</strong>
                    </div>
                </div>
                <div style={{ height: 40, margin: 20, textAlign: 'center' }}>
                    <span>
                        <a className="btn btn-info" style={{ padding: '4px 10px' }} href="/plus-membership">
                            <div style={{ float: 'left' }}>
                            <UnlockButton />
                            </div>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 'bold' }}>&nbsp;&nbsp; Upgrade Now &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                <div style={{ fontSize: 12 }}>to unlock all premium features</div>
                            </div>
                        </a>
                    </span>
                    {
                        this.props.userId == 0 ?
                            <span id="loginbtn">
                                <a style={{ padding: '12px 8px', fontSize: 16, fontWeight: 'bold' }} className="btn btn-default" onClick={this.openModalHandler}>Login to Download</a>
                            </span> : <></>
                    }
                </div>

                {this.state.isShowing ? <div className="back-drop">
                    <Modal
                        className="modal"
                        show={this.state.isShowing}
                        close={this.closeModalHandler}>
                    </Modal>
                </div> : null}
            </>
        )
    }
}