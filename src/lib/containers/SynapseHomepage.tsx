import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { ReactComponent as HomepageGraphic } from '../assets/decorations/homepage-composite.svg'
import { ReactComponent as OrganizeResearchGraphic } from '../assets/decorations/explore-research.svg'
import { ReactComponent as GetCreditGraphic } from '../assets/decorations/certified-microscope.svg'
import { ReactComponent as CollaborateGraphic } from '../assets/decorations/collaborate.svg'
import { ReactComponent as DataSharingGraphic } from '../assets/decorations/data-justice.svg'
import RLogo from '../assets/icons/RLogo'
import Python from '../assets/icons/Python'
import Terminal from '../assets/icons/Terminal'
import Java from '../assets/icons/Java'
import ProjectViewCarousel from './home_page/project_view_carousel/ProjectViewCarousel'
import {
  getEndpoint,
  BackendDestinationEnum,
} from '../utils/functions/getEndpoint'
import { SynapseClient } from '../utils'

export type SynapseHomepageProps = {
  token?: string
}

export const SynapseHomepage: React.FunctionComponent<SynapseHomepageProps> = ({
  token,
}) => {
  const LOGIN_LINK = `${getEndpoint(
    BackendDestinationEnum.PORTAL_ENDPOINT,
  )}#!LoginPlace:0`
  const REGISTRATION_LINK = `${getEndpoint(
    BackendDestinationEnum.PORTAL_ENDPOINT,
  )}#!RegisterAccount:0`

  // To update the carousel component, create a new version in the view. Then update it here.
  const PROJECT_VIEW_ENTITY_ID = 'syn23593547.1'

  const [dashboardLink, setDashboardLink] = useState('')

  useEffect(() => {
    const getDashboardLink = async () => {
      if (token) {
        const userProfile = await SynapseClient.getUserProfile(token)
        setDashboardLink(
          `${getEndpoint(BackendDestinationEnum.PORTAL_ENDPOINT)}#!Profile:${
            userProfile.ownerId
          }/projects`,
        )
      }
    }
    getDashboardLink()
  }, [token])

  return (
    <div className="bootstrap-4-backport SynapseHomepage">
      <div className="SynapseHomepage__Section PrimaryBackground">
        <div className="HeroContainer">
          <div className="Headline">
            <div>
              <span className="Headline-Strong">Organize</span>
              <span className="Headline-Light">
                {' '}
                your digital research assets.
              </span>
            </div>
            <div>
              <span className="Headline-Strong">Get credit</span>
              <span className="Headline-Light"> for your research.</span>
            </div>
            <div>
              <span className="Headline-Strong">Collaborate</span>
              <span className="Headline-Light">
                {' '}
                with your colleagues and the public.
              </span>
            </div>
          </div>
          <HomepageGraphic className="HeroImage" />
          <div className="SignUpButtonContainer">
            {token ? (
              <>
                <Button href={dashboardLink} variant="light">
                  View Your Dashboard
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      'https://docs.synapse.org/articles/getting_started.html',
                      '_blank',
                      'noopener',
                    )
                  }
                  variant="primary-900"
                >
                  Get Help With Synapse
                </Button>
              </>
            ) : (
              <>
                <Button href={LOGIN_LINK} variant="light">
                  Log in to Synapse
                </Button>
                <Button href={REGISTRATION_LINK} variant="primary-900">
                  Register Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="SynapseHomepage__Section WhiteBackground">
        <div className="FlexContainerReverse">
          <OrganizeResearchGraphic className="SectionGraphic" />
          <div className="SectionTextFlexContainer">
            <h2>Organize Your Digital Research Assets</h2>
            <div>
              <h3>Access Your Data Anywhere</h3>
              <p className="SectionBody">
                Synapse provides APIs to store or access your data from the web
                or programmatically via one of our supported analytical clients
                (
                <a
                  href="https://r-docs.synapse.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  R
                </a>
                ,{' '}
                <a
                  href="https://python-docs.synapse.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Python
                </a>
                ,{' '}
                <a
                  href="https://python-docs.synapse.org/build/html/CommandLineClient.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Command Line
                </a>
                ).
              </p>
            </div>
            <div>
              <h3>Query Structured Data</h3>
              <p className="SectionBody">
                Use Synapse Tables to query structured data right from your web
                browser, or from any analytical client.
              </p>
            </div>
            <Button
              variant="primary"
              href={token ? dashboardLink : REGISTRATION_LINK}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
      <div className="SynapseHomepage__Section OffWhiteBackground">
        <div className="FlexContainer">
          <GetCreditGraphic className="SectionGraphic" />
          <div className="SectionTextFlexContainer">
            <h2>Get Credit For Your Research</h2>
            <div>
              <h3>Record Provenance</h3>
              <p className="SectionBody">
                Synapse provides tools to record and display provenance of your
                analysis - giving you credit for each step of the work you do!
              </p>
            </div>
            <div>
              <h3>Mint a DOI</h3>
              <p className="SectionBody">
                A digital object identifier (DOI) provides provides a persistent
                and easy way to reference your digital assets in publications -
                including data, code, or analysis results.
              </p>
            </div>
            <Button
              variant="primary"
              href={token ? dashboardLink : REGISTRATION_LINK}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
      <div className="SynapseHomepage__Section WhiteBackground">
        <div className="FlexContainerReverse">
          <CollaborateGraphic className="SectionGraphic" />
          <div className="SectionTextFlexContainer">
            <h2>Collaborate</h2>
            <div>
              <h3>Communicate Your Findings</h3>
              <p className="SectionBody">
                Use the Synapse Wiki services to communicate your Project&apos;s
                research findings by embedding rich content such as images,
                Tables, Provenance, and even LaTeX equations.
              </p>
            </div>
            <div>
              <h3>Share Your Research</h3>
              <p className="SectionBody">
                New Synapse Projects are private by default - share with your
                colleagues, collaborators, and even make your work public!
                Create Synapse Teams to manage your collaborations.
              </p>
            </div>
            <Button
              variant="primary"
              href={token ? dashboardLink : REGISTRATION_LINK}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
      <div className="SynapseHomepage__Section OffWhiteBackground">
        <div className="FlexContainer">
          <DataSharingGraphic className="SectionGraphic" />
          <div className="SectionTextFlexContainer">
            <h2>Our Data Sharing Principles</h2>
            <div>
              <p className="SectionBody">
                Synapse operates under a complete governance process that
                includes well-documented Terms and Conditions of Use, guidelines
                and operating procedures, privacy enhancing technologies, as
                well as the right of audit and external reviews.{' '}
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() =>
                window.open(
                  'https://docs.synapse.org/articles/governance.html',
                  '_blank',
                  'noopener',
                )
              }
            >
              Learn More About Data Sharing
            </Button>
          </div>
        </div>
      </div>{' '}
      <div className="SynapseHomepage__Section WhiteBackground">
        <div className="FlexContainerReverse">
          <div className="ClientFlexContainer SectionGraphic">
            <a
              className="ClientFlexItem"
              href="https://r-docs.synapse.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RLogo />
              <span>R Client</span>
            </a>
            <a
              className="ClientFlexItem"
              href="https://python-docs.synapse.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Python />
              <span>Python Client</span>
            </a>
            <a
              className="ClientFlexItem"
              href="https://python-docs.synapse.org/build/html/CommandLineClient.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Terminal />
              <span>Command Line Client</span>
            </a>
            <a
              className="ClientFlexItem"
              href="https://github.com/Sage-Bionetworks/Synapse-Repository-Services/blob/develop/client/synapseJavaClient/src/main/java/org/sagebionetworks/client/SynapseClient.java"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Java />
              <span>Java Client</span>
            </a>
          </div>
          <div className="SectionTextFlexContainer">
            <h2>Synapse Easily Integrates Into Your Workflow</h2>
            <div>
              <p className="SectionBody">
                Create projects, upload &amp; download files, generate
                provenance, query, create wikis and more all from the comfort of
                your own code.
              </p>
            </div>
            <Button
              onClick={() =>
                window.open(
                  'https://docs.synapse.org/articles/api_documentation.html',
                  '_blank',
                  'noopener',
                )
              }
              variant="primary"
            >
              Learn More About Synapse APIs
            </Button>
          </div>
        </div>{' '}
      </div>{' '}
      <div className="SynapseHomepage__Section OffWhiteBackground">
        <div className="SynapseHomepage__Section__Centered">
          <h2>Synapse In Action</h2>
          <ProjectViewCarousel entityId={PROJECT_VIEW_ENTITY_ID} />
        </div>
      </div>{' '}
      <div className="SynapseHomepage__Section WhiteBackground">
        <div className="SynapseHomepage__Section__Centered">
          <h2>Our Partners</h2>
          <div className="PartnerFlexContainer">
            <div className="PartnerFlexItem">
              <a
                href="http://www.nhlbi.nih.gov/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="National Heart, Lung, and Blood Institute; NIH"
                  src="https://s3.amazonaws.com/static.synapse.org/images/nih-heart.svg"
                  width={'186px'}
                />
              </a>
            </div>
            <div className="PartnerFlexItem">
              <a
                href="http://www.nimh.nih.gov/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="National Institute of Mental Health; NIH"
                  src="https://s3.amazonaws.com/static.synapse.org/images/nih-mental.png"
                  width="141px"
                />
              </a>
            </div>
            <div className="PartnerFlexItem">
              <a
                href="http://www.sloan.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="Alfred P. Sloan Foundation"
                  src="https://s3.amazonaws.com/static.synapse.org/images/sloan.svg"
                  width={'186px'}
                />
              </a>
            </div>
            <div className="PartnerFlexItem">
              <a
                href="http://www.nia.nih.gov/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="National Institute on Aging; NIH"
                  src="https://s3.amazonaws.com/static.synapse.org/images/nih-aging.svg"
                  width={'186px'}
                />
              </a>
            </div>
            <div className="PartnerFlexItem">
              <a
                href="http://www.lsdfa.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="Life Sciences Discovery Fund"
                  src="https://s3.amazonaws.com/static.synapse.org/images/life-sciences.svg"
                  width={'186px'}
                />
              </a>
            </div>
            <div className="PartnerFlexItem">
              <a
                href="http://www.ctf.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="Children's Tumor Foundation"
                  src="https://s3.amazonaws.com/static.synapse.org/images/ctf.svg"
                  width={'186px'}
                />
              </a>
            </div>
            <div className="PartnerFlexItem">
              <a
                href="http://www.n-tap.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="Neurofibromatosis Therapeutic Acceleration Program"
                  src="https://s3.amazonaws.com/static.synapse.org/images/ntap.png"
                  width="113px"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="SynapseHomepage__Section PrimaryBackground">
        <div className="SynapseHomepage__Section__Centered">
          <div
            style={{
              margin: 'auto',
              maxWidth: '1400px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2 style={{ color: '#fff' }}>Sign up for Synapse today</h2>
            <div className="SignUpButtonContainer" style={{ margin: 'auto' }}>
              {token ? (
                <>
                  <Button href={dashboardLink} variant="light">
                    View Your Dashboard
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(
                        'https://docs.synapse.org/articles/getting_started.html',
                        '_blank',
                        'noopener',
                      )
                    }
                    variant="primary-900"
                  >
                    Get Help With Synapse
                  </Button>
                </>
              ) : (
                <>
                  <Button href={LOGIN_LINK} variant="light">
                    Log in to Synapse
                  </Button>
                  <Button href={REGISTRATION_LINK} variant="primary-900">
                    Register Now
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
