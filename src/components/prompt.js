import React, { Component } from 'react'
import Modal from './modal';
import EnumAccessibility from '../enums/enum-accessibility';
import UnlockButton from '../lib/unlockButton';
import EnumMembership from '../enums/enum-membership';

export default class prompt extends Component {
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
                {/* <div className="article-bar">
                    Become a Member
                </div> */}
                <div className="modalmember">
                    <img src="/images/become_member.png" style={{ height: '120px' }} />
                    <h2 style={{ fontSize: 30, color: 'white', textAlign: 'center', lineHeight: '30px' }}>Want more lessons?</h2>
                    <div style={{ maxWidth: 600, lineHeight: '24px', paddingBottom: '.5rem', padding: '10px', color: '#ccc', marginRight: 'auto', marginLeft: 'auto', fontSize: 16, textAlign: 'justify' }}>
                        This lesson is only for DotNetTricks Subscribed members. Join us? <strong style={{ color: '#fff' }}>Get access to all <span dangerouslySetInnerHTML={{__html:window.$courses}}></span> courses, <span dangerouslySetInnerHTML={{__html:window.$paths}}></span> learning paths and a community of Microsoft MVPs, Google GDEs &amp; Industry experts.</strong>
                    </div>
                </div>
                <div style={{ height: 40, margin: 20, textAlign: 'center' }}>
                    <span>
                        {
                            (this.props.accessibility == EnumAccessibility.Premium && this.props.membershipId == EnumMembership.Trial) ?
                                <a className="btn btn-info" style={{ padding: '4px 10px' }} href="/plus-membership">
                                    <div style={{ float: 'left' }}>
                                        <UnlockButton />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 16, fontWeight: 'bold' }}>&nbsp;&nbsp; Upgrade Now &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                        <div style={{ fontSize: 12 }}>to unlock all lessons</div>
                                    </div>
                                </a>
                                :
                                (this.props.membershipId == -1 ?
                                    <a className="btn btn-info" style={{ padding: '4px 10px' }} href="/pricing">
                                        <div style={{ float: 'left' }}>
                                            <UnlockButton />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 16, fontWeight: 'bold' }}>&nbsp; Renew Your Membership Plan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                            <div style={{ fontSize: 12 }}>to unlock all lessons & premium features</div>
                                        </div>
                                    </a>
                                    :
                                    <a className="btn btn-info" style={{ padding: '4px 10px' }} href="/plus-membership">
                                        <div style={{ float: 'left' }}>
                                            <UnlockButton />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 16, fontWeight: 'bold' }}>&nbsp; Subscribe Now &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                            <div style={{ fontSize: 12 }}>to unlock all lessons</div>
                                        </div>
                                    </a>
                                )
                        }
                    </span>
                    {
                        this.props.userId == 0 ? <span id="loginbtn">
                            <a style={{ padding: '12px 30px', fontSize: 16, fontWeight: 'bold' }} className="btn btn-default" onClick={this.openModalHandler}>Login to Play</a>
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