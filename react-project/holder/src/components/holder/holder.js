import React, { Component, Fragment } from "react";
import "./holder.css";
import { Container, Row, Col } from "reactstrap";
import { render } from "@testing-library/react";

class Holder extends Component {
  componentDidMount() {
    document.title = "VDegree | Holder";
  }

  render() {
    const name = ["one", "two", "three"];
    const items = [];

    for (var i = 0; i < name.length; i++) {
      items.push(
        <a className="list" href="#">
          <dt>{"นาย " + name[i] + " ได้ส่งคำขอ"}</dt>
        </a>
      );
    }

    return (
      <Fragment>
        <Container fluid>
          <Row class="justify-content-center">
            <Col xs="4" id="menu">
              <p id="menu-topic">WALLET</p>
              <div id="name-list">
                <dl>{items}</dl>
                <br />
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
