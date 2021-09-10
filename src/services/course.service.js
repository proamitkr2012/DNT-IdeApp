import axios from "axios";

const baseAddress = window.location.origin.indexOf('3000') > -1 ? 'https://localhost:44383' : window.location.origin;

class CourseService {
    GetCourseDetails = () => {
        return axios.get(baseAddress + '/player/data').then((res) => {
            return res.data;
        }).catch(err => {
            console.log('error', err);
        });
    }
    GetQuizQuestions = (id) => {
        return axios.get(baseAddress + '/api/DNTService/GetStudyModeQuizQuestions/' + id).then((res) => {
            return res.data;
        }).catch(err => {
            console.log('error', err);
        });
    }
    LoginUser(model) {
        var token = document.getElementById('RequestVerificationToken').value;
        axios.defaults.headers.common['RequestVerificationToken'] = token;
        return axios.post(baseAddress + '/account/userlogin',
            model).then((res) => {
                if (res.data !== '') {
                    return res.data;
                } else {
                    return undefined;
                }
            })
            .catch(err => {
                console.log('error', err);
            });
    }
    SetLearningProgress = (entity) => {
        var urlPath = baseAddress + '/LearningProgress/insert/' + entity.CourseId + '/' + entity.TopicId + '/' + entity.TopicType;
        return axios.get(urlPath).then((res) => {
            return res.data;
        }).catch(err => {
            console.log('error', err);
        });
    }

    SetBookmark = (courseId, subTopicId) => {
        return axios.get(baseAddress + '/Bookmark/SetBookmarks?courseId=' + courseId + '&subTopicId=' + subTopicId).then(
            (res) => {
                return res.data;
            }).catch(err => {
                console.log('error', err);
        });
    }

    SetContentHistory = (url, courseId, topicId, subTopicId, contentType) => {       
        return axios.get(baseAddress + '/contentDownloadHistory?courseId=' + courseId + '&topicId=' + topicId + '&subTopicId=' + subTopicId + '&contentType=' + contentType + '&url=' + url).then(
            (res) => {
                return res.data;
            }).catch(err => {
                console.log('error', err);
            });
    }
}

//singleton obejct
const service = new CourseService();
export default service;