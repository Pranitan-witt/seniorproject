import React, { Component, Fragment } from "react";
import "./holder.css";
import { Container, Row, Col } from "reactstrap";
import { render } from "@testing-library/react";

class Holder extends Component {
  componentDidMount() {
    document.title = "VDegree | Holder";
  }

  data = [1, 2, 3, 4];

  render() {
    const data = this.data;
    for (var i = 0; i < data.length; i++) {
      // var test = data[i];
    }

    // console.log(data);
    return (
      <Fragment>
        <Container fluid>
          <Row class="justify-content-center">
            <Col xs="4" id="menu">
              <button onclick={this.test}></button>
              <p id="menu-topic">WALLET</p>
              <div id="name-list">
                <a className="list" href="#">
                  {data}
                </a>
                <br />
                {/* <a className="list" href="#">
                  Mock up
                </a>
                <br />
                <a className="list" href="#">
                  Mock up
                </a>
                <br />
                <a className="list" href="#">
                  Mock up
                </a>
                <br /> */}
              </div>
            </Col>
            <Col xs="8" id="content">
              <p id="content-topic">HOLDER</p>
              <div id="content-box">
                <p>
                  ชื่อ-สกุล: นายประณิธาน วิทยารณยุทธ
                  <br />
                  รายวิชา: CP463 Artificial Intelligence
                  <br />
                  ผลการเรียน: A<br />
                  Mock up
                  <br />
                  Mock up
                  <br />
                  Mock up
                  <br />
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default Holder;
