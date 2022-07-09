import { Card } from 'react-bootstrap';
import CustomScroll from 'react-custom-scroll';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useWindowSize, useElementSize } from 'usehooks-ts';
import LoadingDots from '../components/LoadingDots';
import useRules from '../data/useRules';
import getThinLayout from '../layouts/thin';
import { bgColors, fgColors } from '../util/highlightColors';
import { highlightMdAll } from '../util/lines';
import { NextPageWithLayout } from './_app';
import GetThinScrollableLayout from '../layouts/thinScrollable';

const Rules: NextPageWithLayout = () => {
  const rules = useRules()

  return (
    <Card bg='dark' text='light' className='m-3'>
      <Card.Body>
        {
          rules.loading ? <LoadingDots /> :
            rules.rules ?
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {highlightMdAll(rules.rules.markdown, fgColors, bgColors, rules.rules.savedBy || '?', rules.rules.timestamp || '1')}
              </ReactMarkdown>
              :
              <div>
                {rules.error?.error}
              </div>
        }
      </Card.Body>
    </Card>
  )
}
Rules.getLayout = GetThinScrollableLayout
export default Rules

