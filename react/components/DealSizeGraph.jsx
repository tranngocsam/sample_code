import React, { PropTypes } from 'react';
import ReportPeriods from "./ReportPeriods";

export default class DealSizeGraph extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      period: undefined
    };
    _.bindAll(this, ["initializeReport"]);
  }

  initializeReport() {
    var _this = this;
    var reportData = this.props.data;
    if (reportData && reportData.data && reportData.data.length > 0) {
      this.report2 = Morris.Area({
          element: 'report_2',
          data: reportData.data,
          xkey: 'x',
          ykeys: reportData.ykeys,
          labels: reportData.labels,
          hideHover: true,
          smooth: false
      });

      this.report2.options.labels.forEach(function(label, i){
          var legendItem = $('<span></span>').css('background', _this.report2.options.lineColors[i]),
                  legendText = $('<i></i>').text(label);
          $('#report_legend_2').append(legendItem).append(legendText);
      });
    }
  }

  componentDidMount() {
    this.initializeReport();
  }

  componentDidUpdate() {
    if (this.report2) {
      this.report2.setData(this.props.data.data);
    }
  }

  render() {
    var selectedValue = this.props.selectedPeriod;
  	return (
      <div className="panel panel-report">
          <div className="title">
              <h4>Deals Size</h4>
              <div className="period">
                  <ReportPeriods changePeriod={this.props.changePeriod} periods={this.props.periods} selectedValue={selectedValue} />
              </div>
          </div>
          <div className="report" id="report_2">
          </div>
          <div className="report-legend" id="report_legend_2"></div>
      </div>
  	);
  }
}
