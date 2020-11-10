import React, { Component, Fragment } from "react";
import "./issuer.css";
import { Container, Row, Col } from "reactstrap";

class Issuer extends Component {
  componentDidMount() {
    document.title = "VDegree | Issuer";
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
              <p id="menu-topic">INBOX</p>
              <div id="name-list">
                <dl>{items}</dl>
                <br />
              </div>
            </Col>
            <Col xs="8" id="content">
              <p id="content-topic">ISSUER</p>
              <div id="content-box">
                <p>
                  นายประณิธาน วิท.. ได้ส่งคำขอ
                  <br />
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

export default Issuer;
