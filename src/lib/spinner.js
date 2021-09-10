import React from "react";
import { promiseTrackerHoc } from "react-promise-tracker";
import Loader from "react-loader-spinner";

const SpinnerInner = (props) =>
    props.promiseInProgress && (
        <div className="spinner">
            <div style={{ height: '200px' }}></div>
            <Loader type="Oval" color="#fff" height={80} width={80} />
        </div>
    )

const Spinner = promiseTrackerHoc(SpinnerInner);
export default Spinner;