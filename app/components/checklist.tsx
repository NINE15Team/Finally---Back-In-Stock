import { Link, Text, Card } from '@shopify/polaris';
import CustomCheckBox from './checkbox';
import './Checklist.scss'; // Import the Sass file

export default function Checklist() {
  return (
    <>
      <div className="header"> {/* Use classNames for styling */}
        <Text variant="headingXl" as="h2">Welcome to Finally!</Text>
        <Link url="/app/instructions">View installation guide</Link>
      </div>
      <p className='section-p'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu.
      </p>
      <div className='checklist'>
        <Card roundedAbove="xs" padding={'800'}>
          <Text as="h3" variant="bodyMd">Checklist</Text>
          <div className="checkbox-wrapper"> {/* Use classNames for styling */}
            <CustomCheckBox label="Install the Finally! back in stock notification widget." />
            <CustomCheckBox label="View and test the Finally! back in stock notification widget." />
            <CustomCheckBox label="Install the Finally! back in stock notification widget." />
            <CustomCheckBox label="Install the Finally! back in stock notification widget." />
          </div>
        </Card>
      </div>
    </>
  );
}
