import React from 'react';
import GraphBoxM from '../dashComponentsM/plottingDash/graphBoxM';

export default class DataPageM extends React.Component {
    render = () => {
        return (
            <div id='streamingData' style={{marginTop: '15px'}}>
                <GraphBoxM title={this.props.content}/>
            </div>
        );
    }
}