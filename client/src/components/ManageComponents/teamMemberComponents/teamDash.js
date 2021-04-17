import React from "react";
import { Row, Col, Table, Button, Form } from "react-bootstrap";
import Member from "./memberView";
import ManageBox from "../manageBox";
import ManageAddModal from "../manageAddModal";
import { withRouter } from "react-router-dom";
import MemberApprove from "./memberApprove";
import MemberPrivilegeEdit from "./memberPrivilegeEdit";
import { fetchWrapper } from '../../fetchWrapper';
var _ = require("lodash");

class TeamDash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberRender: [],
      showAddModal: false,
      searchedMembers: [],
      showSearched: false,
    };
  }

  componentWillMount = () => {
    this.createTeamMemberList();
  };

  async createTeamMemberList() {
    try {
      const members = await this.fetchTeamMembers();
      await this.renderTeamMembers(members);
    } catch (err) {
      console.log(err);
    }
  }

  fetchTeamMembers = async () => {
    try {
      let res = await fetchWrapper.get('/teamMember/all');
      console.log('got team')
      if (res.status == 401) {
        console.log("LOG IN REQUIRED");
        this.props.history.push("/signin");
      }
      res = await res.json();
      return await res;
    } catch (err) {
      console.log(err);
    }
  };

  renderTeamMembers = async (members) => {
    let render = [];
    if (members != null) {
      members.forEach((ele) => {
        render.push(
          <ManageBox
            labels={["First Name", "Last Name", "Email", "Subteam"]}
            values={[ele.first_name, ele.last_name, ele.email, ele.subteam_name]}
            ID={ele.member_id}
            key={ele.member_id}
            delete={this.deleteMember}
            submitEdit={this.submitEdit}
            editComponents={
              <React.Fragment>
                <MemberPrivilegeEdit member_id={ele.member_id} is_approved={ele.is_approved} is_lead={ele.is_lead} />
              </React.Fragment>
            }
          ></ManageBox>
        );
      });
    }
    this.setState({ memberRender: render });
  };

  submitEdit = async (data, ID) => {
    const requestURL = "/teamMember/" + ID;
    let body = {
      firstName: data[0],
      lastName: data[1],
      email: data[2],
      subteamName: data[3]
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

  deleteMember = (ID) => {
    const requestURL = "/teamMember/" + ID;
    fetchWrapper.delete(requestURL)
      .then(res => {
          if (res.ok) {
            for (var el in this.state.memberRender) {
              if (parseInt(this.state.memberRender[el].key) === ID) {
                let temp = this.state.memberRender;
                temp.splice(el, 1);
                this.setState({ memberRender: temp });
                break;
              }
            }
          }
      })
      .catch((err) => { console.log(err) });
  };

  search = (e) => {
    e.preventDefault();
    const text = e.target.value;
    if (text === "") {
      this.setState({ showSearched: false });
      return;
    }
    var filtered = [...this.state.memberRender];
    function filterParam(param, index, value) {
      return filtered.filter((file) => file.props[param][index].toLowerCase().includes(value.toLowerCase()));
    }
    var fNameFilter = filterParam("values", 0, text);
    var lNameFilter = filterParam("values", 1, text);
    var emailFilter = filterParam("values", 2, text);
    let temp = _.unionBy(fNameFilter, lNameFilter, "key");
    filtered = _.unionBy(temp, emailFilter, "key");
    this.setState({
      searchedFiles: filtered,
      showSearched: true,
    });
  };

  render() {
    return (
      <div id="sensorDash">
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
          <Button
            id="sortButton"
            style={{ marginLeft: "0px" }}
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
        <div id="data">{this.state.showSearched ? this.state.searchedFiles : this.state.memberRender}</div>
        <ManageAddModal
          submit={this.addSensor}
          show={this.state.showAddModal}
          toggleAddModal={this.toggleAddModal}
          labels={["First Name", "Last Name", "Email", "Subteam"]}
          title={"Add Team Member"}
        />
      </div>
    );
  }
}

export default withRouter(TeamDash);
