import React from 'react';

class Answers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAnswered: false,
            classNames: ['', '', '', '', '']
        }
        this.checkAnswer = this.checkAnswer.bind(this);
    }

    checkAnswer(e) {
        let { isAnswered} = this.props;

        if (!isAnswered) {
            let elem = e.currentTarget;
            let { correct, increaseScore } = this.props;
            let index = Number(elem.dataset.id);
            let answer = elem.dataset.answer;

            let updatedClassNames = this.state.classNames;

            if (answer === correct) {
                updatedClassNames[index] = 'right';
                increaseScore();
            }
            else {
                updatedClassNames[index] = 'wrong';
            }

            this.setState({
                classNames: updatedClassNames
            })

            this.props.showButton();
        }
    }

    componentWillReceiveProps(props) {
        if (this.props.isAnswered) {
            this.setState({
                classNames: ['', '', '', '', '']
            });
        }
        return true;
    }

    render() {
        let { answers } = this.props;
        let { classNames } = this.state;
        return (
            <div id="answers">
                <ul>
                    {
                        (answers != undefined && answers.length) > 0 && answers.map((item, index) => {
                            return <li key={index} onClick={this.checkAnswer} className={classNames[index]}
                                data-id={index} data-answer={item.Option}>
                                <span>{item.Option}</span>
                                <p>{item.Answer}</p>
                            </li>
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default Answers