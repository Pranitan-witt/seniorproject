import React, { Component, Fragment } from "react";
import "./home.css";
import { Container, Row, Col } from "reactstrap";

class Home extends Component {
  render() {
    return (
      <Fragment>
        <Container fluid>
          <Row class="justify-content-center">
            <div id="top">
              <h1>VDGREE</h1>
            </div>
            <div id="middle"></div>
            <div id="buttom">
              <button>เริ่มใช้งานระบบ</button>
            </div>
          </Row>
        </Container>
      </Fragment>

      // <div id="home" class="container-fluid">
      //     <div class="row justify-content-center">
      //         <div id="top" class="col-sm-4">
      //             <h1>VDGREE</h1>
      //         </div>
      //         <div id="middle"></div>
      //         <div id="buttom">
      //             <button>เริ่มใช้งานระบบ</button>
      //         </div>
      //     </div>
      // </div>
    );
  }
}

export default Home;
