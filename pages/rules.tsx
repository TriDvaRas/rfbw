import { Card } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import LoadingDots from '../components/LoadingDots';
import useRules from '../data/useRules';
import GetThinLayout from '../layouts/thin';
import { bgColors, fgColors } from '../util/highlightColors';
import { highlightMdAll } from '../util/lines';
import { NextPageWithLayout } from './_app';

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
Rules.getLayout = GetThinLayout
export default Rules

