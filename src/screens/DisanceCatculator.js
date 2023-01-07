import React, {useRef} from "react";
import { Row, Col } from "react-bootstrap";
import DistanceCalculatorForm from "../components/DistanceCalculatorForm";
import DistanceCalculatorMap from "../components/DistanceCalculatorMap";

export default function DistanceCalculator() {
  const mapRef = useRef();
  return (
    <>
      <Row>
        <p className="sub-heading">
          Let's calculate <b>distance</b> from Google maps
        </p>
      </Row>
      <Row>
        <Col sm="12" md="6" lg="6">
          <DistanceCalculatorForm mapRef={mapRef} />
        </Col>
        <Col sm="6" md="6" lg="6">
          <DistanceCalculatorMap ref={mapRef} />
        </Col>
      </Row>
    </>
  );
}
