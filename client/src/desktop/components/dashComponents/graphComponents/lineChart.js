import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { lightningChart, emptyTick, DataPatterns, AxisScrollStrategies, SolidLine, SolidFill, ColorHEX, VisibleTicks, FontSettings, emptyLine } from '@arction/lcjs';
import '../../../styling/lineChart.css';

const theme = {
    whiteFill: new SolidFill({ color: ColorHEX('#FFFFFF') }),
    lightGrayFill: new SolidFill({ color: ColorHEX('#A0A0A0A0') }),
    darkFill: new SolidFill({ color: ColorHEX('#505050') })
}

export default class LineChart extends Component {
    constructor(props) {
        super(props)
        this.chartId = Math.trunc(Math.random() * 100000);
        this.i = 0;
        this.setupComplete = false;
        this.lineSeries = [];
        this.maxValue = 0;
        this.minValue = 0;
        this.colours = ['#C22D2D', '#0071B2', '#009E73', '#E69D00', '#CC79A7']; //Add more colours
    }

    componentDidMount = () => {
        this.createChart();
        this.getData();
    }
    componentWillUnmount = () => { this.chart.dispose(); }
    componentDidUpdate = (prevProps) => {
        if (prevProps.data !== this.props.data) this.pullData();
    }

    addLineSeries = (data, parent) => {
        let map = [];
        for (let i = 0; i < data.length; i++) map.push({ x: i + 1, y: data[i] }); //Can't get derivative of first value
        var parentIndex;
        var colour = this.colours[this.lineSeries.length];
        if (parent !== undefined) {
            parentIndex = this.props.sensors.findIndex(item => item.name === parent);
            colour = this.colours[parentIndex];
        }
        this.lineSeries.push(this.chart.addLineSeries({ dataPattern: DataPatterns.horizontalProgressive }).setName(''));
        this.lineSeries[this.lineSeries.length - 1]
            .setStrokeStyle(new SolidLine({
                thickness: 2,
                fillStyle: new SolidFill({ color: ColorHEX(colour) })
            }).setFillStyle(solidfill => solidfill.setA((parent !== undefined) ? '80' : 'FF')))
            .setMouseInteractions(false)
            .setResultTableFormatter((builder, series, Xvalue, Yvalue) => {
                return builder.addRow(Yvalue.toFixed(3) + " " + this.props.sensors[this.lineSeries.length - 1].output_unit)
            })
            .add(map.map((point) => ({ x: point.x, y: point.y })));
    }

    removeSeries = (index, parent) => {
        this.lineSeries[index].dispose();
        var temp = [];
        for (var i = 0; i < this.lineSeries.length; i++) if (i !== index) temp.push(this.lineSeries[i]);
        this.lineSeries = temp;
        let min = Math.round(this.lineSeries[parent].getYMin() * 1.1);
        let max = Math.round(this.lineSeries[parent].getYMax() * 1.1);
        if (Math.abs(min) < 1.5) min = -2;
        if (Math.abs(max) < 1.5) max = 2;
        if (min > 0) min = 0;
        this.minValue = min;
        this.maxValue = max;
        this.chart.getDefaultAxisY().setInterval(min, max);
        if (this.chart.getAxes()[2]) this.chart.getAxes()[2].setInterval(min, max);
    }

    toggleRightAxis = () => {
        if (this.chart.getAxes()[2]) {
            this.chart.getAxes()[2].dispose()
        } else {
            this.chart.addAxisY(true);
            var axis = this.chart.getAxes()[2];
            var font = new FontSettings({});
            font = font.setFamily("helvetica");
            font = font.setWeight("bold");
            axis.setTickStyle((visibleTick) =>
                visibleTick
                    .setTickStyle(emptyLine)
                    .setLabelFont(font)
                    .setLabelFillStyle(new SolidFill({ color: ColorHEX('#000') }))
                    .setGridStrokeStyle(new SolidLine({ thickness: 1, fillStyle: new SolidFill({ color: ColorHEX('#FFF') }) }))
            );
            axis.setScrollStrategy(AxisScrollStrategies.expansion)
                .setMouseInteractions(false)
                .setStrokeStyle(new SolidLine({
                    thickness: 3,
                    fillStyle: new SolidFill({ color: ColorHEX('#C8C8C8') })
                }));
            axis.setInterval(this.minValue, this.maxValue);
        }
    }

