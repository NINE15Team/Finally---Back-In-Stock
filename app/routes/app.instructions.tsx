import { BlockStack, Box, Button, Layout, Page, Spinner, Text } from '@shopify/polaris';
import { useNavigation } from '@remix-run/react';

import step1 from "../image/step_1.png";
import step2 from "../image/step_2.png";
import step3_4 from "../image/step_3_4.png";
import step5_6 from "../image/step_5_6.png";
import InstructionCard from '~/components/instruction-card';

export default function Instructions({ showButton }: { showButton: boolean }) {
  const navigation = useNavigation();

  const instructionList: any = [
    {
      title: '1. Navigate to theme settings',
      description: <Text as='p'>Click on <Text as='strong'>Themes</Text> under the Online Store section and then click <Text as='strong'>Customize</Text> as shown on the picture. </Text>,
      img_url: step1
    },
    {
      title: '2. Navigate to the PDP',
      description: <div className="instruction-info">
        <Text as='p'>Navigate to the Product page from the top nav.</Text>
        <Text as='p'>Then click <Text as='strong'>Add Block</Text> on the left panel.</Text>
      </div>,
      img_url: step2,
    },
    {
      title: '3. Add the Finally Block',
      description: <Text as='p'>Click on <Text as='strong'>Apps</Text> Then select <Text as='strong'>Finally! Back in Stock.</Text></Text>,
      img_url: step3_4,
    },
    {
      title: '4. Customize the look',
      description: <Text as='p'>Customize the look to fit your theme and brand then click <Text as='strong'>Save.</Text></Text>,
      img_url: step5_6,
    }
  ];

  return (
    <Page>
      <Layout>
        {instructionList.map((e: any, index: number) => (
          <InstructionCard key={index} title={e.title} description={e.description} img_url={e.img_url} />
        ))}

        {showButton &&
          <BlockStack inlineAlign="end">
            <Box paddingBlockStart="200">
              {navigation.state == 'idle' ?
                <Button variant="primary" tone="critical" submit={true}>Proceed</Button> :
                <Spinner accessibilityLabel="Spinner example" size="small" />
              }
            </Box>
          </BlockStack>}

      </Layout>

    </Page >
  );
}
