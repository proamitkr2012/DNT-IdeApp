import React from "react";
import { connect } from "react-redux";
import CryptoJS from 'crypto-js';
import * as playerActions from "./redux/actions/playerActions";
import Modal from './modal';
import EnumMembership from './enum-membership';
import EnumCourseType from './enum-courseType';
import EnumTopicType from "./enum-topicType";
import CourseService from "./services/course.service";
import Vimeo from '@u-wave/react-vimeo';
//lazy loading or code splitting
import Loadable from "react-loadable";
import Loading from "./loading";

const Article = Loadable({
    loader: () => import("./article"),
    loading: Loading
});
const Quiz = Loadable({
    loader: () => import("./quiz"),
    loading: Loading
});
const HandsOn = Loadable({
    loader: () => import("./handson"),
    loading: Loading
});
const CodeSandbox = Loadable({
    loader: () => import("./codesandbox"),
    loading: Loading
});
const TPCodeSandbox = Loadable({
    loader: () => import("./tp-sandbox"),
    loading: Loading
});
const Prompt = Loadable({
    loader: () => import("./prompt"),
    loading: Loading
});
const CodePrompt = Loadable({
    loader: () => import("./code-prompt"),
    loading: Loading
});
const UpgradePrompt = Loadable({
    loader: () => import("./upgrade-prompt"),
    loading: Loading
});

