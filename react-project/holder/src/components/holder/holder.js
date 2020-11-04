import React, { Component, Fragment } from 'react';
import './holder.css'
import { Container, Row, Col } from 'reactstrap';

class Holder extends Component {
  render() {
    return (
      <Fragment>
        <Container fluid>
            <Row class="justify-content-center">
                <Col xs="4" id="menu">
                  {/* <p id="menu-topic">WALLET</p> */}
                  <p id="menu-topic">WALLET</p>
                  <div id="name-list">
                    <a className="list" href="#">Mock up</a><br/>
                    <a className="list" href="#">Mock up</a><br/>
                    <a className="list" href="#">Mock up</a><br/>
                    <a className="list" href="#">Mock up</a><br/>
                  </div>
                </Col>
                <Col xs="8" id="content">
                  <p id="content-topic">HOLDER</p>
                  <div id="content-box">
                    <p>
                      ชื่อ-สกุล: นายประณิธาน วิทยารณยุทธ<br/>
                      รายวิชา: CP463 Artificial Intelligence<br/>
                      ผลการเรียน: A<br/>
                      Mock up<br/>
                      Mock up<br/>
                      Mock up<br/>
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