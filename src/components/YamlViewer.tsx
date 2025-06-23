import React from 'react'
import { Button, Group } from '@mantine/core'
import { IconCheck, IconCopy, IconDownload } from '@tabler/icons-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTranslation } from 'react-i18next'

interface YamlViewerProps {
  code: string
  filename?: string
  maxHeight?: number
}

export const YamlViewer: React.FC<YamlViewerProps> = ({
  code,
  filename = 'tiltsense.yaml',
  maxHeight = 600
}) => {
  const { t } = useTranslation()
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/yaml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ position: 'relative' }}>
      <Group justify="flex-end" mb="xs">
        <Button
          onClick={handleCopy}
          variant="subtle"
          size="xs"
          leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
        >
          {copied ? t('button.copy.shiftedTitle') : t('button.copy.title')}
        </Button>
        <Button
          onClick={handleDownload}
          variant="subtle"
          size="xs"
          leftSection={<IconDownload size={14} />}
        >
          {t('button.download.title')}
        </Button>
      </Group>
      <SyntaxHighlighter
        language="yaml"
        style={darcula}
        customStyle={{
          maxHeight,
          overflowY: 'auto'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
