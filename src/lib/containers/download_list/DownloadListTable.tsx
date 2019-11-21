import React, { useState, useEffect } from 'react'
import { EntityHeader } from '../../utils/jsonResponses/EntityHeader'
import {
  getDownloadList,
  getEntityHeader,
  getFiles,
  deleteDownloadListFiles,
  deleteDownloadList,
} from '../../utils/SynapseClient'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HasAccess from '../HasAccess'
import calculateFriendlyFileSize from '../calculateFriendlyFileSize'
import DownloadDetails from './DownloadDetails'
import { Reference } from '../../utils/jsonResponses/ReferenceList'
import useGetProfiles from '../../utils/hooks/useGetProfiles'
import { PaginatedResults } from '../../utils/jsonResponses/PaginatedResults'
import { BatchFileRequest } from '../../utils/jsonResponses/BatchFileRequest'
import { BatchFileResult } from '../../utils/jsonResponses/BatchFileResult'
import moment from 'moment'
import * as ReactBootstrap from 'react-bootstrap'
import { DownloadList } from '../../utils/jsonResponses/Download/DownloadList'
import UserCard from '../UserCard'
import {
  FileHandleAssociation,
  FileHandleAssociateType,
} from '../..//utils/jsonResponses/FileHandleAssociation'
import './DownloadList.scss'
import { CreatePackage } from './CreatePackage'

library.add(faTrash)

type DownloadListTableState = {
  isLoading?: boolean
  references?: PaginatedResults<EntityHeader>
  batchFileResult?: BatchFileResult
  downloadList?: DownloadList
}

export type DownloadListTableProps = {
  token?: string
}

export default function DownloadListTable(props: DownloadListTableProps) {
  // https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables
  let [state, setState] = useState<DownloadListTableState>({
    isLoading: true,
    references: undefined,
    batchFileResult: undefined,
    downloadList: undefined,
  })
  const { token } = props
  const { isLoading, references, batchFileResult, downloadList } = state
  const requestedFiles =
    (batchFileResult && batchFileResult.requestedFiles) || []
  const ownerIds: any = requestedFiles
    .map(el => el.fileHandle && el.fileHandle.createdBy)
    .filter(el => el)
  let userProfiles = useGetProfiles({ ids: ownerIds, token })

  useEffect(() => {
    fetchData(token)
  }, [token])

  const fetchData = async (token: string | undefined) => {
    if (!token) {
      // doesn't make sense with anonymous user!
      return
    }
    try {
      const downloadList = await getDownloadList(token)
      const { filesToDownload } = downloadList
      if (filesToDownload.length === 0) {
        setState({
          downloadList,
          isLoading: false,
        })
        return
      }
      const referenceCall: Reference[] = filesToDownload.map(el => {
        return { targetId: el.fileHandleId }
      })
      const references = await getEntityHeader(referenceCall, token)
      const batchFileRequest: BatchFileRequest = {
        requestedFiles: filesToDownload,
        includeFileHandles: true,
        includePreSignedURLs: false,
        includePreviewPreSignedURLs: false,
      }
      const batchFileResult = await getFiles(batchFileRequest, token)
      setState({
        references,
        batchFileResult,
        downloadList,
        isLoading: false,
      })
    } catch (e) {
      console.error('Error in DownloadList API call : ', e)
    }
  }

  const clearDownloadList = (
    _event: React.SyntheticEvent<HTMLButtonElement>,
  ) => {
    deleteDownloadList(token)
      .then(() => {
        setState({
          downloadList: undefined,
        })
      })
      .catch(err => {
        console.error('Error on clearing download list: ', err)
      })
  }

  const deleteFileFromList = (
    fileHandleId: string,
    associateObjectId: string,
  ) => {
    const list: FileHandleAssociation[] = [
      {
        fileHandleId,
        associateObjectId,
        associateObjectType: FileHandleAssociateType.FileEntity,
      },
    ]
    deleteDownloadListFiles(list, token)
      .then(() => {
        fetchData(token)
      })
      .catch(err => {
        console.error('Error on delete from download list', err)
      })
  }

  const filesToDownload = (downloadList && downloadList.filesToDownload) || []
  const results = (references && references.results) || []
  let numBytes = 0
  let numFiles = requestedFiles.filter(el => !el.failureCode).length
  return (
    <div>
      <div className="SRC-split download-list-table-top">
        <span className="create-package-text SRC-centerContentInline">
          Download List &nbsp;&nbsp; {isLoading && <span className="spinner" />}
        </span>
        <button
          className="SRC-primary-text-color SRC-underline-on-hover"
          onClick={clearDownloadList}
        >
          Clear All
        </button>
      </div>
      <ReactBootstrap.Table responsive={true}>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Access</th>
            <th>Created By</th>
            <th>Created On</th>
            <th>Size</th>
            {/* th below is made for trash can icon but holds no content */}
            <th />
          </tr>
        </thead>
        <tbody>
          {filesToDownload.map(item => {
            const synId = item.associateObjectId
            const fileHandleId = item.fileHandleId
            const fileResult = requestedFiles.find(
              fileRes => fileRes.fileHandleId === fileHandleId,
            )
            let createdBy = ''
            let createdOn = ''
            let fileName = ''
            let contentSize = undefined
            const fileHandle = fileResult ? fileResult.fileHandle : undefined
            if (fileHandle) {
              ;({ createdBy, createdOn, fileName, contentSize } = fileHandle)
              createdOn = moment(createdOn).format('L LT')
              numBytes += contentSize
            } else {
              const requestedFile = results.find(
                req => req.id === `syn${fileHandleId}`,
              )!
              fileName = requestedFile.name
            }
            const userProfile =
              userProfiles &&
              userProfiles.list.find(el => el.ownerId === createdBy)
            return (
              <tr key={fileHandleId}>
                <td>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.synapse.org/#!Synapse:${synId}`}
                  >
                    {fileName}
                  </a>
                </td>
                <td>
                  <HasAccess token={token} synapseId={synId} />
                </td>
                {createdBy && (
                  <td>
                    {userProfile && (
                      <UserCard
                        size={'SMALL USER CARD'}
                        userProfile={userProfile}
                        preSignedURL={
                          userProfile && userProfile.clientPreSignedURL
                        }
                      />
                    )}
                    {!userProfile && <span className="spinner" />}
                  </td>
                )}
                {createdOn && <td>{createdOn}</td>}
                {contentSize && (
                  <td>{calculateFriendlyFileSize(contentSize)}</td>
                )}
                {contentSize && (
                  <td>
                    <button
                      onClick={() => deleteFileFromList(fileHandleId, synId)}
                    >
                      <FontAwesomeIcon
                        className="SRC-primary-text-color"
                        icon="trash"
                      />
                    </button>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </ReactBootstrap.Table>
      <CreatePackage token={token}>
        <DownloadDetails
          numBytes={numBytes}
          numFiles={numFiles}
          token={token}
        />
      </CreatePackage>
    </div>
  )
}
