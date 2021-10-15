import React from 'react';
import Loader from "react-loader-spinner";

export default function Loading(props) {
    if (props.isLoading) {
        if (props.timedOut) {
            return <div>Loader timed out!</div>;
        } else if (props.pastDelay) {
            return <div className="spinner">
                <div style={{ height: '200px' }}></div>
                <Loader type="Oval" color="#fff" height={36} width={36} />
            </div>;
        } else {
            return null;
        }
    } else if (props.error) {
        return <div>Error! Component failed to load</div>;
    } else {
        return null;
    }
}