    toggleGrid = () => {
        var axis = this.chart.getDefaultAxisY();
        var font = new FontSettings({});
        font = font.setFamily("helvetica");
        font = font.setWeight("bold");
        axis.setTickStyle((visibleTick) => {
            const hideGrid = visibleTick.getGridStrokeStyle().fillStyle.color.r !== 1;
            return visibleTick
                .setTickStyle(emptyLine)
                .setLabelFont(font)
                .setLabelFillStyle(new SolidFill({ color: ColorHEX('#000') }))
                .setGridStrokeStyle(new SolidLine({ thickness: 1.5, fillStyle: new SolidFill({ color: ColorHEX(hideGrid ? '#FFF' : '#C8C8C8') }) }))
        });
    }

    createChart = () => {
        this.chart = lightningChart().ChartXY({ containerId: this.chartId })
            .setBackgroundFillStyle(theme.whiteFill)
            .setChartBackgroundFillStyle(theme.whiteFill);
        this.chart
            .setMouseInteractions(false)
            .setMouseInteractionWheelZoom(false)
            .setMouseInteractionPan(false)
            .setMouseInteractionRectangleFit(false)
            .setMouseInteractionRectangleZoom(false)
            .setMouseInteractionsWhileScrolling(false)
            .setMouseInteractionsWhileZooming(false);
        //Configure the cursor
        let autoCursor = this.chart.getAutoCursor();
        autoCursor.setGridStrokeXStyle(new SolidLine({
            thickness: 1,
            fillStyle: new SolidFill({ color: ColorHEX('#C22D2D') })
        }));
        autoCursor.setGridStrokeYStyle(new SolidLine({
            thickness: 1,
            fillStyle: new SolidFill({ color: ColorHEX('#C22D2D') })
        }));
        autoCursor.getPointMarker().setSize(0);
        autoCursor.disposeTickMarkerX();
        autoCursor.disposeTickMarkerY();
        var font = new FontSettings({});
        font = font.setFamily("helvetica");
        font = font.setWeight("bold");
        autoCursor.getResultTable().setFont(font);
        autoCursor.getResultTable().setTextFillStyle(new SolidFill({ color: ColorHEX('#FFF') }));
        autoCursor.getResultTable().getBackground().setFillStyle(new SolidFill({ color: ColorHEX('#C22D2D') }));
        //Configure the axes
        this.chart.getDefaultAxisX()
            .setScrollStrategy(AxisScrollStrategies.progressive)
            .setTickStyle(emptyTick)
            .setMouseInteractions(false)
            .setInterval(0, 300)
            .setStrokeStyle(new SolidLine({
                thickness: 3,
                fillStyle: new SolidFill({ color: ColorHEX('#C8C8C8') })
            }));
        this.chart.getDefaultAxisY()
            .setScrollStrategy(AxisScrollStrategies.expansion)
            .setMouseInteractions(false)
            .setStrokeStyle(new SolidLine({
                thickness: 3,
                fillStyle: new SolidFill({ color: ColorHEX('#C8C8C8') })
            }));
        var axis = this.chart.getDefaultAxisY();
        var font = new FontSettings({});
        font = font.setFamily("helvetica");
        font = font.setWeight("bold");
        axis.setTickStyle((visibleTick) =>
            visibleTick
                .setTickStyle(emptyLine)
                .setLabelFont(font)
                .setLabelFillStyle(new SolidFill({ color: ColorHEX('#000') }))
                .setGridStrokeStyle(new SolidLine({ thickness: 1.5, fillStyle: new SolidFill({ color: ColorHEX('#FFF') }) }))
        );
        //Configure the line series
        for (var i = 0; i < this.props.sensors.length; i++) {
            this.lineSeries.push(this.chart.addLineSeries({ dataPattern: DataPatterns.horizontalProgressive }).setName(''));
            this.lineSeries[i]
                .setStrokeStyle(new SolidLine({
                    thickness: 2,
                    fillStyle: new SolidFill({ color: ColorHEX(this.colours[i]) })
                }))
                .setMouseInteractions(false)
                .setResultTableFormatter((builder, series, Xvalue, Yvalue) => {
                    return builder
                        .addRow(Yvalue.toFixed(3) + ' ' + this.props.sensors[0].output_unit)
                });
        }
        //Don't allow scrolling
        this.chart.engine.container.onwheel = null;
        this.setupComplete = true;
    }

    changeInterval = (lower, upper) => { this.chart.getDefaultAxisX().setInterval(lower, upper) }

