import React from 'react';
import TopNav from '../components/navigationComponents/topNav';

export default class ErrorPage extends React.Component {
    render = () => {
        return (
            <div id='error'>
                <TopNav/>
            </div>
        );
    }
}