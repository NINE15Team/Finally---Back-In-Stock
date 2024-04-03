import { Text, Card } from '@shopify/polaris';
import no_request from "../image/no-request.png";

export default function NoRequest() {
  return (
    <div className='card-wrapper full-width b-section'>
      <Card roundedAbove="xs" padding={'800'}>
        <img className='home-image' src={no_request} height="226px" width="226px" alt="customize"/>
        <Text as='h3' alignment='center'>You haven't had any requests yet.</Text>
        <Text as='p' alignment='center'>Please make sure you have the Finally! widget installed and configured.</Text>
      </Card>
    </div>
  );
}
