import React from 'react';
import { Box, Button } from '@mantine/core';
import { IconRotateClockwise } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAppContext } from '@/context/useAppContext';
import { TiltItem } from '@/components/configuration/TiltItem';
import classes from '@/components/configuration/DndTilts.module.css';

export const TiltList: React.FC = () => {
  const { t } = useTranslation();
  const { tilts, tiltHandlers } = useAppContext();

  return (
    <>
      <Box className={classes.dragListButton}>
        <Button
          variant="outline"
          onClick={() => {
            const sorted = [...tilts].sort((a, b) => a.color.name.localeCompare(b.color.name));
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
              {tilts.map((tilt, index) => (
                <TiltItem
                  key={tilt.key}
                  tilt={tilt}
                  index={index}
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
