import React, { ReactElement, useState } from 'react'
import { Link } from '@material-ui/core'
import { DataDictionaryData } from './types/IDataDictionaryTypes'
import EntityDetailViewer from './EntityDetailViewer'
import { stateData } from './state/DataState'

interface IdLinkProps {
  id: string
  parent?: string
}

function IdLink({ id, parent }: IdLinkProps): ReactElement {
  const data: DataDictionaryData[] = stateData()
  const itemData: DataDictionaryData | undefined = data.find(
    item => item.id === id,
  )
  const [entityDetailViewerOpen, setEntityDetailViewerOpen] = useState<boolean>(
    false,
  )
  const isParent: boolean = parent === id

  return itemData && !isParent ? (
    <>
      <Link
        href={`#`}
        title={`View details of ${id}`}
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          event.preventDefault()
          setEntityDetailViewerOpen(true)
        }}
      >
        {id}
      </Link>
      <EntityDetailViewer
        open={entityDetailViewerOpen}
        onClose={() => setEntityDetailViewerOpen(false)}
        entity={itemData}
      />
    </>
  ) : (
    <>{id}</>
  )
}

export default IdLink