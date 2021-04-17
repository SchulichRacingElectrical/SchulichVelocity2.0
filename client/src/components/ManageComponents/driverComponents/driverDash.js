import React from "react";
import ManageBox from "../manageBox";
import ManageAddModal from "../manageAddModal";
import { Row, Col, Button, Form } from "react-bootstrap";
import "./driverDash.css";
import { fetchWrapper } from '../../fetchWrapper';
var _ = require("lodash");

class DriverDash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      driverRender: [],
      showAddModal: false,
      searchedDrivers: [],
      showSearched: false,
    };
  }

  componentWillMount = () => {
    this.createDriverList();
  };

  createDriverList = async () => {
    try {
      const drivers = await this.fetchDrivers();
      await this.renderDriverTable(drivers);
      this.forceUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  fetchDrivers = async () => {
    try {
      const requesturl = "/driver/";
      let res = await fetchWrapper.get(requesturl);
      if (res.status == 401) {
        console.log("LOG IN REQUIRED");
        this.props.history.push("/signin");
      }
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  renderDriverTable = (drivers) => {
    let render = [];
    if (drivers != null) {
      drivers.forEach((ele) => {
        render.push(
          <ManageBox
            labels={["First Name", "Last Name"]}
            values={[ele.first_name, ele.last_name]}
            ID={ele.driver_id}
            key={ele.driver_id}
            delete={this.deleteDriver}
            submitEdit={this.submitEdit}
          />
        );
      });
    }
    this.setState({ driverRender: render });
  };

  addDriver = async (data) => {
    const requestURL = "/driver/";
    let body = {
      firstName: data[0],
      lastName: data[1]
    }
    fetchWrapper.post(requestURL, body)
      .then(res => {
        if(!res.ok){ return; }
        else{
          let box = (
            <ManageBox
              labels={["First Name", "Last Name"]}
              values={[data[0], data[1]]}
              ID={res.ID}
              key={res.ID}
              delete={this.deleteDriver}
              submitEdit={this.submitEdit}
            />
          );
          let temp = this.state.driverRender;
          temp.push(box);
          this.setState({ sensorRender: temp });
        }
      })
      .catch(err => { console.log(err) });
  };

  submitEdit = async (data, ID) => {
    const requestURL = "/driver/" + ID;
    let body = {
      firstName: data[0],
      lastName: data[1]
    }
    return fetchWrapper.put(requestURL, body)
      .then(res => {
        if(res.ok) { return true; }
        else{ return false; }
      })
      .catch(err => { 
        console.log(err); 
        return false; 
      });
  };

  deleteDriver = (ID) => {
    const requestURL = "/driver/" + ID;
    fetchWrapper.delete(requestURL)
      .then(res => {
        if(res.ok){
          for(var el in this.state.driverRender){
            if (parseInt(this.state.driverRender[el].key) === ID) {
              let temp = this.state.driverRender;
              temp.splice(el, 1);
              this.setState({ driverRender: temp });
              break;
            }
          }
        }
      })
      .catch(err => { console.log(err) });
  };

  toggleAddModal = () => {
    this.setState({ showAddModal: !this.state.showAddModal });
  };

  search = (e) => {
    e.preventDefault();
    const text = e.target.value;
    if (text === "") {
      this.setState({ showSearched: false });
      return;
    }
    var filtered = [...this.state.driverRender];

    function filterParam(param, index, value) {
      return filtered.filter((file) => file.props[param][index].toLowerCase().includes(value.toLowerCase()));
    }

    var fNameFilter = filterParam("values", 0, text);
    var lNameFilter = filterParam("values", 1, text);
    filtered = _.unionBy(fNameFilter, lNameFilter, "key");
    this.setState({
      searchedFiles: filtered,
      showSearched: true,
    });
  };

  render() {
    return (
      <div id="driverDash">
        <div
          id="top"
          style={{
            position: "fixed",
            top: "56px",
            right: "0",
            left: "0",
            zIndex: "999",
            height: "56px",
            paddingLeft: "calc(" + this.props.marginLeft + " + 10px)",
            paddingTop: "10px",
            background: "#F5F5F5",
            borderColor: "#C22D2D",
            borderWidth: "0",
            borderBottomWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <Button id="uploadButton" onClick={this.toggleAddModal}>
            <b>Add</b>
          </Button>
          &nbsp;&nbsp;
          <Button
            id="sortButton"
            onClick={this.changeType}
            disabled={this.state.typeOption === "plotting" ? true : false}
          >
            <b>Sort Data</b>
          </Button>
          &nbsp;&nbsp;
          <Form className="searchForm" style={{ position: "absolute", top: "10px", right: "10px" }}>
            <Form.Control
              onChange={this.search}
              className="searchFormControl"
              ref={this.emailForm}
              autoComplete="on"
              placeHolder="Search"
              required
            />
          </Form>
        </div>
        <div id="data">{this.state.showSearched ? this.state.searchedDrivers : this.state.driverRender}</div>
        <ManageAddModal
          submit={this.addDriver}
          show={this.state.showAddModal}
          toggleAddModal={this.toggleAddModal}
          labels={["First Name", "Last Name"]}
          title={"Add Driver"}
        />
      </div>
    );
  }
}

export default DriverDash;
