import { Container } from "react-bootstrap";
import Header from "./components/Header";
import DistanceCalculator from "./screens/DisanceCatculator";

function App() {
  return (
    <>
      <Header />
      <Container>
        <DistanceCalculator />
      </Container>
    </>
  );
}

export default App;