class Player extends React.Component {
    constructor(props) {
        super(props);
        //debugger;
        this.state = {
            courseId: this.props.courseId,
            subTopicId: 0,
            topicType: '',
            index: 0, //index of played video/subtopic
            UrlPath: '',
            defaultPlay: true,
            fileDownload: true,
            lastClickedCourseId: 0,
            IsBookmarked: false,
            isShowing: false,
            userId: this.props.userId,
            profileImageUrl: this.props.profileImageUrl
        };
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

    closeme = () => {
        document.getElementById("openme").style.display = "block";
        document.getElementById("closeme").style.display = "none";
        document.getElementById("main").style.marginLeft = "0";
        document.getElementById("mySidebar").style.display = "none";
        var logo = document.getElementById("spanlogo");
        if (logo)
            logo.style.marginRight = "10px";

        const video = document.getElementById("iframeVideo");
        if (video) {
            video.style.width = '100%';
            video.style.height = (window.innerHeight - 20) + "px";
        }
    }
    openme = () => {
        var width = window.innerWidth;
        document.getElementById("openme").style.display = "none";
        document.getElementById("closeme").style.display = "block";
        document.getElementById("main").style.marginLeft = width > 500 ? "320px" : "220px";
        document.getElementById("mySidebar").style.width = width > 500 ? "320px" : "220px";
        document.getElementById("mySidebar").style.display = "block";
        var logo = document.getElementById("spanlogo");
        if (logo)
            logo.style.marginRight = "330px";

        const video = document.getElementById("iframeVideo");
        if (video) {
            video.style.width = '100%';
            video.style.height = (window.innerHeight - 20) + "px";
        }
    }
    handlePlay = (index, childIndex, isLock, topicName, topicType, isLearnt, isBookmarked, content, language, code, hint, solution) => {
        this.setIndex(childIndex);
        //to remove prompt
        if (!this.state.fileDownload) {
            this.setState({ fileDownload: true });
        }
        if (topicType == EnumTopicType.Quiz) {
            this.props.savePlayerState({
                playerState: {
                    courseId: this.props.courseId,
                    index: index,
                    childIndex: childIndex,
                    isLock: isLock,
                    topicName: topicName,
                    topicType: topicType,
                    content: content,
                    subTopicId: childIndex,
                    isBookmarked: isBookmarked
                }
            });

        } else {
            //don't set player state for double click
            if (this.state.subTopicId == 0 || this.state.subTopicId != childIndex) {
                this.setState({ subTopicId: childIndex });
                this.props.savePlayerState({
                    playerState: {
                        courseId: this.props.courseId,
                        index: index,
                        childIndex: childIndex,
                        isLock: isLock,
                        topicName: topicName,
                        topicType: topicType,
                        content: content,
                        language: language,
                        code: code,
                        hint: hint,
                        solution: solution,
                        height: 680,
                        isBookmarked: isBookmarked
                    }
                });
            }
        }

        // Start Process : Set Learning Process 
        // If first time click on Topic, So set 0
        if (this.state.lastClickedCourseId == undefined) {
            this.setState({ lastClickedCourseId: 0 });
        }

        if ((this.props.store.playerState.isLock && this.props.membershipId > 0) ||
            (this.props.store.playerState.isLock == false && this.props.userId > 0)) {
            //If user click next Topic or Is not Learnt 
            if ((this.state.lastClickedCourseId != childIndex) && this.props.courseId > 0 && childIndex > 0 && topicType > 0 && isLearnt == false) {
                const learningProgres = {
                    CourseId: this.props.courseId,
                    TopicId: childIndex,
                    TopicType: topicType,
                    MemberId: this.props.membershipId
                };

                //need to set IsLearnt=true for current Topic TODO
                CourseService.SetLearningProgress(learningProgres).then(res => {
                    if (res.IsSuccess == true) {
                        //setting current subtopic as watched
                        this.setState({ lastClickedCourseId: childIndex });
                        let flag = false;
                        for (let i = 0; i < this.props.topics.length; i++) {
                            const topic = this.props.topics[i];
                            for (let j = 0; j < topic.SubTopics.length; j++) {
                                const subTopic = topic.SubTopics[j];
                                if (subTopic.SubTopicId == childIndex) {
                                    this.props.topics[i].SubTopics[j].IsLearnt = true;
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag)
                                this.forceUpdate();
                        }
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
            // End Process : Set Learning Process 
        }
    }

    //course overview play upon first time open
    componentWillReceiveProps(props) {
        const topics = props.topics;
        this.setState.userId = props.userId;
        this.setState.profileImageUrl = props.profileImageUrl;
        //setting page title
        document.title = 'Playing | ' + props.courseName;
        //setting specific subtopic play
        if (this.state.defaultPlay && props.subTopicId > 0) {
            for (let i = 0; i < topics.length; i++) {
                const subTopics = topics[i].SubTopics;
                for (let j = 0; j < subTopics.length; j++) {
                    const subTopic = subTopics[j];
                    this.setState({ defaultPlay: false });
                    if (props.subTopicId == subTopic.SubTopicId) {
                        //need to pass topicId and subTopicId
                        if (EnumTopicType.Video == subTopic.TopicType)
                            this.handlePlay(i, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.VideoUrl, '');
                        else if (EnumTopicType.Article == subTopic.TopicType)
                            this.handlePlay(i, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.Content, subTopic.IDELanguage);
                        break;
                    }
                }
            }
        }
        else if (this.state.defaultPlay && topics.length > 0 && topics[0].SubTopics.length > 0) {
            const subTopic = topics[0].SubTopics[0];
            this.setState({ defaultPlay: false });
            //need to pass topicId and subTopicId
            if (EnumTopicType.Video == subTopic.TopicType)
                this.handlePlay(0, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.VideoUrl, '');
            else if (EnumTopicType.Article == subTopic.TopicType)
                this.handlePlay(0, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.Content, subTopic.IDELanguage);
        }
    }

    //for prev/next
    setIndex(subTopicId) {
        const subTopicState = sessionStorage.getItem('a_subt');
        if (subTopicState !== '') {
            var swords = CryptoJS.enc.Base64.parse(subTopicState.toString());
            var sdata = CryptoJS.enc.Utf8.stringify(swords);
            const allSubTopics = JSON.parse(sdata);
            let subtopicIndex = allSubTopics.indexOf(subTopicId);
            subtopicIndex = subtopicIndex > -1 ? subtopicIndex : 0;
            this.setState({ index: subtopicIndex });
        }
    }
    componentDidMount() {
        // work on page refresh
        const localState = sessionStorage.getItem('dnt_ps');
        let courseId = sessionStorage.getItem('c_id');
        //debugger;
        if (localState != undefined && courseId > 0) {
            //base64 to string
            var words = CryptoJS.enc.Base64.parse(localState.toString());
            var data = CryptoJS.enc.Utf8.stringify(words);
            const subTopic = JSON.parse(data);

            //checking for the same course
            if (courseId == subTopic.courseId) {
                this.setState({ defaultPlay: false });
                this.handlePlay(subTopic.index, subTopic.childIndex, subTopic.isLock, subTopic.topicName, subTopic.topicType, subTopic.isLearnt, subTopic.isBookmarked, subTopic.content, subTopic.language, subTopic.code, subTopic.hint, subTopic.solution);
            }
        }
    }

    downloadFile = (url, subTopicId, contentType) => {
        if (this.props.membershipId > 0 && this.props.membershipId != EnumMembership.Trial) {
            window.open(url, '_blank');
            //this.SetContentHistory(url, subTopicId, contentType);
            CourseService.SetContentHistory(url, this.props.courseId, this.props.TopicId, subTopicId, contentType)
                .then(res => {
                    console.log('content');
                })
                .catch(err => {
                    console.log(err);
                });
        }
        else
            this.setState({ fileDownload: false });
    }

    handleLogin = () => {
        this.openModalHandler();
    }
    setBookmark = (subTopicId) => {
        //debugger;
        if (this.props.userId > 0 && this.props.membershipId != EnumMembership.Trial) {
            if (this.props.courseId > 0 && subTopicId > 0) {
                CourseService.SetBookmark(this.props.courseId, subTopicId).then(res => {
                    if (res.IsSuccess == true) {
                        //setting current subtopic as bookmarked
                        let flag = false;
                        for (let i = 0; i < this.props.topics.length; i++) {
                            const topic = this.props.topics[i];
                            for (let j = 0; j < topic.SubTopics.length; j++) {
                                const subTopic = topic.SubTopics[j];
                                if (subTopic.SubTopicId == subTopicId) {
                                    this.props.topics[i].SubTopics[j].IsBookmarked = !this.props.topics[i].SubTopics[j].IsBookmarked;
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag)
                                this.forceUpdate();
                        }
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }

    onEnded = () => {
        let subTopicId = this.props.allSubTopics[this.state.index + 1];
        this.setIndex(subTopicId);
        const topics = this.props.topics;
        //setting specific subtopic play
        for (let i = 0; i < topics.length; i++) {
            const subTopics = topics[i].SubTopics;
            for (let j = 0; j < subTopics.length; j++) {
                const subTopic = subTopics[j];
                if (subTopicId == subTopic.SubTopicId) {
                    //need to pass topicId and subTopicId
                    if (EnumTopicType.Video == subTopic.TopicType) {
                        this.handlePlay(i, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.VideoUrl, '');
                        const video = document.getElementById("iframeVideo");
                        if (video) {
                            video.style.width = '100%';
                            video.style.height = (window.innerHeight - 20) + "px";
                        }
                    }
                    else if (EnumTopicType.Article == subTopic.TopicType)
                        this.handlePlay(i, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.Content, subTopic.IDELanguage);
                    else if (EnumTopicType.Excercise == subTopic.TopicType)
                        this.handlePlay(i, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.Content, subTopic.IDELanguage, subTopic.CodePath, subTopic.Hint, subTopic.Solution);
                    else if (EnumTopicType.Quiz == subTopic.TopicType)
                        this.handlePlay(i, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.Content, subTopic.IDELanguage);
                    else if (EnumTopicType.CodeSandbox == subTopic.TopicType)
                        this.handlePlay(i, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, '', subTopic.IDELanguage, subTopic.CodePath, '', subTopic.Solution);
                    else if (EnumTopicType.TPCodeSandbox == subTopic.TopicType)
                        this.handlePlay(i, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, '', subTopic.IDELanguage, subTopic.CodePath, '', subTopic.Solution);
                    break;
                }
            }
        }
    }

    handlePlayerPause() {
        console.log('Player paused');
    }

    handlePlayerPlay() {
        console.log('Player play');
    }

    handleSeek() {
        console.log('User is skipping video and seek to another time');
    }

    handleVideoLoad() {
        console.log('New video is loaded into player');
    }

    onPlayerError(error) {
        console.log('Error: ', error);
    }

    sideBarRowClick(event) {
        event.currentTarget.checked = !event.currentTarget.checked;
        console.log('hell', event.currentTarget.checked);
    }

    render() {
        let content = '';
        if (this.props.store.playerState.isLock && this.props.membershipId <= 0) {
            content = <Prompt userId={this.props.userId} accessibility={this.props.accessibility} membershipId={this.props.membershipId} />
        }
        //for preventing interview course access
        else if (this.props.store.playerState.isLock && (this.props.membershipId == EnumMembership.Trial || this.props.membershipId == EnumMembership.Monthly) && (this.props.courseType == EnumCourseType.QnA)) {
            content = <UpgradePrompt userId={this.props.userId} accessibility={this.props.accessibility} membershipId={this.props.membershipId} />
        }
        //for preventing project course access
        else if (this.props.store.playerState.isLock && (this.props.membershipId == EnumMembership.Trial || this.props.membershipId == EnumMembership.Monthly || this.props.membershipId == EnumMembership.Quarterly) && (this.props.courseType == EnumCourseType.Project)) {
            content = <UpgradePrompt userId={this.props.userId} accessibility={this.props.accessibility} membershipId={this.props.membershipId} />
        }
        else if (!this.state.fileDownload) {
            content = <CodePrompt userId={this.props.userId} />
        }
        else {
            switch (this.props.store.playerState.topicType) {
                case EnumTopicType.Video:
                    content = <Vimeo video={this.props.store.playerState.content} className="vimeo-video" width={'100'} height={670} autoplay={true} onPause={this.handlePlayerPause}
                        onPlay={this.handlePlayerPlay} onEnd={this.onEnded} onSeeked={this.handleSeek} onLoaded={this.handleVideoLoad} onError={this.onPlayerError} />
                    break;
                case EnumTopicType.Article:
                    content = <Article key={this.props.store.playerState.childIndex} />
                    break;
                case EnumTopicType.Excercise:
                    this.closeme();
                    content = <HandsOn key={this.props.store.playerState.childIndex} />
                    break;
                case EnumTopicType.CodeSandbox:
                    this.closeme();
                    content = <CodeSandbox key={this.props.store.playerState.childIndex} />
                    break;
                case EnumTopicType.TPCodeSandbox:
                    this.closeme();
                    content = <TPCodeSandbox key={this.props.store.playerState.childIndex} />
                    break;
                case EnumTopicType.Quiz:
                    content = <Quiz key={this.props.store.playerState.subTopicId} />
                    break;
                default:
                    console.log('Nothing found');
            }
        }
        return (
            <div className="app">
                <div className="w3-sidebar w3-bar-block w3-card-2 w3-animate-left" id="mySidebar">
                    <div className="course-heading">
                        <a href={this.props.courseUrl} style={{ color: '#fff' }} title="Go back to Course">
                            <div className="course-logo">
                                <img src={this.props.imageUrl} height="40px" />
                            </div>
                            <div className="text-middle">
                                {this.props.courseName}
                            </div>
                        </a>
                    </div>
                    <nav className="nav" role="navigation">
                        <ul className="nav__list">
                            {
                                this.props.topics.map((topic, index) => {
                                    console.log(`${index}:${this.props.store.playerState.index}`);
                                    return <li key={topic.TopicId}>
                                        <input id={"group-topic-" + topic.TopicId} type="checkbox" hidden defaultChecked={index == this.props.store.playerState.index} />
                                        <label htmlFor={"group-topic-" + topic.TopicId} className="topic">
                                            {topic.TopicName}<span className="fa fa-angle-right" /></label>
                                        <ul className={"group-list " + (index == this.props.store.playerState.index && 'list-expand')}>
                                            {
                                                topic.SubTopics.map((subTopic) => {
                                                    return <li key={subTopic.SubTopicId} className={this.props.store.playerState.childIndex == subTopic.SubTopicId ? 'topic-active' : ''}>
                                                        <input id={subTopic.SubTopicId} hidden />
                                                        <a onClick={() => {
                                                            switch (subTopic.TopicType) {
                                                                case EnumTopicType.Video: return this.handlePlay(index, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.VideoUrl, '')
                                                                case EnumTopicType.Article: return this.handlePlay(index, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.Content, subTopic.IDELanguage)
                                                                case EnumTopicType.Excercise: return this.handlePlay(index, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.Content, subTopic.IDELanguage, subTopic.CodePath, subTopic.Hint, subTopic.Solution)
                                                                case EnumTopicType.CodeSandbox: return this.handlePlay(index, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, '', subTopic.IDELanguage, subTopic.CodePath, '', subTopic.Solution)
                                                                case EnumTopicType.TPCodeSandbox: return this.handlePlay(index, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, '', subTopic.IDELanguage, subTopic.CodePath, '', subTopic.Solution)
                                                                case EnumTopicType.Quiz: return this.handlePlay(index, subTopic.SubTopicId, subTopic.IsLock, subTopic.SubTopicName, subTopic.TopicType, subTopic.IsLearnt, subTopic.IsBookmarked, subTopic.Content, '')
                                                            }
                                                        }} className="changeUrl accordion-content__row fancybox clearfix">
                                                            {(() => {
                                                                switch (subTopic.TopicType) {
                                                                    case EnumTopicType.Video: return <i className="fa fa-play-circle icon-player" aria-hidden="true" title="Video Lesson" />;
                                                                    case EnumTopicType.Article: return <i className="fa fa-book-open icon-player" aria-hidden="true" title="Article Lesson" />;
                                                                    case EnumTopicType.Excercise: return <i className="fa fa-flask icon-player" aria-hidden="true" title="Hands-on Lab" />;
                                                                    case EnumTopicType.CodeSandbox: return <i className="fa fa-code icon-player" aria-hidden="true" title="Code Sandbox" />;
                                                                    case EnumTopicType.TPCodeSandbox: return <i className="fa fa-code icon-player" aria-hidden="true" title="Code Sandbox" />;
                                                                    case EnumTopicType.Quiz: return <i className="fa fa-list-ul icon-player" aria-hidden="true" title="Quiz" />;
                                                                }
                                                            })()}

                                                            <div className="accordion-content__row__title">
                                                                <span className="topic-title">{subTopic.SubTopicName}</span>
                                                                <span title="Lesson Duration" className="duration">
                                                                    {
                                                                        (subTopic.IsLearnt) ? <i className="fas fa-check-circle" title="Viewed" style={{ color: '#23aa5a', fontSize: '12px' }}></i>
                                                                            : <i className="fas fa-dot-circle" title="Not Viewed" style={{ fontSize: '12px' }}></i>
                                                                    }&nbsp;{subTopic.Duration}
                                                                </span>
                                                            </div>
                                                            <div className="accordion-content__row__title" style={{ marginTop: '20px', fontSize: '12px' }}>
                                                                {
                                                                    (this.props.userId > 0 && this.props.membershipId != EnumMembership.Trial) && <span style={{ cursor: 'pointer' }}>
                                                                        {
                                                                            subTopic.IsBookmarked ? <span title="Remove Bookmark" onClick={() => this.setBookmark(subTopic.SubTopicId)}><i className="fas fa-bookmark" style={{ color: '#049285' }} aria-hidden="true"></i>&nbsp; Bookmark &nbsp;&nbsp;&nbsp;</span>
                                                                                : <span title="Create Bookmark" onClick={() => this.setBookmark(subTopic.SubTopicId)}><i className="far fa-bookmark" aria-hidden="true" ></i>&nbsp; Bookmark &nbsp;&nbsp;&nbsp;</span>
                                                                        }
                                                                    </span>
                                                                }
                                                                {subTopic.PdfPath && <span style={{ cursor: 'pointer' }} title="Download Slides" onClick={() => this.downloadFile(subTopic.PdfPath, subTopic.SubTopicId, 'Pdf')}>
                                                                    <i className="fa fa-file-pdf" aria-hidden="true" onClick={() => this.downloadFile(subTopic.PdfPath, subTopic.SubTopicId, 'Pdf')}></i>
                                                                    &nbsp; Pdf &nbsp;&nbsp;&nbsp;</span>
                                                                }
                                                                {
                                                                    (subTopic.CodePath || subTopic.PdfPath) && <>
                                                                        {subTopic.CodePath && <span style={{ cursor: 'pointer' }} title="Download Code" onClick={() => this.downloadFile(subTopic.CodePath, subTopic.SubTopicId, 'SourceCode')}>
                                                                            <i className="fa fa-file-code" aria-hidden="true" onClick={() => this.downloadFile(subTopic.CodePath, subTopic.SubTopicId, 'SourceCode')}> </i>
                                                                            &nbsp; Code</span>
                                                                        }
                                                                    </>
                                                                }
                                                            </div>
                                                        </a>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </li>
                                })
                            }
                        </ul>
                    </nav>
                </div>
                <div id="main">
                    <div className="w3-teal">
                        <button id="openme" onClick={this.openme} className="w3-button w3-teal w3-medium" style={{ display: 'none' }}><img src="/images/vhome.png" height="26px" /></button>
                        <button id="closeme" onClick={this.closeme} style={{ display: 'block' }} className="w3-button w3-teal w3-medium"><img src="/images/vbak.png" height="26px" /></button>
                        {
                            this.props.store.playerState.topicType != EnumTopicType.Excercise &&
                            <span className="topicheader">
                                <span>{this.props.store.playerState.topicName}</span>
                                <span style={{ float: 'right', marginRight: '330px', marginTop: '-4px' }} id="spanlogo">
                                    <img src="/images/logo.png" height="24px" />
                                    <span>
                                        {
                                            (this.setState.userId) ? <a href="/member" title="Go to Dashboard"><img src={this.setState.profileImageUrl} height="26px" style={{ marginLeft: '12px', borderRadius: '50%', border: '1px solid #fff' }} /></a>
                                                : <i className="fas fa-user-circle" title="Click to Login" style={{ color: '#fff', fontSize: '22px', marginLeft: '12px', cursor: 'pointer' }} aria-hidden="true" onClick={this.handleLogin}></i>
                                        }
                                    </span>
                                </span>
                            </span>
                        }
                    </div>
                    <div className="players" id="player1-container">
                        <div className="media-wrapper">
                            {content}
                            {(this.props.membershipId > 0 || !this.props.store.playerState.isLock) && <div className="div-controls">
                                &nbsp; <button onClick={() => this.onEnded(this.props.allSubTopics[this.state.index - 1])} className="btn-control" disabled={this.state.index === 0}>Prev</button>
                                <span>&nbsp; Lesson: {this.state.index + 1}/{this.props.allSubTopics.length} &nbsp;</span>
                                <button onClick={() => this.onEnded(this.props.allSubTopics[this.state.index + 1])} className="btn-control" disabled={this.props.allSubTopics.length === this.state.index + 1}>Next</button>
                            </div>
                            }
                        </div>
                        {this.state.isShowing ? <div className="back-drop">
                            <Modal
                                className="modal"
                                show={this.state.isShowing}
                                close={this.closeModalHandler}>
                            </Modal>
                        </div> : null
                        }
                    </div>
                </div>

            </div>
        )
    }
}
//accessing state from store
const mapStateToProps = (state, ownProps) => {
    return {
        store: state.playerState
    };
};

//mapping actions to dispatch and updating state to props
const mapDispatchToProps = (dispatch) => {
    return {
        savePlayerState: (playerState) => dispatch(playerActions.savePlayerState(playerState))
    };
};

export default connect(
    mapStateToProps, //Article
    mapDispatchToProps
)(Player);