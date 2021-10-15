import React from "react";
import { connect } from "react-redux";
import CourseService from "./services/course.service";
import Answers from './components/answers';

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            total: 0,
            index: 0,
            showButton: false,
            questionAnswered: false,
            score: 0,
            displayPopup: 'block',
            start: false
        }
        this.nextQuestion = this.nextQuestion.bind(this);
        this.handleShowButton = this.handleShowButton.bind(this);
        this.handleStartQuiz = this.handleStartQuiz.bind(this);
        this.handleReStartQuiz = this.handleReStartQuiz.bind(this);
        this.handleIncreaseScore = this.handleIncreaseScore.bind(this);
    }

    componentDidMount() {
        let id = this.props.playerStore.playerState.subTopicId;
        if (id != undefined) {
            CourseService.GetQuizQuestions(id).then(res => {
                this.setState({
                    id: id,
                    data: res,
                    total: res.length
                });
                let { index } = this.state;
                this.pushData(index);
            });
        }
    }

    handleStartQuiz() {
        this.setState({
            displayPopup: 'none',
            start: true
        });
    }
    handleReStartQuiz() {
        this.setState({
            index: 0,
            showButton: false,
            questionAnswered: false,
            score: 0,
            displayPopup: 'block',
            start: false
        }, () => {
            this.pushData(0);
        });
    }
    pushData(index) {
        if (this.state.data.length > 0) {
            this.setState({
                question: this.state.data[index].Question,
                code: this.state.data[index].Code,
                answers: this.state.data[index].Answers,
                correct: this.state.data[index].Correct,
                index: this.state.index + 1
            });
        }
    }

    nextQuestion() {
        let { index, total, score } = this.state;
        if (index === total) {
            this.setState({
                index: index + 1,
                displayPopup: 'block'
            });
        } else {
            this.pushData(index);
            this.setState({
                showButton: false,
                questionAnswered: false
            });
        }
    }

    handleShowButton() {
        this.setState({
            showButton: true,
            questionAnswered: true
        })
    }

    handleIncreaseScore() {
        this.setState({
            score: this.state.score + 1
        });
    }

    render() {
        let { index, total, question, code, answers, correct, showButton, questionAnswered, displayPopup, score } = this.state;
        return (
            <div className="article" style={{ height: '100vh', padding: '45px 20px' }}>
                {
                    (this.state.start == true && this.state.index <= this.state.total && this.state.total > 0) &&
                    <div className="row">
                        <div className="col-lg-10 col-lg-offset-1">
                            <div style={{ textAlign: 'center' }}>
                                <span className="question-label">Question {index}/{total}</span>
                            </div>
                            <div id="question">
                                <p style={{ lineHeight: '30px', marginTop: '10px' }}>Q{index}. {question}</p>
                                {
                                    code != null && <pre className="prettyprint linenums">{code}</pre>
                                }
                            </div>
                            <Answers answers={answers} correct={correct} showButton={this.handleShowButton} isAnswered={questionAnswered} increaseScore={this.handleIncreaseScore} />
                            <div className="submit">
                                {showButton ? <button className="fancy-btn" onClick={this.nextQuestion} >{index === total ? 'Finish quiz' : 'Next question'}</button> : null}
                            </div>
                        </div>
                    </div>
                }
                <div style={{ display: displayPopup }}>
                    <div className="row">
                        <div className="col-lg-10 col-lg-offset-1">
                            {
                                this.state.start == false && <div>
                                    <div id="question" style={{ textAlign: 'center' }}>
                                        <h1 style={{ letterSpacing: '2px' }}>Welcome to Study Mode Quiz!</h1>
                                        <p>Check you learning progress and evaluate what you have learned so far.</p>
                                        <div className="quiz-text">
                                            <h3>Study Mode Quiz Instructions</h3>
                                            <ul className="quizlist">
                                                <li>Each question contains 2 or 4 or 5 potential answers to choose from, only one answer is correct.</li>
                                                <li>For each right answer you will get 1 mark.</li>
                                                <li>It is best to take this quiz in an environment where you will not be disturbed.</li>
                                                <li>The study mode quiz will begin on the next screen.</li>
                                            </ul>
                                            <p><strong>All the best !!</strong></p>
                                        </div>
                                    </div>
                                    <div className="submit" style={{ marginTop: '20px' }}>
                                        <button className="fancy-btn" onClick={this.handleStartQuiz} >Start Quiz</button>
                                    </div>
                                </div>
                            }

                            {
                                (this.state.start == true && this.state.index > 0) && <div id="question" style={{ textAlign: 'center' }}>
                                    <h1 style={{ letterSpacing: '2px' }}>Congratulations!</h1>
                                    <p>You have successfully completed the quiz.</p>
                                    <p className="quiz-text" style={{ marginTop: '10px' }}>You have scored <strong> {score} </strong> out of <strong>{total}</strong>.</p>
                                    {
                                        score < total && <div><h2 style={{ letterSpacing: '2px' }}>Not satisfied with your performance!</h2>
                                            <div className="submit" style={{ marginTop: '20px' }}>
                                                <button className="fancy-btn" onClick={this.handleReStartQuiz} >Restart Quiz</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//accessing state from playerStore
const mapStateToProps = (state, ownProps) => {
    return {
        playerStore: state.playerState
    };
};

export default connect(
    mapStateToProps
)(Quiz);
