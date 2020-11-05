import React, { Component, Fragment } from "react";
import "./verifier.css";
import { Container, Row, Col } from "reactstrap";

class Verifier extends Component {
  componentDidMount() {
    document.title = "VDegree | Verifier";
  }

  render() {
    return (
      <Fragment>
        <Container fluid>
          <Row class="justify-content-center">
            <Col xs="4" id="menu">
              <p id="menu-topic">INBOX</p>
              <div id="name-list">
                <a className="list" href="#">
                  นายประณิธาน วิทยารณยุทธ รอตรวจสอบ
                </a>
                <br />
                <a className="list" href="#">
                  นายประณิธาน วิทยารณยุทธ รอตรวจสอบ
                </a>
                <br />
                <a className="list" href="#">
                  นายประณิธาน วิทยารณยุทธ รอตรวจสอบ
                </a>
                <br />
                <a className="list" href="#">
                  นายประณิธาน วิทยารณยุทธ รอตรวจสอบ
                </a>
                <br />
              </div>
            </Col>
            <Col xs="8" id="content">
              <p id="content-topic">VERIFIER</p>
              <div id="content-box">
                <p>
                  นายประณิธาน วิท.. รอตรวจสอบ
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

export default Verifier;