    getData = () => {
        //Get all available data here
    }

    pullData = () => {
        let data = this.props.data;
        if (data === undefined) return;
        if (data.length === 0) return;
        if (this.setupComplete) {
            //Set the interval
            var setInterval = false;
            for (i in data) {
                if (data[i] > this.maxValue) {
                    this.maxValue = data[i];
                    setInterval = true;
                }
            }
            for (i in data) {
                if (data[i] < this.minValue) {
                    this.minValue = data[i];
                    setInterval = true;
                }
            }
            if (setInterval) {
                let min = Math.floor(this.minValue * 1.2);
                let max = Math.ceil(this.maxValue * 1.2);
                if (this.props.sensors[0].category === 'Acceleration') max = 2;
                this.minValue = min;
                this.maxValue = max;
                this.chart.getDefaultAxisY().setInterval(min, max);
                if (this.chart.getAxes()[2]) this.chart.getAxes()[2].setInterval(min, max);
            }
            //Add the data
            if (data.length === 1) this.lineSeries[0].add({ x: this.i, y: data[0] });
            else {
                var i = 0;
                while (i < this.lineSeries.length) {
                    this.lineSeries[i].add({ x: this.i, y: data[i] });
                    i++;
                }
            }
            this.i++;
        }
    }

    render() {
        //Just to shorten the code a bit
        let data = this.props.data;
        let sensors = this.props.sensors;
        let content = [];
        //Make all of the columns for displaying current values
        for (const sensor in sensors) {
            if (sensors[sensor].derivative) continue;
            const derivative = sensors.filter(item => item.name === sensors[sensor].name + "'" && item.derivative);
            content.push(
                <div class='col' style={{ textAlign: 'center', padding: '0', paddingBottom: '3px'}}>
                    <div class='row' style={{ textAlign: 'center', width: '100%', padding: '0', margin: '0' }}>
                        <div class='col' style={{ color: this.colours[sensor], fontStyle: 'bold', textAlign: 'right', padding: '0', fontSize: '1rem' }}>
                            <Button id='derivativeButton' onClick={() => { this.props.controlDerivative(sensors[sensor].name) }}><b style={{ fontStyle: 'italic', fontSize: '1rem' }}>f'(x)</b></Button>
                            <b style={{ fontSize: '1rem', verticalAlign: 'middle' }}>{sensors[sensor].name}:</b>
                        </div>
                        <div class='col-xs' style={{ fontStyle: 'bold', textAlign: 'center', padding: '0', fontSize: '1rem', width: '100px' }}><b style={{ verticalAlign: 'middle' }}>{(data === undefined) ? '0' : data[sensor]}</b></div>
                        <div class='col' style={{ fontStyle: 'bold', textAlign: 'left', padding: '0', fontSize: '1rem' }}><b style={{ verticalAlign: 'middle' }}>{sensors[0].output_unit}</b></div>
                    </div>
                    {derivative.length !== 0 ?
                        <div class='row' style={{ textAlign: 'center', width: '100%', padding: '0', margin: '0', marginTop: '10px' }}>
                            <div class='col' style={{ color: this.colours[sensor] + '80', fontStyle: 'bold', textAlign: 'right', padding: '0', fontSize: '1rem' }}><b>{derivative[0].name}:</b></div>
                            <div class='col-xs' style={{ fontStyle: 'bold', textAlign: 'center', padding: '0', fontSize: '1rem', width: '100px' }}><b>{(data === undefined) ? '0' : (data[sensor] * 10).toFixed(2)}</b></div>
                            <div class='col' style={{ fontStyle: 'bold', textAlign: 'left', padding: '0' }}>
                                <b>
                                    {!sensors[sensor].output_unit.includes('/sec') ? derivative[0].output_unit : <span>{sensors[sensor].output_unit}<sup>2</sup></span>}
                                </b>
                            </div>
                        </div>
                        :
                        null
                    }
                </div>
            );
        }
        return (
            <div style={{ marginBottom: '20px' }}>
                <div class='row' style={{ textAlign: 'center', fontSize: '1rem', fontStyle: 'bold', paddingTop: '0', paddingBottom: '0', marginBottom: '0px', marginTop: '10px', marginRight: '0', marginLeft: '0', width: '100%' }}>
                    {content}
                </div>
                <div id={this.chartId} className='fill' style={{ height: '500px' }}></div>
            </div>
        );
    }
}