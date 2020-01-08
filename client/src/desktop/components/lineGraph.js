import React from 'react';
import { Line } from 'react-chartjs-2';

export default class LineGraph extends React.Component {
    constructor(props) {
        super(props);
        this.lineGraph = React.createRef();
        this.state = {
            data: this.props.data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scaleShowGridlines: false,
                scaleShowHorizontalLines: false,
                scaleShowVerticalLines: false,
                animation: {
                    duration: 0
                },
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        realtime: {
                            onRefresh: function (chart) { },
                        },
                        gridLines: {
                            display: false,
                            lineWidth: 1,
                            zeroLineWidth: 2,
                            drawTicks: false,
                            color: '#494949'
                        },
                        ticks: {
                            display: false,
                            maxRotation: 0,
                            minRotation: 0,
                            padding: 15,
                            maxTicksLimit: 10,
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false,
                            lineWidth: 1,
                            zeroLineWidth: 0,
                            drawTicks: false,
                            color: '#494949'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: this.props.title,
                            fontSize: 15,
                            fontStyle: 'bold',
                            fontColor: '#494949'
                        },
                        ticks: {
                            beginAtZero: true,
                            padding: 15,
                            fontSize: 15,
                            fontStyle: 'bold',
                            fontColor: '#494949'
                        }
                    }]
                }
            },
        }
    }

    render = () => {
        return (
            <article id="graph" style={{height: '500px', marginTop: '40px', marginLeft: '20px', marginRight: '20px', marginBottom:'100px'}}>
                <p style={{textAlign: 'center', fontSize: '1.4rem', paddingTop: '0', paddingBottom: '0', marginBottom: '10px', marginTop: '-40px'}}>
                    <b>{this.state.data.datasets[0].data[this.state.data.datasets[0].data.length - 1]}&nbsp;{this.props.units}</b>
                </p>
                <Line id={this.props.id} data={this.state.data} options={this.state.options} ref={this.lineGraph} redraw={true}/>
            </article>
        );
    }
}