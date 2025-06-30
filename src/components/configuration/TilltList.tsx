import React, { useEffect } from 'react';
import { Box, Button, Text } from '@mantine/core';
import { IconRotateClockwise } from '@tabler/icons-react';
import { Trans, useTranslation } from 'react-i18next';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useListState } from '@mantine/hooks';
import { useAppContext } from '@/context/useAppContext.ts';
import { TiltItem } from '@/components/configuration/TiltItem';
import classes from '@/components/configuration/DndTilts.module.css';

export const TiltList: React.FC = () => {
  const { t } = useTranslation();
  const { firmwareOptions } = useAppContext();
  const { tilts: contextTilts, setTilts: setContextTilts } = useAppContext();
  const [tiltList, tiltHandlers] = useListState(contextTilts);

  useEffect(() => {
    setContextTilts(tiltList);
  }, [tiltList, setContextTilts]);

  return (
    <>
      <Text>
        <Trans i18nKey="configuration.tilt.init" components={{ strong: <strong /> }} />
      </Text>
      <Box mb="md" className={classes.dragListButton}>
        <Button
          variant="outline"
          onClick={() => {
            const sorted = [...tiltList].sort((a, b) => a.color.name.localeCompare(b.color.name));
            tiltHandlers.setState(sorted);
          }}
          leftSection={<IconRotateClockwise size={14} />}
        >
          {t('button.restore_order.title')}
        </Button>
      </Box>
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          if (destination && source.index !== destination.index) {
            tiltHandlers.reorder({ from: source.index, to: destination.index });
          }
        }}
      >
        <Droppable droppableId="tilts-droppable" direction="vertical">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tiltList.map((tilt, index) => (
                <TiltItem
                  key={tilt.key}
                  tilt={tilt}
                  index={index}
                  firmwareOptions={firmwareOptions}
                  onChange={(i, field, value) => tiltHandlers.setItemProp(i, field, value)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
