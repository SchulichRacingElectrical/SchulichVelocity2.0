import React from 'react';
import SideNavM from '../components/navigationComponents/sideNavM';
import StreamingContent from '../components/streamingComponentsM/streamingContentM';
import Settings from '../components/settingsComponentsM/settingsM';

export default class StreamingPageM extends React.Component {
    render = () => {
        return (
            <div id='streamingPage' style={{height: '100%'}}>
                <SideNavM/>

            </div>
        );
    }
}