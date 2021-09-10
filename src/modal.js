import React, { Component } from 'react'
import CourseService from './services/course.service';

export default class modal extends Component {
    formFields = {
        email: '',
        password: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            formFields: this.formFields,
            errors: {},
            error: ''
        };
    }
    handleChange = (event) => {
        let formFields = this.state.formFields;
        formFields[event.target.name] = event.target.value;
        this.setState({
            formFields
        });

        this.validateControl(event.target.name);
    };

    validateControl(control) {
        if (this.state.formFields[control] != '') {
            this.state.errors[control] = '';
        }
        else {
            this.state.errors[control] = "please enter your " + control;
        }

        //email
        if (control == 'email' && this.state.formFields[control] != '') {
            if (!this.state.formFields["email"].match(/.+@.+\../)) {
                this.state.errors["email"] = "please enter correct email";
            }
        }
    }

    // To validate all form fields
    validateForm() {
        let formFields = this.state.formFields;
        let errors = {};
        let IsValid = true;

        if (!formFields["email"]) {
            IsValid = false;
            errors["email"] = "please enter your email";
        }
        else if (!formFields["email"].match(/.+@.+\../)) {
            IsValid = false;
            errors["email"] = "please enter correct email";
        }

        if (!formFields["password"]) {
            IsValid = false;
            errors["password"] = "please enter your password";
        }

        this.setState({
            errors: errors
        });
        return IsValid;
    }

    // When user submits the form after validation
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.validateForm()) {
            //console.log('Form value: ', this.state.formFields);
            CourseService.LoginUser(this.state.formFields).then(res => {
               // console.log(res);
                if (res == 'success')
                    window.location.reload();
                else
                    this.setState({
                        error: 'email or password is incorrect!'
                    });
            });
        }
    }
    render() {
        return (
            <div className="modal-wrapper">
                <div className="modal-header">
                    <span className="close-modal-btn" onClick={this.props.close}>×</span>
                </div>
                <div className="modal-body">
                    <img src="/images/dnt-bg-d.png" width={60} />
                    <h3 style={{ marginTop: 10, fontSize: '24px'}}>Log In</h3>
                    <form onSubmit={this.handleSubmit}>
                        {this.state.error &&
                            <div className="text-danger">
                                {this.state.error}
                            </div>
                        }
                        <div>
                            <input type="text" className="input" placeholder="Email*" name="email" value={this.state.formFields.email} onChange={this.handleChange} />
                            {this.state.errors.email &&
                                <div className="text-danger">
                                    {this.state.errors.email}
                                </div>
                            }
                        </div>
                        <div>
                            <input type="password" className="input" placeholder="Password*" name="password" value={this.state.formFields.password} onChange={this.handleChange} />
                            {this.state.errors.password &&
                                <div className="text-danger">
                                    {this.state.errors.password}
                                </div>
                            }
                        </div>
                        <div style={{ marginTop: '5px', marginBottom: '10px' }}>
                            <button type="submit" className="btn btn-info btn-block">Login</button>
                        </div>
                    </form>
                    <div>
                    <a href="/forgot-password" style={{ padding: '0 2px', color: '#4285f4' }}>Forgot Password?</a>  Don't have an account yet? <a href="/member-registration" style={{ padding: '0 2px', color: '#4285f4' }}>Create an account</a>
                    </div>
                    <br />
                </div>
            </div>
        )
    }
}

