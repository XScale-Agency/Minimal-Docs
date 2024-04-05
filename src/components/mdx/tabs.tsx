import { Children, useMemo } from 'react';
import { z } from 'zod';
import { MDXErrorBlock } from './error-block';
import { Tabs } from '@mantine/core';
import { dashCase } from '@/lib/helpers/dash-case';

interface TabProps {
  title: string[];
  children: React.ReactNode;
}

const childZod = z
  .array(
    z.object({
      type: z.literal('div'),
      props: z.object({
        children: z.any(),
      }),
    })
  )
  .min(2);

export const MDXTab = ({ children, title }: TabProps) => {
  const parseResult = useMemo(() => {
    return childZod.safeParse(Children.toArray(children));
  }, [children]);

  if (!parseResult.success) {
    console.log('MDXTab', children);

    return (
      <MDXErrorBlock
        error={{
          message: 'Invalid tabs block',
          error: parseResult.error,
        }}
      />
    );
  }

  if (parseResult.data.length !== title.length) {
    console.log('MDXTab', children, title);

    return (
      <MDXErrorBlock
        error={{
          message: 'Invalid tabs block',
          error: new Error('Number of tabs and titles do not match'),
        }}
      />
    );
  }

  return (
    <Tabs defaultValue={dashCase(title[0])}>
      <Tabs.List>
        {Children.toArray(
          title.map((tab) => <Tabs.Tab value={dashCase(tab)}>{tab}</Tabs.Tab>)
        )}
      </Tabs.List>

      {Children.toArray(
        parseResult.data.map((tab, index) => (
          <Tabs.Panel value={dashCase(title[index])} mt="xs">
            {tab.props.children}
          </Tabs.Panel>
        ))
      )}
    </Tabs>
  );
};
