import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Spinner,
  InputGroup,
  Alert,
} from "react-bootstrap";
import {
  PlusCircle,
  CircleFill,
  RecordCircleFill,
  GeoAltFill,
  Trash,
} from "react-bootstrap-icons";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

export default function DistanceCalculatorForm(props) {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [waypoints, setWaypoints] = useState([""]);
  const [mapRoute, setMapRoute] = useState(null);
  const [mapRouteError, setMapRouteError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <Spinner animation="border" variant="primary" />;
  }

  const calculateRoute = async () => {
    let ways = [];
    waypoints.forEach((point) => {
      let place = point.getPlace();
      if (place !== undefined && place !== "") {
        ways.push({
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        });
      }
    });

    if (
      origin === null ||
      destination == null ||
      origin.getPlace() === undefined ||
      destination.getPlace() === undefined
    ) {
      return;
    }

    let result = await props.mapRef.current.calculateRoute(
      origin.getPlace().name,
      destination.getPlace().name,
      ways
    );
    if (result.error) {
      setMapRouteError(result.data);
      setMapRoute(null);
    } else {
      setMapRoute(result.data);
      setMapRouteError(null);
    }
  };

  const setWayPoint = (autocomplete, index) => {
    let ways = [...waypoints];
    ways[index] = autocomplete;
    setWaypoints(ways);
  };

  const addWayPoint = () => {
    setWaypoints([...waypoints, ""]);
  };

  const removeWayPoint = (index) => {
    let ways = [...waypoints];
    ways.splice(index, 1);
    setWaypoints(ways);
  };

  return (
    <>
      <Form className="distance-form">
        <Row>
          <Col sm="12" md="12" lg="8">
            <Form.Group className="mb-3">
              <Form.Label>
                Origin <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text className="bg-white border-end-0">
                  <CircleFill color="green" />
                </InputGroup.Text>
                <Autocomplete
                  className="w-75"
                  fields={["name", "geometry.location"]}
                  onLoad={(autocomplete) => setOrigin(autocomplete)}
                  onPlaceChanged={() => {}}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter origin"
                    className="border-start-0 rounded-end rounded-0"
                  />
                </Autocomplete>
                {origin === null && (
                  <Form.Label className="text-danger">
                    Please enter origin
                  </Form.Label>
                )}
              </InputGroup>
            </Form.Group>
            {waypoints.map((way, index) => {
              return (
                <Form.Group className="mb-3" key={index}>
                  <Form.Label>Stop</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="bg-white border-end-0">
                      <RecordCircleFill />
                    </InputGroup.Text>
                    <Autocomplete
                      className="w-75"
                      fields={["name", "geometry.location"]}
                      onLoad={(autocomplete) =>
                        setWayPoint(autocomplete, index)
                      }
                      onPlaceChanged={() => {}}
                    >
                      <Form.Control
                        type="text"
                        placeholder="Enter stop"
                        className="border-start-0 rounded-end rounded-0"
                      />
                    </Autocomplete>
                    <Button
                      variant="link"
                      onClick={() => removeWayPoint(index)}
                    >
                      <Trash />
                    </Button>
                  </InputGroup>
                </Form.Group>
              );
            })}

            <Form.Group className="mb-3 text-end">
              <Button
                variant="link"
                className="text-decoration-none me-4"
                onClick={addWayPoint}
              >
                <PlusCircle className="mb-1" /> Add another stop
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Destination <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text className="bg-white border-end-0">
                  <GeoAltFill color="black" />
                </InputGroup.Text>
                <Autocomplete
                  className="w-75"
                  fields={["name", "geometry.location"]}
                  onLoad={(autocomplete) => setDestination(autocomplete)}
                  onPlaceChanged={() => {}}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter destination"
                    className="border-start-0 rounded-end rounded-0"
                  />
                </Autocomplete>
                {destination === null && (
                  <Form.Label className="text-danger">
                    Please enter destination
                  </Form.Label>
                )}
              </InputGroup>
            </Form.Group>
          </Col>
          <Col sm="12" md="12" lg="4" className="submit-btn-col">
            <Button
              variant="primary"
              className="submit-btn"
              onClick={calculateRoute}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
      {mapRouteError && (
        <Alert key="danger" variant="danger">
          {mapRouteError.message}
        </Alert>
      )}
      {mapRoute && (
        <Card className="total-distance mt-4">
          <Card.Body>
            <Row>
              <Col>
                <h4>Distance</h4>
              </Col>
              <Col>
                <h2>{mapRoute.routes[0].legs[0].distance.text}</h2>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <p>
              The distance between <b>{mapRoute.request.origin.query}</b> and{" "}
              <b>{mapRoute.request.destination.query}</b> via the seleted route
              is <b>{mapRoute.routes[0].legs[0].distance.text}</b>.
            </p>
          </Card.Footer>
        </Card>
      )}
    </>
  );
}
