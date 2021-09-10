import React from "react";
import Player from './player'
import CourseService from "./services/course.service";
import { trackPromise } from 'react-promise-tracker';
import CryptoJS from 'crypto-js';
export default class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accessibility: 0,
            membershipId: 0,
            courseId: 0,
            courseUrl: '',
            subTopicId: 0,
            topics: [],
            allSubTopics: [],
            courseName: '',
            courseType:0,
            imageUrl: '',
            userId: 0
        }
    }
    componentDidMount() {
        sessionStorage.setItem('c_id', 0);
        sessionStorage.setItem('a_subt', '');
        trackPromise(
            CourseService.GetCourseDetails().then(res => {
                if (res != '') {
                    //console.log(res);
                    //setting subtopics
                    let encSubTopics = JSON.stringify(res.AllSubTopics);
                    //base64
                    let wordArray = CryptoJS.enc.Utf8.parse(encSubTopics);
                    let data = CryptoJS.enc.Base64.stringify(wordArray);

                    sessionStorage.setItem('c_id', res.CourseId);
                    sessionStorage.setItem('a_subt', data);
                    this.setState({
                        accessibility: res.Accessibility,
                        courseUrl: res.CourseUrl,
                        membershipId: res.MembershipId,
                        courseId: res.CourseId,
                        courseName: res.Name,
                        courseType:res.CourseType,
                        topics: res.Topics,
                        allSubTopics: res.AllSubTopics,
                        subTopicId: res.SubTopicId,
                        userId: res.UserId,
                        imageUrl: res.ImageUrl,
                        profileImageUrl: res.ProfileImageUrl
                    });
                }
            }).catch(err => {
                console.log(err);
            }));
    }

    onClickTopic = newEntity => {
        CourseService.SetLearningProgress(newEntity).then(res => {
            //console.log('Saved Learning progress');
        }).catch(err => {
            console.log(err);
        });
    };

    render() {
        return (
            <Player accessibility={this.state.accessibility}
                membershipId={this.state.membershipId}
                subTopicId={this.state.subTopicId}
                topics={this.state.topics}
                allSubTopics={this.state.allSubTopics}
                courseId={this.state.courseId}
                courseUrl={this.state.courseUrl}
                courseName={this.state.courseName}
                courseType={this.state.courseType}
                imageUrl={this.state.imageUrl}
                userId={this.state.userId}
                profileImageUrl={this.state.profileImageUrl} />
        )
    }
}