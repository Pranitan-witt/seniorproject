import React, { Component, Fragment } from "react";
import "./issuer.css";
import { Container, Row, Col } from "reactstrap";

class Issuer extends Component {
  componentDidMount() {
    document.title = "VDegree | Issuer";
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
                  นายประณิธาน วิทยารณยุทธ ได้ส่งคำขอ
                </a>
                <br />
                <a className="list" href="#">
                  นายประณิธาน วิทยารณยุทธ ได้ส่งคำขอ
                </a>
                <br />
                <a className="list" href="#">
                  นายประณิธาน วิทยารณยุทธ ได้ส่งคำขอ
                </a>
                <br />
                <a className="list" href="#">
                  นายประณิธาน วิทยารณยุทธ ได้ส่งคำขอ
                </a>
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
