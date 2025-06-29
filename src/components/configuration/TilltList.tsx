import React, { useEffect } from 'react';
import { Box, Button, Checkbox, Text, TextInput } from '@mantine/core';
import { IconGripVertical, IconRotateClockwise, IconTestPipe2Filled } from '@tabler/icons-react';
import { Trans, useTranslation } from 'react-i18next';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import cx from 'clsx';
import classes from '@/components/configuration/DndTilts.module.css';
import { useListState } from '@mantine/hooks';
import { useAppContext } from '@/context/useAppContext.ts';

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
      <Box mb="md" style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                <Draggable key={tilt.key} draggableId={tilt.key} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cx(classes.item, {
                        [classes.itemDragging]: snapshot.isDragging,
                      })}
                    >
                      <Box style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Box {...provided.dragHandleProps} className={classes.dragHandle}>
                          <IconGripVertical size={20} />
                        </Box>
                        <Box style={{ width: 24 }}>
                          <IconTestPipe2Filled size={24} color={tilt.color.hexColor} />
                        </Box>
                        <Box style={{ minWidth: 100 }}>
                          <Checkbox
                            label={t(`tilt.colors.${tilt.color.name}`)}
                            checked={tilt.enabled}
                            onChange={(event) => {
                              const checked = event.currentTarget.checked;
                              tiltHandlers.setItemProp(index, 'enabled', checked);
                            }}
                          />
                        </Box>
                        <Box style={{ minWidth: 80 }}>
                          {tilt.enabled && (
                            <Checkbox
                              label={t('configuration.tilt.fields.tilt.pro')}
                              checked={tilt.isPro}
                              onChange={(event) => {
                                const checked = event.currentTarget.checked;
                                tiltHandlers.setItemProp(index, 'isPro', checked);
                              }}
                            />
                          )}
                        </Box>
                        <Box style={{ flex: 1 }}>
                          {tilt.enabled &&
                            firmwareOptions.ha &&
                            firmwareOptions.enablePressureSensors && (
                              <TextInput
                                style={{ width: 600 }}
                                placeholder={t(
                                  'configuration.tilt.fields.pressureSensor.placeholder'
                                )}
                                value={tilt.haPressureSensor}
                                onChange={(event) => {
                                  const value = event.currentTarget.value;
                                  tiltHandlers.setItemProp(index, 'haPressureSensor', value);
                                }}
                              />
                            )}
                        </Box>
                      </Box>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
