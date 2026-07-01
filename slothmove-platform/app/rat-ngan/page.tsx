import { JOBS_DATA } from '@/data/jobs';
import RatNganClient from './RatNganClient';
import { toSlimJob } from '@/lib/jobs-board';

export default function RatNganPage() {
  const jobs = JOBS_DATA.map(toSlimJob);

  return <RatNganClient jobs={jobs} />;
}
