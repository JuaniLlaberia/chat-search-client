import { TimelineEvent } from '@/types';
import {
  Timeline,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from '../ui/timeline';
import { formatDate } from '@/lib/format-date';

const MessageTimeline = ({ events }: { events: TimelineEvent[] }) => {
  return (
    <>
      <div className='flex justify-center mt-8'>
        <Timeline>
          {events.map(({ title, content, start_date }, i) => (
            <TimelineItem key={i}>
              <TimelineHeader>
                <TimelineTime>{formatDate(start_date)}</TimelineTime>
                <TimelineTitle>{title}</TimelineTitle>
              </TimelineHeader>
              {content && <TimelineDescription>{content}</TimelineDescription>}
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </>
  );
};

export default MessageTimeline;
