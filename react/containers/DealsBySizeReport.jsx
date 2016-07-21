import React, { PropTypes } from 'react';
import {connect} from "react-redux";
import DealSizeGraph from "../components/ReportView/DealSizeGraph"
import {loadDealsBySize} from "../actions/doxlyActions";
import Util from "../utils/util";

class DealsBySizeReport extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedPeriod: undefined
    };
    _.bindAll(this, ["changePeriod", "getSelectedPeriod"]);
  }

  getSelectedPeriod() {
    var selectedPeriod = this.state.selectedPeriod;
    if (!selectedPeriod) {
      let period = this.props.periods[0];
      selectedPeriod = Object.keys(period)[0];
    }

    return selectedPeriod;
  }

  changePeriod(period) {
    this.setState({selectedPeriod: period});
    this.props.loadDealsBySize(period);
  }

  componentWillMount() {
    var selectedPeriod = this.getSelectedPeriod();

    this.props.loadDealsBySize(selectedPeriod);
  }

  render() {
    if (!this.props.data) {
      return (<div className="is-loading">Loading, please wait...</div>);
    } else {
      return (<DealSizeGraph data={this.props.data}
                             periods={this.props.periods}
                             changePeriod={this.changePeriod}
                             selectedPeriod={this.state.selectedPeriod} />);
    }
  }
}

DealsBySizeReport.propTypes = {
  data: PropTypes.object,
  periods: PropTypes.arrayOf(PropTypes.object),
  loadDealsBySizeStatus: PropTypes.string,
  loadDealsBySize: PropTypes.func.isRequired
}

function stateToProps(state, ownProps) {
  let reportStore = state.reportStore;
  let props = {};

  if (reportStore && reportStore.dealsBySize) {
    let data = reportStore.dealsBySize.data;
    props.data = Util.getReportData("size", data);
    props.loadDealsBySizeStatus = reportStore.status;
  }

  return props;
}

DealsBySizeReport = connect(stateToProps, {
  loadDealsBySize
})(DealsBySizeReport);

export default DealsBySizeReport;
